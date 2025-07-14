import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://your-app-url.vercel.app', // update for production
    'X-Title': 'AI Blog Summarizer',
  },
});

export async function translateSummaryToUrdu(summary: string) {
  try {
    const res = await client.chat.completions.create({
      model: 'openrouter/auto', // ✅ Let OpenRouter choose
      messages: [
        {
          role: 'user',
          content: `Translate this blog summary into Urdu:\n\n${summary}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 1000,
    });

    const text = res.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return { success: false, error: 'No translation returned' };
    }

    return { success: true, urduTranslation: text };

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Translation error:', msg);
    return { success: false, error: msg };
  }
}
