import { useEffect } from "react";

/**
 * Wrapper around useEffect to run just once on mount.
 * https://stackoverflow.com/questions/53120972/how-to-call-loading-function-with-react-useeffect-only-once/56767883#56767883
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (fun: React.EffectCallback) => useEffect(fun, []);
