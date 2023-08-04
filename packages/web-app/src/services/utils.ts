import type { IResponse } from "../interfaces";


export function errorCodeHandler (res: Response) {
    if (res.status === 200) return;
    if (res.status === 500) return;
    if (res.status === 404) {
        throw new Error('Fail to connect the server, check your network.')
    }
    throw new Error(res.statusText)
}

export async function resBodyHandler (res: Response) {
    const body = await res.text();
    try {
        const json = JSON.parse(body);
        return json;
    } catch (error) {
        throw new Error(body ? `${res.status} ${body}` : `Fail to parse response body.`);
    }
}

type Headers = Extract<HeadersInit, Record<string, string>> & {
    'Content-Type'?: 'application/json' | 'application/x-www-form-urlencoded';
};

type FetchParams<P> = P extends Record<keyof any, any> ? [
    url: string, payload: P, headers?: Headers
] : [
    url: string, payload?: unknown, headers?: Headers
];

const encodeReqBody = (body: Record<keyof any, any>, contentType: NonNullable<Headers['Content-Type']>): string => {
    if (contentType === 'application/json') {
        // exclude all `undefined`
        return JSON.stringify(Object.entries(body).reduce((acc, [k, v]) => {
            if (v !== undefined) {
                acc[k] = v;
            }
            return acc;
        }, {} as Record<keyof any, any>));
    }
    if (contentType === 'application/x-www-form-urlencoded') {
        return Object.entries(body).map(([k, v]) => {
            const val = v && typeof v === 'object' ? JSON.stringify(v) : v;
            return `${k}=${encodeURIComponent(val)}`;
        }).join('&');
    }
    throw new Error(`Unknown content type: ${contentType}`);
};

const initHeaders = (contentType: "application/json" | "application/x-www-form-urlencoded", headers: Extract<HeadersInit, Record<string, string>> | undefined): Headers => {
    const res: HeadersInit = {
        ...headers,
        'Content-Type': contentType,
    };
    return res;
};

async function getRequestV1<P = never, R = void>(
    ...params: FetchParams<P>
): Promise<IResponse<R>> {
    const [url, payload, headers] = params;

    const search = payload ? `?${encodeReqBody(payload, 'application/x-www-form-urlencoded')}` : '';
    
    const res = await fetch(`${url}${search}`, {
        method: 'GET',
        headers: initHeaders('application/x-www-form-urlencoded', headers),
    });
    errorCodeHandler(res);
    return resBodyHandler(res);
}

async function postRequestV1<P = never, R = void>(
    ...params: FetchParams<P>
): Promise<IResponse<R>> {
    const [url, payload, headers] = params;
    const contentType = headers?.['Content-Type'] ?? 'application/json';

    const body = payload ? encodeReqBody(payload, contentType) : undefined;

    const res = await fetch(url, {
        method: 'POST',
        body,
        headers: initHeaders(contentType, headers),
    });
    errorCodeHandler(res);
    return resBodyHandler(res);
}

async function putRequestV1<P = never, R = void>(
    ...params: FetchParams<P>
): Promise<IResponse<R>> {
    const [url, payload, headers] = params;
    const contentType = headers?.['Content-Type'] ?? 'application/json';

    const body = payload ? encodeReqBody(payload, contentType) : undefined;

    const res = await fetch(url, {
        method: 'PUT',
        body,
        headers: initHeaders(contentType, headers),
    });
    errorCodeHandler(res);
    return resBodyHandler(res);
}

async function deleteRequestV1<P = never, R = void>(
    ...params: FetchParams<P>
): Promise<IResponse<R>> {
    const [url, payload, headers] = params;
    const contentType = headers?.['Content-Type'] ?? 'application/json';

    const body = payload ? encodeReqBody(payload, contentType) : undefined;

    const res = await fetch(url, {
        method: 'DELETE',
        body,
        headers: initHeaders(contentType, headers),
    });
    errorCodeHandler(res);
    return resBodyHandler(res);
}

export class APIError extends Error {
    constructor(
        public code: NonNullable<Extract<IResponse<unknown>, { success: false }>['error']>['code'] | undefined,
        public message: string,
        public options?: Record<string, string>,
    ) {
        super(`APIError: Error code ${code || 'UNKNOWN'}. ${message}`);
    }
}

export function unwrap<T>(result: IResponse<T>): T {
    if (result.success) {
        return result.data;
    }
    if (result.error) {
        throw new APIError(result.error.code, result.message, result.error.options);
    }
    throw new Error(result.message);
}

export function collectError<T>(result: IResponse<T>): [T, null] | [null, APIError] {
    if (result.success) {
        return [result.data, null];
    }
    const err = new APIError(result.error?.code, result.message, result.error?.options);
    return [null, err];
}

export const request = {
    get: getRequestV1,
    post: postRequestV1,
    delete_: deleteRequestV1,
    put: putRequestV1,
    unwrap,
    collectError,
};

export default request;

export function resolveServiceUrl(path: string) {
    return `${import.meta.env.VITE_SERVER_HOST}/${path.replace(/^\//, '')}`;
}
