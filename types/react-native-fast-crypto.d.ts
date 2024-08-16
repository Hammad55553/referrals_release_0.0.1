declare module 'react-native-fast-crypto' {
  export interface RSAKeyPair {
    public: string;
    private: string;
  }

  export namespace RSA {
    function generateKeys(keySize: number): Promise<RSAKeyPair>;
    function encrypt(text: string, publicKey: string): Promise<string>;
    function decrypt(
      encryptedText: string,
      privateKey: string,
    ): Promise<string>;
  }
}
