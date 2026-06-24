import React, { useEffect, useState } from "react";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import { fetchHistory } from "../api";
import HistoryCard from "./HistoryCard";

export default function HistoryPage() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      if (!isLoaded || !isSignedIn) return;

      setLoading(true);
      setError(null);

      try {
        let token = null;
        for (let attempt = 0; attempt < 3; attempt += 1) {
          token = await getToken({ force: true });
          if (token) break;
        }

        if (!token) {
          throw new Error("No auth token available");
        }

        const data = await fetchHistory(token);
        if (isMounted) setSearches(data);
      } catch {
        if (isMounted) setError("Failed to load search history.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-dark" role="status" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="text-center py-5">
        <h4 className="fw-semibold mb-2">Sign in to view your search history</h4>
        <p className="text-muted mb-4">
          Your searches are saved when you're signed in so you can revisit them any time.
        </p>
        <SignInButton mode="modal">
          <button className="btn btn-dark px-4">Sign In</button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">My Searches</h4>
        {searches.length > 0 && (
          <span className="text-muted small">{searches.length} search{searches.length !== 1 ? "es" : ""}</span>
        )}
      </div>

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-dark" role="status" />
        </div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && !error && searches.length === 0 && (
        <div className="text-center py-5 text-muted">
          <p className="mb-1 fw-semibold">No searches yet</p>
          <p className="small">Upload an outfit on the home page to get started.</p>
        </div>
      )}

      {searches.map((item) => (
        <HistoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
