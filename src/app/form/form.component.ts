import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  categories: string[] = ['Personnel', 'Travail', 'Autre']; // Liste des catégories

  utilisateur: any = {
    nom: '',
    motDePasse: '',
    categorie: ''
  };

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log('Données soumises : ', this.utilisateur);
  }

}
