import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { filter } from 'rxjs';
import { EncryptionService } from '../service/encryptionService';
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
  hideConfirmPassword: boolean = true;
  masterPassword: string | null = '';

  generatedPassword: string = '';


  categories: string[] = ['Personnel', 'Travail', 'Banque', 'Autre'];

  utilisateur: any = {
    nom: '',
    motDePasse: '',
    categorie: '',
  };

  constructor(private exportService: ExportService, private encryptionService: EncryptionService) {
    this.retrieveDataFromLocalStorage();
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.masterPassword = localStorage.getItem("secretKey");
    }
  }


  vault: Password[] = [];

  retrieveDataFromLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      let data = localStorage.getItem('jsonFileContent');

      if (data) {
        let jsonArray = JSON.parse(data);

        jsonArray.forEach((element: Password) => {
          this.vault.push(element);
        });
      }
    }
  }

  popupMDP(mdp: Password): void {
    this.showModal = true;
    this.utilisateur.nom = mdp?.name;
    this.utilisateur.motDePasse = mdp?.password;
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

  supprimerMDP(mdp: Password): void {
    const index = this.vault.indexOf(mdp);
    if (index != -1) {
      this.vault.splice(index, 1);
      localStorage.setItem('jsonFileContent', JSON.stringify(this.vault));
    }
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
      this.formErrors.push('Le nom du mot de passe est requis.');
    }
    if (!this.utilisateur.motDePasse) {
      this.formErrors.push('Le mot de passe est requis.');
    }
    if (!this.utilisateur.categorie) {
      this.formErrors.push('Une catégorie est requise.');
    }
    if (!this.validerMotDePasse(this.utilisateur.motDePasse)) {
      this.formErrors.push(
        'Le mot de passe doit contenir au minimum 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
      );
    }

    if (
      this.champNomValide &&
      this.champMotDePasseValide &&
      this.champCategorieValide
    ) {
      const newEntry: Password = {
        name: this.utilisateur.nom,
        password: this.utilisateur.motDePasse,
        category: this.utilisateur.categorie,
      };
      this.vault.push(newEntry);
      localStorage.setItem('jsonFileContent', JSON.stringify(this.vault));
      console.log('Données soumises : ', newEntry);
    }
  }
  exportToJSON() {
    this.exportService.exportToJSON('jsonFileContent', 'Coffre');
  }


  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  generatePassword(): void {
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    const allCharacters = uppercaseLetters + lowercaseLetters + numbers;

    let password = '';

    password += this.getRandomCharacter(uppercaseLetters);
    password += this.getRandomCharacter(numbers);

    for (let i = password.length; i < 12; i++) {
      password += this.getRandomCharacter(allCharacters);
    }

    this.generatedPassword = this.shuffleString(password);
    this.utilisateur.motDePasse = this.generatedPassword;
  }

  getRandomCharacter(characters: string): string {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  }

  shuffleString(input: string): string {
    const array = input.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }
}

export interface Password {
  name: string;
  password: string;
  category: string;
}
