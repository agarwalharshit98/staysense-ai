
const { GoogleGenAI } = require("@google/genai");
const DEFAULT_PROVIDER = 'gemini';

function getPromptVariants() {
  return [
    {
      id: 'balanced',
      name: 'Balanced summary',
      systemPrompt: 'You are a helpful hospitality assistant. Summarise the guest review and suggest a polite reply.'
    },
    {
      id: 'concise',
      name: 'Concise summary',
      systemPrompt: 'You are a concise hospitality assistant. Give a short summary and one short reply.'
    },
    {
      id: 'insightful',
      name: 'Insightful summary',
      systemPrompt: 'You are an expert hospitality analyst. Highlight key themes, sentiment, and offer a thoughtful reply.'
    }
  ];
}

function buildPrompt(text, variantId = 'balanced') {
  const variant = getPromptVariants().find((item) => item.id === variantId) || getPromptVariants()[0];
  return [
    `Variant: ${variant.id} (${variant.name})`,
    `${variant.systemPrompt}`,
    'Respond with two lines only:',
    'SUMMARY: <one sentence summary>',
    'REPLY: <one short reply>',
    '',
    `Guest review: ${text}`
  ].join('\n');
}

function parseAiResponse(responseText) {
  const lines = responseText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const summaryLine = lines.find((line) => line.toUpperCase().startsWith('SUMMARY:')) || lines[0] || '';
  const replyLine = lines.find((line) => line.toUpperCase().startsWith('REPLY:')) || lines[1] || '';

  return {
    summary: summaryLine.replace(/^SUMMARY:\s*/i, '').trim(),
    suggestedReply: replyLine.replace(/^REPLY:\s*/i, '').trim(),
    raw: responseText.trim()
  };
}

function getProviderConfig() {
  const provider = (process.env.AI_PROVIDER || DEFAULT_PROVIDER).toLowerCase();
  if (provider === 'openai') {
    return {
      provider,
      apiKey: process.env.OPENAI_API_KEY,
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
    };
  }

  if (provider === 'huggingface') {
    return {
      provider,
      apiKey: process.env.HF_API_KEY,
      endpoint: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      model: 'mistralai/Mistral-7B-Instruct-v0.3'
    };
  }

  return {
    provider: 'gemini',
    apiKey: process.env.GEMINI_API_KEY,
    endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent',
    model: 'gemini-3.5-flash'
  };
}

async function callAiProvider(prompt, variantId = "balanced") {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in .env");
  }

  const ai = new GoogleGenAI({ apiKey });

  const result = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: buildPrompt(prompt, variantId),
          },
        ],
      },
    ],
  });

  return result.text;
}

async function generateAiResponse(inputText, variantId = "balanced") {
  const answer = await callAiProvider(inputText, variantId);
  return parseAiResponse(answer);
}

module.exports = {
  getPromptVariants,
  buildPrompt,
  parseAiResponse,
  generateAiResponse
};
