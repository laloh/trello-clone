import { useRef, useEffect } from "react";

// Ref provide a way to reference the actual DOM nodes of rendered React Elements
export const useFocus = () => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return ref;
};
