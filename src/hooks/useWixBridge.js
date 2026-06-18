import { useEffect, useState, useCallback } from 'react';
import { saveBookRating, saveRemarks, clearAll } from '../data/storage';

// Detect if this React app is running inside a Wix iframe
function isInsideIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    // Cross-origin access blocked = definitely in iframe
    return true;
  }
}

/**
 * useWixBridge — bridges the React app (embedded via iframe) with the Wix parent page.
 *
 * In Wix (iframe) mode:
 *   1. React app sends { type: 'SKILL_TRACKER_READY' } to Wix parent on mount.
 *   2. Wix parent responds with { type: 'WIX_INIT', canEdit, role, memberId, scores, remarks }.
 *   3. Hook preloads received scores + remarks into localStorage so existing components work.
 *   4. When user saves scores → React sends { type: 'SAVE_SCORES', ... } to Wix parent.
 *   5. When user saves remarks → React sends { type: 'SAVE_REMARKS', ... } to Wix parent.
 *   6. Wix parent handles all actual CMS writes.
 *
 * In standalone / dev mode (not in iframe):
 *   - wixReady = true immediately, canEdit = true, CMS calls are no-ops.
 */
export default function useWixBridge() {
  // If not in iframe, we're in dev/standalone mode — ready immediately with full edit
  const [wixReady, setWixReady] = useState(() => !isInsideIframe());
  const [canEdit, setCanEdit]   = useState(true);
  const [role,    setRole]      = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [inWix,   setInWix]    = useState(false);

  // Send a postMessage to the Wix parent page (no-op in standalone mode)
  const sendToWix = useCallback((message) => {
    if (isInsideIframe()) {
      window.parent.postMessage(message, '*');
    }
  }, []);

  useEffect(() => {
    const inside = isInsideIframe();
    setInWix(inside);

    if (!inside) {
      // Standalone / dev mode — full edit access, no CMS needed
      setCanEdit(true);
      setWixReady(true);
      return;
    }

    // Listen for WIX_INIT message from the Wix parent page
    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg || msg.type !== 'WIX_INIT') return;

      const { canEdit: ce, role: r, memberId: mid, scores, remarks } = msg;

      setCanEdit(!!ce);
      setRole(r || null);
      setMemberId(mid || null);

      // Clear old local ratings to sync with the incoming database scores from Wix CMS
      clearAll();

      // Preload existing CMS scores into localStorage so BookCard + ProgressBar work
      if (Array.isArray(scores)) {
        scores.forEach(score => {
          if (score.bookId && score.ratings) {
            saveBookRating(score.bookId, score.ratings);
          }
        });
      }

      // Preload remarks into localStorage
      if (typeof remarks === 'string') {
        saveRemarks(remarks);
      }

      setWixReady(true);
    };

    window.addEventListener('message', handleMessage);

    // Tell Wix page this React app is mounted and ready to receive WIX_INIT
    // (handles the race condition where Wix may have already loaded first)
    window.parent.postMessage({ type: 'SKILL_TRACKER_READY' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  /**
   * Call this after user successfully saves book scores locally (home_learner only).
   * Sends ratings data to Wix parent which handles the CMS write.
   */
  const saveScoresToWix = useCallback((bookId, bookName, ratings) => {
    sendToWix({
      type:     'SAVE_SCORES',
      bookId,
      bookName,
      ratings   // { cognitive, creative, communication, socialEmotional, physical, practical }
    });
  }, [sendToWix]);

  /**
   * Call this after user saves remarks locally (home_learner only).
   * Sends remarks text to Wix parent which updates UserRoles.tutorComment.
   */
  const saveRemarksToWix = useCallback((remarks) => {
    sendToWix({
      type: 'SAVE_REMARKS',
      remarks
    });
  }, [sendToWix]);

  /**
   * Call this after user clears ratings (undoes book ratings) locally.
   * Sends bookId to Wix parent which deletes the entry from BookScores CMS.
   */
  const deleteScoresFromWix = useCallback((bookId) => {
    sendToWix({
      type: 'DELETE_SCORES',
      bookId
    });
  }, [sendToWix]);

  return {
    wixReady,        // false until WIX_INIT received (in iframe), true immediately (standalone)
    canEdit,         // true for home_learner, false for tutor_student
    role,            // 'home_learner' | 'tutor_student' | null
    memberId,        // Wix member ID string
    inWix,           // true if running inside Wix iframe
    saveScoresToWix,
    saveRemarksToWix,
    deleteScoresFromWix
  };
}
