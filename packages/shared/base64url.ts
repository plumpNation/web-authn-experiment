/*
 * Base64URL-ArrayBuffer
 * https://github.com/herrjemand/Base64URL-ArrayBuffer
 *
 * Copyright (c) 2017 Yuriy Ackermann <ackermann.yuriy@gmail.com>
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 *
 * Tweaked to be used in a TypeScript project.
 */
const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

// Use a lookup table to find the index.
const lookup = new Uint8Array(256);

for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i
}

export const encode = (arraybuffer: ArrayBuffer) => {
    const bytes = new Uint8Array(arraybuffer);
    const len = bytes.length;

    let base64url = ''

    for (let i = 0; i < len; i += 3) {
        base64url += chars[bytes[i] >> 2]
        base64url += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)]
        base64url += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)]
        base64url += chars[bytes[i + 2] & 63]
    }

    if (len % 3 === 2) {
        base64url = base64url.substring(0, base64url.length - 1)
    } else if (len % 3 === 1) {
        base64url = base64url.substring(0, base64url.length - 2)
    }

    return base64url
};

export const decode = (base64string: string) => {
    const len = base64string.length;
    const bufferLength = base64string.length * 0.75;
    const bytes = new Uint8Array(bufferLength)

    let p = 0,
        encoded1,
        encoded2,
        encoded3,
        encoded4;

    for (let i = 0; i < len; i += 4) {
        encoded1 = lookup[base64string.charCodeAt(i)]
        encoded2 = lookup[base64string.charCodeAt(i + 1)]
        encoded3 = lookup[base64string.charCodeAt(i + 2)]
        encoded4 = lookup[base64string.charCodeAt(i + 3)]

        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4)
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
    }

    return bytes.buffer;
};