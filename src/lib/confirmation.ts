export function formatConfirmationId(id: string): string[] {
  return [id];
}

export function normalizeConfirmationId(id: string): string {
  return id.replace(/\s+/g, "");
}
