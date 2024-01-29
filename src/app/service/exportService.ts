import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExportService {

  exportToJSON(localStorageKey: string, fileName: string): void {
    const data = localStorage.getItem(localStorageKey);

    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      link.download = `${fileName}.json`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } else {
      console.error(`Les données pour la clé ${localStorageKey} ne sont pas présentes dans le localStorage.`);
    }
}
}
