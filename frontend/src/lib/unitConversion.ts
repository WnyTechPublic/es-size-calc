import type { NumericInput } from "./types";

export const GB_PER_TB = 1024;

export function parseNumericInput(value: string): NumericInput {
  return value === "" ? "" : Number(value);
}

export function dailyRawGbToTb(value: NumericInput): NumericInput {
  return value === "" ? "" : value / GB_PER_TB;
}

export function dailyRawTbToGb(value: string): NumericInput {
  const parsed = parseNumericInput(value);
  return parsed === "" ? "" : parsed * GB_PER_TB;
}
