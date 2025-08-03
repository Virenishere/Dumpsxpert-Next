import { useState, useCallback } from "react";

export default function useGlobalLoading() {
  const [loading, setLoading] = useState(false);
  const showLoading = useCallback(() => setLoading(true), []);
  const hideLoading = useCallback(() => setLoading(false), []);
  return { loading, showLoading, hideLoading };
}
