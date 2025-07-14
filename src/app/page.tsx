'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function BlogSummarizer() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');
    setTranslated('');
    setShowTranslation(false);

    try {
      const scrapeRes = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const scrapeData = await scrapeRes.json();
      if (!scrapeRes.ok) throw new Error(scrapeData.error || 'Failed to scrape');

      setSummary(scrapeData.summary);

      const translateRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: scrapeData.summary }),
      });

      const translateData = await translateRes.json();
      if (!translateRes.ok) throw new Error(translateData.error || 'Failed to translate');

      setTranslated(translateData.urduTranslation || '');
 } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    console.error('Summarize Error:', message);
    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e003e] to-[#12001c] px-4 py-12 text-white">
      <Card className="w-full max-w-xl p-6 shadow-xl rounded-2xl bg-[#2b0047] border border-[#52057b]">
        <CardContent className="space-y-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d000f7] to-[#69b4ff] text-center tracking-widest uppercase">
            Blog Summarizer
          </h1>

          <div className="space-y-2">
            <Input
              placeholder="https://example.com/blog-post"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              className="h-11 text-base px-4 bg-[#3f005d] text-white placeholder-purple-300 border border-[#6a00a5]"
            />
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>

          <Button
            onClick={handleSummarize}
            className="w-full h-10 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Summary'}
          </Button>

          {summary && (
            <div>
              <Label className="text-md font-semibold mb-1 block text-purple-200 italic">
                Summary
              </Label>
              <Textarea
                value={summary}
                readOnly
                rows={Math.min(Math.ceil(summary.split(' ').length / 10), 8)}
                className="resize-none bg-[#3f005d] text-white border border-[#6a00a5]"
              />
            </div>
          )}

          {summary && translated && !showTranslation && (
            <Button
              onClick={() => setShowTranslation(true)}
              className="w-full h-10 bg-[#6e40c9] hover:bg-[#5a32aa] text-white font-bold"
            >
              Show Urdu Translation
            </Button>
          )}

          {translated && showTranslation && (
            <div>
              <Label className="text-md font-semibold mb-1 block text-purple-200 italic">
                Urdu Translation
              </Label>
              <Textarea
                value={translated}
                readOnly
                rows={Math.min(Math.ceil(translated.split(' ').length / 8), 8)}
                className="resize-none bg-[#3f005d] text-white border border-[#6a00a5]"
                style={{ direction: 'rtl' }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}