import 'dotenv/config'
import express from 'express'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const app = express()
app.use(express.json({ limit: '1mb' }))

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// Load RAG index
let vectorStore = null;
let modelInstance = null;
let startupError = null;
(async () => {
  try {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
    if (!apiKey) {
      startupError = 'Missing OPENAI_API_KEY or OPENAI_KEY environment variable.';
      console.error(startupError);
      return;
    }

    const openAIConfig = {
      ...(process.env.OPENAI_BASE_URL ? { baseURL: process.env.OPENAI_BASE_URL } : {}),
      ...(process.env.OPENAI_ORGANIZATION ? { organization: process.env.OPENAI_ORGANIZATION } : {}),
    };

    const model = new ChatOpenAI({
      openAIApiKey: apiKey,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.7,
      configuration: openAIConfig,
    });

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      configuration: openAIConfig,
    });

    const pdfPath = join(__dirname, '../public/cv.pdf');
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();

    vectorStore = await Chroma.fromDocuments(docs, embeddings, {});
    modelInstance = model;

    console.log("RAG index loaded successfully");
  } catch (err) {
    startupError = err instanceof Error ? err.message : String(err);
    console.error("Failed to load RAG index:", err);
  }
})();

app.post('/api/chat', async (req, res) => {
  try {
    if (!vectorStore || !modelInstance) {
      res.status(500).json({ error: `RAG service unavailable. ${startupError ?? 'Initialization failed.'}` });
      return;
    }

    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const query = messages.filter(m => m.role === 'user').pop()?.content;
    if (!query) {
      res.status(400).json({ error: 'No user query found.' });
      return;
    }

    const relevantDocs = await vectorStore.similaritySearch(query, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join('\n');
    const prompt = `Use the following context to answer the question. If the context doesn't contain the information, say so.\n\nContext: ${context}\n\nQuestion: ${query}\nAnswer:`;

    const response = await modelInstance.invoke(prompt);
    const content = response.content;
    res.json({ content });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
})

const port = Number(process.env.PORT || 8787)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Live chat server listening on http://localhost:${port}`)
})

