import { Injectable } from '@angular/core';
import { EncryptionService } from './encryptionService';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private dataToExport : string = '';

  constructor(private encryptionService: EncryptionService) {}


  exportToJSON(localStorageKey: string, fileName: string): void {
    const data = localStorage.getItem(localStorageKey);
    console.log(data);
    if (data) {
      console.log(this.encryptionService.encrypt(data));
      this.dataToExport = this.encryptionService.encrypt(data);
      if(this.dataToExport){
      console.log(this.dataToExport);
      const blob = new Blob([this.dataToExport], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      link.download = `${fileName}.json`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      }
      else{
        console.log("Erreur d'export");
      }
    } else {
      console.error(`Les données pour la clé ${localStorageKey} ne sont pas présentes dans le localStorage.`);
    }
}
}
