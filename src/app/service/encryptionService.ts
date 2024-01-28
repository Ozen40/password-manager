// encryption.service.ts

import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root', // Enregistrez le service au niveau racine
})
export class EncryptionService {
  private keySize = 256;
  private iterations = 1000;

  encrypt(data: string, password: string): void {

    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: this.keySize / 32,
      iterations: this.iterations,
    });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const encryptedData = salt.toString() + iv.toString() + encrypted.toString();
    localStorage.setItem('safeData', encryptedData);
  }

  decrypt(password: string): string | null {
    const encryptedData = localStorage.getItem('safeData');

    if (!encryptedData) {
      return null; // Aucune donnée chiffrée trouvée dans la localStorage
    }

    const salt = CryptoJS.enc.Hex.parse(encryptedData.substr(0, 32));
    const iv = CryptoJS.enc.Hex.parse(encryptedData.substr(32, 32));
    const encryptedText = encryptedData.substring(64);

    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: this.keySize / 32,
      iterations: this.iterations,
    });

    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
