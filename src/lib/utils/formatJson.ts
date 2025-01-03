export function formatJson(input: string): string {
  try {
    // Try to parse and format as JSON
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  } catch {
    // If not valid JSON, return as is
    return input;
  }
}