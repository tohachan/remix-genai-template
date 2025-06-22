import { useState, useEffect } from 'react';

interface BrowserOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * BrowserOnly component prevents hydration mismatches by rendering children
 * only after the component has hydrated on the client side.
 *
 * Use this wrapper for components that depend on browser APIs or client-side state
 * that may differ between server and client renders.
 */
export default function BrowserOnly({ children, fallback = null }: BrowserOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
