import { useCallback, useEffect, useState } from "react";

// Custom hook: fetch API + loading / error state + retry + request cancelling
export default function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: Boolean(url), error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!url) return undefined;
    const controller = new AbortController();

    setState((previous) => ({ ...previous, loading: true, error: null }));

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        return response.json();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ data: null, loading: false, error: err.message || "Network error" });
      });

    return () => controller.abort();
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
