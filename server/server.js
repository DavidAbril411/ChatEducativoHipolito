import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-flash-1.5-8b';
const APP_REFERER = process.env.APP_REFERER || 'https://hipolito.abrilcodes.com';
const APP_TITLE = process.env.APP_TITLE || 'Hipolito Chat Educativo';

if (!OPENROUTER_API_KEY) {
  console.warn('WARNING: OPENROUTER_API_KEY not set. Set it via environment variable.');
}

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'hipolito-chat-backend',
    provider: 'openrouter',
    hasCredentials: Boolean(OPENROUTER_API_KEY),
    model: OPENROUTER_MODEL
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, temperature = 0.4, max_tokens = 500, top_p = 0.7 } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'Server missing OPENROUTER_API_KEY' });
    }

    const payload = {
      model: OPENROUTER_MODEL,
      messages,
      temperature,
      top_p,
      max_tokens,
      stream: false
    };

    const resp = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': APP_REFERER,
        'X-Title': APP_TITLE
      },
      body: JSON.stringify(payload)
    });

    const json = await resp.json();

    if (!resp.ok) {
      console.error('OpenRouter API error:', resp.status, JSON.stringify(json));
      return res.status(resp.status).json(json);
    }

    return res.json(json);
  } catch (err) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: 'internal_error', detail: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Hipolito chat backend listening on :${PORT} — model: ${OPENROUTER_MODEL}`);
});
