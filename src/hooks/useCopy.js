import { useState, useRef } from 'react';

/**
 * Copy-to-clipboard with toast feedback.
 * Returns [toastMessage, copyFn].
 */
export default function useCopy() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const copy = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
    }
    setToast(label || `Copied "${text}"`);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 1600);
  };

  return [toast, copy];
}
