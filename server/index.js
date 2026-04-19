import 'dotenv/config'
import express from 'express'
import OpenAI from 'openai'

const app = express()
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      res.status(500).json({ error: 'Missing OPENAI_API_KEY in environment.' })
      return
    }

    const client = new OpenAI({ apiKey })
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : []

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.7,
    })

    const content = completion.choices?.[0]?.message?.content ?? ''
    res.json({ content })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ error: msg })
  }
})

const port = Number(process.env.PORT || 8787)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Live chat server listening on http://localhost:${port}`)
})

