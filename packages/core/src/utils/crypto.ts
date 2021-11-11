import { BinaryToTextEncoding, createCipheriv, createDecipheriv, createHash, Encoding, randomBytes } from 'crypto';

export interface Crypto {
  encrypt(key: string, data: string, algorithm?: string, input?: Encoding, output?: BinaryToTextEncoding): string;
  decrypt(key: string, data: string, algorithm?: string, input?: BinaryToTextEncoding, output?: Encoding): string;
  randomBytes(bytes?: number): string;
}

export const crypto: Crypto = {
  encrypt: (key: string, data: string, algorithm = 'aes256', input: Encoding = 'utf8', output: BinaryToTextEncoding = 'base64'): string => {
    const iv = Buffer.allocUnsafe(16);
    const hash = createHash('sha256').update(key.toString()).digest();
    hash.copy(iv);
    console.log(iv);
    const bufferKey = createHash('sha256').update(key).digest();
    const cryptoCipher = createCipheriv(algorithm, bufferKey, iv);
    const result = cryptoCipher.update(data, input, output).concat(cryptoCipher.final(output));
    return result;
  },

  decrypt: (key: string, data: string, algorithm = 'aes256', input: BinaryToTextEncoding = 'base64', output: Encoding = 'utf8'): string => {
    const iv = Buffer.allocUnsafe(16);
    const hash = createHash('sha256').update(key.toString()).digest();
    hash.copy(iv);
    const bufferKey = createHash('sha256').update(key).digest();
    const cryptoDecipher = createDecipheriv(algorithm, bufferKey, iv);
    const result = cryptoDecipher.update(data, input, output).concat(cryptoDecipher.final(output));
    return result;
  },

  randomBytes: (bytes = 256, base: BufferEncoding = 'base64'): string => {
    return randomBytes(bytes).toString(base);
  }
}
