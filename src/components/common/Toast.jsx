import { useState, useEffect, useCallback } from 'react';

let showToastGlobal = () => {};

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = useCallback((msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => { showToastGlobal = show; }, [show]);

  return { toast, show };
}

export { showToastGlobal as showToast };

export default function Toast({ toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`toast ${toast.isError ? 'toast-error' : 'toast-success'} ${visible ? 'show' : ''}`}>
      {toast.msg}
    </div>
  );
}
