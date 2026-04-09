export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!body?.messages?.length) {
      return res.status(400).json({ error: 'Body inválido — se requiere messages' });
    }

    // Extraer el prompt del formato Anthropic que manda el frontend
    const prompt = body.messages.map(m => m.content).join('\n');

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: body.max_tokens || 600 },
        }),
      }
    );

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({ error: geminiData.error?.message || 'Error de Gemini' });
    }

    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Devolver en formato Anthropic para que el frontend no cambie
    return res.status(200).json({
      content: [{ type: 'text', text }],
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno', detail: err.message });
  }
}
