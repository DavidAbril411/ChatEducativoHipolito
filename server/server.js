import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VERTEX_API_KEY || process.env.GOOGLE_API_KEY;
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

if (!GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY not set. Set it via environment variable.');
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
    provider: 'gemini',
    hasCredentials: Boolean(GEMINI_API_KEY),
    model: GEMINI_DEFAULT_MODEL
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { model, messages, temperature = 0.4, max_tokens = 500, top_p = 0.7 } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
    }

    const geminiModel = model || GEMINI_DEFAULT_MODEL;
    const { contents, systemInstructionParts } = mapMessagesToGemini(messages);

    if (contents.length === 0) {
      return res.status(400).json({ error: 'Gemini requires at least one non-system message' });
    }

    const payload = {
      contents,
      generationConfig: {
        temperature,
        topP: top_p,
        maxOutputTokens: max_tokens
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
      ]
    };

    if (systemInstructionParts.length > 0) {
      payload.systemInstruction = { role: 'user', parts: systemInstructionParts };
    }

    const url = `${GEMINI_API_BASE}/models/${encodeURIComponent(geminiModel)}:generateContent?key=${GEMINI_API_KEY}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await resp.json();

    if (!resp.ok) {
      console.error('Gemini API error:', resp.status, JSON.stringify(json));
      return res.status(resp.status).json(json);
    }

    return res.json(extractReply(json, geminiModel));
  } catch (err) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: 'internal_error', detail: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Hipolito chat backend listening on :${PORT} — model: ${GEMINI_DEFAULT_MODEL}`);
});

function mapMessagesToGemini(messages = []) {
  const contents = [];
  const systemInstructionParts = [];

  for (const msg of messages) {
    if (!msg?.role) continue;
    const parts = normaliseContent(msg.content);

    if (msg.role === 'system') {
      systemInstructionParts.push(...parts);
      continue;
    }

    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: parts.length > 0 ? parts : [{ text: '' }]
    });
  }

  return { contents, systemInstructionParts };
}

function normaliseContent(content) {
  if (content == null) return [{ text: '' }];
  if (typeof content === 'string') return [{ text: content }];
  if (Array.isArray(content)) {
    const parts = content.map(item => {
      if (typeof item === 'string') return { text: item };
      if (item?.type === 'text') return { text: item.text ?? '' };
      if (typeof item?.content === 'string') return { text: item.content };
      return null;
    }).filter(Boolean);
    return parts.length > 0 ? parts : [{ text: '' }];
  }
  if (typeof content === 'object') {
    if (typeof content.text === 'string') return [{ text: content.text }];
    if (typeof content.content === 'string') return [{ text: content.content }];
  }
  return [{ text: String(content) }];
}

function extractReply(json, model) {
  const { candidates = [], usageMetadata } = json || {};
  const first = candidates.find(c => c?.content?.parts?.length > 0);
  const text = first
    ? first.content.parts.map(p => p.text || '').join('').trim()
    : '';

  return {
    id: `gemini-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{
      index: 0,
      message: { role: 'assistant', content: text },
      finish_reason: first?.finishReason || 'stop'
    }],
    usage: usageMetadata ? {
      prompt_tokens: usageMetadata.promptTokenCount,
      completion_tokens: usageMetadata.candidatesTokenCount,
      total_tokens: usageMetadata.totalTokenCount
    } : undefined
  };
}
