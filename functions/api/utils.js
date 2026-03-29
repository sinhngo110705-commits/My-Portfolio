// base64url encode/decode to handle Unicode strings correctly
export function base64UrlEncode(str) {
    const uint8array = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < uint8array.byteLength; i++) {
        binary += String.fromCharCode(uint8array[i]);
    }
    return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}

// Password Hashing using PBKDF2
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
        "raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]
    );
    const key = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial, 256
    );
    const hashArray = Array.from(new Uint8Array(key));
    const saltArray = Array.from(salt);
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const saltHex = saltArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password, storedHash) {
    const [saltHex, hashHex] = storedHash.split(':');
    if (!saltHex || !hashHex) return false;

    const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]
    );
    const key = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial, 256
    );
    const computedHashArray = Array.from(new Uint8Array(key));
    const computedHashHex = computedHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return computedHashHex === hashHex;
}

// JSON Web Token signing via HMAC SHA-256
export async function signJWT(payload, secret) {
    const encoder = new TextEncoder();
    const header = { alg: 'HS256', typ: 'JWT' };
    
    const bHeader = base64UrlEncode(JSON.stringify(header));
    const bPayload = base64UrlEncode(JSON.stringify(payload));
    const dataToSign = `${bHeader}.${bPayload}`;
    
    const key = await crypto.subtle.importKey(
        'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(dataToSign));
    let binarySig = '';
    const sigBytes = new Uint8Array(signature);
    for (let i = 0; i < sigBytes.byteLength; i++) {
        binarySig += String.fromCharCode(sigBytes[i]);
    }
    const bSignature = btoa(binarySig).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    return `${dataToSign}.${bSignature}`;
}

// JSON Web Token verification
export async function verifyJWT(token, secret) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        const [bHeader, bPayload, bSignature] = parts;
        const dataToSign = `${bHeader}.${bPayload}`;
        
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
        );
        
        // Decode signature for verification
        let base64 = bSignature.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }
        const binary = atob(base64);
        const signatureBytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            signatureBytes[i] = binary.charCodeAt(i);
        }
        
        const valid = await crypto.subtle.verify(
            'HMAC', key, signatureBytes, encoder.encode(dataToSign)
        );
        
        if (valid) {
            return JSON.parse(base64UrlDecode(bPayload));
        }
        return null;
    } catch(e) {
        return null;
    }
}
