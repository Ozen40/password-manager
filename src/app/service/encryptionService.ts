import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private keySize = 256;
  private iterations = 1000;
  private encryptedData = '';

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

  decrypt(password: string, file: File): Promise<string | null> {
    return this.readFileContent(file)
      .then((encryptedData) => {
        if (!encryptedData) {
          return null; // Aucune donnée chiffrée trouvée dans la localStorage
        }

        const salt = CryptoJS.enc.Hex.parse(encryptedData.substr(0, 32));
        const iv = CryptoJS.enc.Hex.parse(encryptedData.substr(32, 32));
        const encryptedText = encryptedData.substring(64);
        try{
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
      catch(error){
        return null
      }
      })
      .catch((error) => {
        console.error('Erreur lors de la lecture du fichier :', error);
        return null;
      });
  }

  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (event: ProgressEvent<FileReader>) => {
        const content = event.target?.result as string;
        resolve(content);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsText(file);
    });
  }
}
