const seriousPrompt = require('../prompts/serious');
const roastPrompt = require('../prompts/roast');
const interviewPrompt = require('../prompts/interview');

function getPrompt(mode) {
  let prompt = "";
  if (mode == "serious") {
    prompt = seriousPrompt;
  } else if (mode == "roast") {
    prompt = roastPrompt;
  } else if (mode == "interview") {
    prompt = interviewPrompt;
  }
  return prompt;
}

module.exports = getPrompt;