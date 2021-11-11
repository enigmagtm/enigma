import { BinaryLike, BinaryToTextEncoding, createCipheriv, createDecipheriv, createHash, Encoding, randomBytes } from 'crypto';
import { isNil } from 'lodash';

export interface Crypto {
  encrypt(key: string, data: string, algorithm?: string, input?: Encoding, output?: BinaryToTextEncoding, iv?: BinaryLike): string;
  decrypt(key: string, data: string, algorithm?: string, input?: BinaryToTextEncoding, output?: Encoding, iv?: BinaryLike): string;
  randomBytes(bytes?: number): string;
}

export const crypto: Crypto = {
  encrypt: (key: string, data: string, algorithm = 'aes256', input: Encoding = 'utf8', output: BinaryToTextEncoding = 'base64', iv?: BinaryLike): string => {
    const hash = createHash('sha256').update(key).digest();
    if (isNil(iv)) {
      iv = Buffer.allocUnsafe(16);
      hash.copy(iv);
    }

    const cryptoCipher = createCipheriv(algorithm, hash, iv);
    const result = cryptoCipher.update(data, input, output).concat(cryptoCipher.final(output));
    return result;
  },

  decrypt: (key: string, data: string, algorithm = 'aes256', input: BinaryToTextEncoding = 'base64', output: Encoding = 'utf8', iv?: BinaryLike): string => {
    const hash = createHash('sha256').update(key).digest();
    if (isNil(iv)) {
      iv = Buffer.allocUnsafe(16);
      hash.copy(iv);
    }

    const cryptoDecipher = createDecipheriv(algorithm, hash, iv);
    const result = cryptoDecipher.update(data, input, output).concat(cryptoDecipher.final(output));
    return result;
  },

  randomBytes: (bytes = 256, base: BufferEncoding = 'base64'): string => {
    return randomBytes(bytes).toString(base);
  }
}
