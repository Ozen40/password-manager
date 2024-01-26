import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  password: string = '';
  selectedFile: File | undefined;
  constructor() { }

  ngOnInit(): void {
  }


  handleFileInput(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  importJson(event: any): void {
    event.preventDefault();

    if (this.selectedFile && this.password) {
      console.log('Fichier sélectionné :', this.selectedFile);
      console.log('Mot de passe saisi :', this.password);
    } else {
      console.error('Sélectionnez un fichier et saisissez un mot de passe.');
    }
  }

}
