import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExportService } from '../service/exportService';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
})
export class DisplayComponent {
  showModal = false;
  modalAnimationClass = '';
  errorMessage: string = '';
  cardAnimationClass: string = '';
  champNomValide: boolean = true;
  champMotDePasseValide: boolean = true;
  champCategorieValide: boolean = true;
  formErrors: string[] = [];
  formError: string = '';
  etapeCrea: boolean = false;
  etapeModif: boolean = false;

  categories: string[] = ['Personnel', 'Travail', 'Banque', 'Autre'];

  utilisateur: any = {
    nom: '',
    motDePasse: '',
    categorie: ''
  };

  constructor(private exportService: ExportService){}

  vault: Password[] = [
    {
      "name": "Crédit agricole",
      "password": "qsdfghjkk",
      "category": "Banque"
    },
    {
      "name": "Gmail",
      "password": "xcvbnbtut",
      "category": "Mail"
    },
  ];

  popupMDP(mdp: Password): void {
    this.showModal = true;
    this.utilisateur.nom = mdp?.name;
    this.utilisateur.password = mdp?.password;
    this.utilisateur.categorie = mdp?.category;
    
    this.cardAnimationClass = 'animated-zoom-fade-in';
    this.modalAnimationClass = 'animated-zoom-fade-in';

    this.etapeModif = true;
    this.etapeCrea = false;
  }
  popupCreaMDP(): void {
    this.showModal = true;
    this.cardAnimationClass = 'animated-zoom-fade-in';
    this.modalAnimationClass = 'animated-zoom-fade-in';

    this.etapeModif = false;
    this.etapeCrea = true;
  }

  closeModal(): void {
    this.modalAnimationClass = 'modal-closing';
    setTimeout(() => {
      this.showModal = false;
      this.errorMessage = '';
      this.formErrors = [];
      this.resetForm();
    }, 300);
  }

  supprimerMDP(msp: Password): void {
    console.log(msp + " a été supp des mdp")
  }

  onSubmitModif(form?: NgForm): void {
    this.validerForm(form);
    this.resetForm(form);
    this.closeModal();
  }
  onSubmitCrea(form?: NgForm): void {
    this.validerForm(form);
    this.resetForm(form);
    this.closeModal();
  }
  private validerMotDePasse(motDePasse: string): boolean {
    return /[A-Z]/.test(motDePasse);
  }

  resetForm(form?: NgForm): void {
    if (form) {
      form.resetForm();
    } else {
      this.utilisateur.nom = '';
      this.utilisateur.motDePasse = '';
      this.utilisateur.categorie = '';
    }
  }
  validerForm(form?: NgForm) {
    if (!this.utilisateur.nom) {
      this.formErrors.push("Le nom du mot de passe est requis.");
    }
    if (!this.utilisateur.motDePasse) {
      this.formErrors.push("Le mot de passe est requis.");
    }
    if (!this.utilisateur.categorie) {
      this.formErrors.push("Une catégorie est requise.");
    }
    if (!this.validerMotDePasse(this.utilisateur.motDePasse)) {
      this.formErrors.push("Le mot de passe doit contenir au minimum 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");

    }

    if (this.champNomValide && this.champMotDePasseValide && this.champCategorieValide) {
      console.log('Données soumises : ', form);
    }
  }
  exportToJSON(){
  this.exportService.exportToJSON('safeData','Coffre');
  }
}

export interface Password {
  name: string;
  password: string;
  category: string;
}