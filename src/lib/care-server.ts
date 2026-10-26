import type { CareState, CheckIn } from '@/lib/care-mvp';
export class CareServerError extends Error {
    constructor(public code: string, public status: number) { super(code); }
}
export async function careRequest<T>(path: string, method = 'GET', data?: unknown): Promise<T> { const response = await fetch('/api/care/' + path, { method, credentials: 'same-origin', cache: 'no-store', headers: data ? { 'Content-Type': 'application/json' } : undefined, body: data ? JSON.stringify(data) : undefined }); let payload; try {
    payload = await response.json();
}
catch {
    throw new CareServerError('SERVER_UNAVAILABLE', response.status);
} if (!response.ok)
    throw new CareServerError(payload.error || 'SERVER_ERROR', response.status); return payload as T; }
export async function optionalServerState() { try {
    return await careRequest<CareState>('state');
}
catch (e) {
    if (e instanceof CareServerError && [401, 404, 503].includes(e.status))
        return null;
    throw e;
} }
export const serverSessionKnown = () => typeof window !== 'undefined' && sessionStorage.getItem('oneul-anbu:server-connected') === '1';
export async function saveServerCheck(check: CheckIn, edit: boolean, existing?: CheckIn) { const { record } = await careRequest<{
    record: CheckIn;
}>('checkins', edit ? 'PUT' : 'POST', { ...check, expectedUpdatedAt: existing?.updatedAt }); return record; }
