import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  categories: string[] = ['Personnel', 'Travail', 'Autre']; // Liste des catégories

  utilisateur: any = {
    nom: '',
    motDePasse: '',
    categorie: ''
  };

  onSubmit(): void {
    console.log('Données soumises : ', this.utilisateur);
  }
}
