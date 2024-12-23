import { AUTH_ERROR_MESSAGES } from './constants';

export const getAuthErrorMessage = (errorCode: string): string => {
  return AUTH_ERROR_MESSAGES[errorCode] || AUTH_ERROR_MESSAGES.default;
};

export class AuthError extends Error {
  constructor(public code: string, message?: string) {
    super(message || getAuthErrorMessage(code));
    this.name = 'AuthError';
  }
}