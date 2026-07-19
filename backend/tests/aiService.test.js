const test = require('node:test');
const assert = require('node:assert/strict');

const { buildPrompt, getPromptVariants, parseAiResponse } = require('../services/aiService');

test('buildPrompt includes the chosen prompt variant and review text', () => {
  const prompt = buildPrompt('The host was warm and the room was spotless.', 'balanced');
  assert.match(prompt, /balanced/i);
  assert.match(prompt, /The host was warm and the room was spotless/i);
});

test('getPromptVariants exposes three prompt options', () => {
  const variants = getPromptVariants();
  assert.equal(variants.length, 3);
  assert.ok(variants.some((variant) => variant.id === 'balanced'));
});

test('parseAiResponse converts provider text into a structured object', () => {
  const parsed = parseAiResponse(`SUMMARY: The stay had strong hospitality and a clean room.\nREPLY: Thanks for your kind words! We are delighted you enjoyed your stay.`);
  assert.equal(parsed.summary, 'The stay had strong hospitality and a clean room.');
  assert.equal(parsed.suggestedReply, 'Thanks for your kind words! We are delighted you enjoyed your stay.');
});
