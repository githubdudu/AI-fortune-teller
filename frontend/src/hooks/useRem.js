/**
 * @description: This hook is used to get the root font size of the document.
 *
 */
import { useEffect, useState } from 'react';
function useRem() {
  const [rem, setRem] = useState(16); // Default to 16px
  useEffect(() => {
    const updateRem = () => {
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      setRem(rootFontSize);
    };
    updateRem();
  }, []);
  return rem;
}
export default useRem;
