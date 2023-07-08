export function getVideoId(url: string): string {
  const regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  return regex.exec(url)[3];
}

export function getNumberWithOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export class AuthenticationFailure extends Error {
  constructor(message: string, ...args: []) {
    super(message, ...args);
    this.message = message;
  }
}
