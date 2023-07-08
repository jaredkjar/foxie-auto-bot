export function getVideoId(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : 'invalid watch id';
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
