import { useRef, useEffect, useState } from 'react';

/**
 * Custom hook to reliably track component mount status
 * @returns {Object} Object containing isMounted function and mountState to check if component is mounted
 */
const useMountStatus = () => {
  const mountedRef = useRef(false);
  const [mountState, setMountState] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    setMountState(true);

    return () => {
      mountedRef.current = false;
      setMountState(false);
    };
  }, []);

  const isMounted = () => mountedRef.current;

  return { isMounted, mountState };
};

export default useMountStatus;
