import { MD5 } from 'crypto-js';

export function hashPassword(password: string): string {
  return MD5(password).toString();
}
