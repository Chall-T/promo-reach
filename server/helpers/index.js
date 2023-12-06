import crypto from 'crypto';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt, password) => {
    return crypto.createHmac('sha256', [salt.toString(), password.toString()].join('/')).update(process.env.SECRET).digest('hex');
};

export const newSessionId = () => {
    return crypto.randomBytes(16).toString('base64');
};