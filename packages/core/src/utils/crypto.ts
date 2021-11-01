import { BinaryToTextEncoding, createCipher, createDecipher, Encoding, randomBytes } from 'crypto';

export interface Crypto {
  encrypt(key: string, data: string, algorithm?: string, input?: Encoding, output?: BinaryToTextEncoding): string;
  decrypt(key: string, data: string, algorithm?: string, input?: BinaryToTextEncoding, output?: Encoding): string;
  randomBytes(bytes?: number): string;
}

export const crypto: Crypto = {
  encrypt: (key: string, data: string, algorithm = 'aes192', input: Encoding = 'utf8', output: BinaryToTextEncoding = 'base64'): string => {
    const cryptoCipher = createCipher(algorithm, key);
    const result = cryptoCipher.update(data, input, output).concat(cryptoCipher.final(output));
    return result;
  },

  decrypt: (key: string, data: string, algorithm = 'aes192', input: BinaryToTextEncoding = 'base64', output: Encoding = 'utf8'): string => {
    const cryptoDecipher = createDecipher(algorithm, key);
    const result = cryptoDecipher.update(data, input, output).concat(cryptoDecipher.final(output));
    return result;
  },

  randomBytes: (bytes = 128, base: BufferEncoding = 'base64'): string => {
    return randomBytes(bytes).toString(base);
  }
}
