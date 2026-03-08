import { useState, useEffect, useCallback } from "react";

/**
 * Generic hook for fetching data from an API function.
 * @param {Function} apiFn  - API function that returns a promise
 * @param {Array}    deps   - dependency array to re-fetch
 * @param {boolean}  immediate - whether to fetch on mount
 */
export default function useFetch(apiFn, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
}
