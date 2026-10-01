/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

export interface LogMeta { [key: string]: unknown }

/**
 * Basic logInfo() and logError() functions have been provided for you.
 * You may expand upon these with additional logging functionality or structures as needed.
 */

function iso() { return new Date().toISOString(); }

export function logInfo(message: string, meta: LogMeta = {}) {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ level: 'info', ts: iso(), message, ...meta }));
}

export function logError(message: string, meta: LogMeta = {}) {
  // eslint-disable-next-line no-console
  console.error(JSON.stringify({ level: 'error', ts: iso(), message, ...meta }));
}