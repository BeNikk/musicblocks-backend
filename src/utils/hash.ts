import crypto from 'crypto';

export const generateKey = (): string => {
    return crypto.randomBytes(32).toString('hex');
}

export const hashKey = (key: string): string => {
    return crypto.createHash('sha256').update(key).digest('hex');
}

export const createMetaData = (hash: string, theme: string) => {
    const date = new Date();
    return {
        createdAt: date.toISOString(),
        theme: theme,
        hashedKey: hash
    }
}

