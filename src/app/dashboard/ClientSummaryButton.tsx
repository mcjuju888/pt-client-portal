'use client';
import { useState } from 'react';

export default function ClientSummaryButton() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/summary', { method: 'POST' });
      const data = await res.json();
      setSummary(data.summary ?? 'No summary available.');
    } catch (err) {
      console.error(err);
      setSummary('Error generating summary.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-xl p-4 space-y-2">
      <button
        onClick={generate}
        disabled={loading}
        className="border rounded-xl px-3 py-2"
      >
        {loading ? 'Thinking…' : 'Generate weekly AI summary'}
      </button>

      {summary && (
        <pre className="whitespace-pre-wrap border-t pt-2 text-sm">
          {summary}
        </pre>
      )}
    </div>
  );
}
