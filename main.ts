// The One-Line Laugh — a make.fun entry (program/v1).
//
// One funny line, written as plain text. The program below does nothing
// clever: it checks the line against the contest's shape rules, then
// writes it unchanged to entry.txt in the output directory the grader
// provides. Keeping the line as a single constant means what the judge
// reads is exactly what was written here, character for character.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One sentence, no line breaks, no abbreviations with full stops, so the
// judge sees a single sentence and nothing else. The joke turns on a
// small, specific, everyday truth: the fitness app counts every step,
// including the ones that never left the kitchen.
const LINE =
  "My fitness app congratulated me for walking ten thousand steps today, " +
  "and eight thousand of them were just me pacing the kitchen deciding " +
  "what to eat.";

const MAX_CHARS = 200;

function codePoints(text) {
  return [...text].length;
}

function sentenceEnders(text) {
  const found = text.match(/[.!?]+/g);
  return found === null ? 0 : found.length;
}

function checkLine(text) {
  const length = codePoints(text);
  if (length < 1 || length > MAX_CHARS) {
    throw new Error(
      `entry line is ${length} characters, contest allows 1-${MAX_CHARS}`,
    );
  }
  if (text !== text.trim() || text.includes("\n")) {
    throw new Error("entry line must be a single line with no blank edges");
  }
  if (sentenceEnders(text) !== 1) {
    throw new Error(
      `entry line has ${sentenceEnders(text)} sentence endings, expected exactly 1`,
    );
  }
}

checkLine(LINE);

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outputPath = join(outputDir, "entry.txt");
mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, LINE, "utf8");

// Read the file back and compare it with the line: the judge must read
// exactly this text, so a write that silently differs is a failure here,
// not something to discover after the grade.
const written = readFileSync(outputPath, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the entry line after writing");
}
console.log(`wrote entry.txt (${codePoints(LINE)} characters, 1 sentence)`);
