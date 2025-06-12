export function nowInUnix(): string {
  const timestamp = Math.floor(Date.now() / 1000);
  return timestamp.toString();
}
