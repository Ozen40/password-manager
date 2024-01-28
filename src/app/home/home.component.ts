import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EncryptionService } from '../service/encryptionService';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('fileInput') fileInputRef: ElementRef | undefined;
  fileName: string = '';
  modalAnimationClass = '';
  errorMessage: string = '';
  showModal = false;

  cardAnimationClass: string = '';
  formErrors: string[] = [];


  safeName: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  formError: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(private encryptionService: EncryptionService, private route: ActivatedRoute,
    private router: Router) { }


  validatePassword(): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    return regex.test(this.password);
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }


  resetForm(form?: NgForm): void {
    if (form) {
      form.resetForm();
    } else {
      this.safeName = '';
      this.password = '';
      this.confirmPassword = '';
    }
    this.hidePassword = true;
    this.hideConfirmPassword = true;
    this.passwordMismatch = false;
  }

  submitForm(form: NgForm): void {
    this.formErrors = [];

    if (!this.safeName) {
      this.formErrors.push("Le nom du coffre-fort est requis.");
    }
    if (!this.password) {
      this.formErrors.push("Le mot de passe est requis.");
    }
    if (!this.confirmPassword) {
      this.formErrors.push("La confirmation du mot de passe est requise.");
    }


    if (this.password && this.confirmPassword) {
      if (this.password !== this.confirmPassword) {
        this.formErrors.push("Les mots de passe ne correspondent pas.");
      } else if (!this.validatePassword()) {
        this.formErrors.push("Le mot de passe doit contenir au minimum 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
      }
    }


    if (this.formErrors.length > 0) {
      this.resetForm(form);
      return;
    }

    if (this.formErrors.length === 0) {
      const safeData = {
        safeName: this.safeName,
        password: this.password,
      };
      this.encryptionService.encrypt(JSON.stringify(safeData), this.password);
      console.log('Données du coffre-fort enregistrées', safeData);
      this.resetForm(form);
      this.closeModal();
      this.router.navigate(['/display'], { relativeTo: this.route });
    }

    console.log('Formulaire soumis', this.safeName, this.password);
    this.resetForm(form);
  }

  deleteFile(event: MouseEvent): void {
    event.stopPropagation();
    this.fileName = '';
    this.errorMessage = '';
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }



  sendFile(): void {
    console.log('Envoi du fichier:', this.fileName);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.handleFile(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    if (file && file.type === 'application/json') {
      const reader = new FileReader();

      reader.onload = (loadEvent) => {
        const fileContent = loadEvent.target?.result as string;

        localStorage.setItem('jsonFileContent', fileContent);
        console.log(fileContent);
        console.log('Contenu du fichier JSON enregistré dans le stockage local.');
      };

      reader.readAsText(file);
    } else {
      console.error('Veuillez sélectionner un fichier JSON.');
    }
  }

  openModal(): void {
    this.showModal = true;
    this.cardAnimationClass = 'animated-zoom-fade-in';
    this.modalAnimationClass = 'animated-zoom-fade-in';
  }

  closeModal(): void {
    this.modalAnimationClass = 'modal-closing';
    setTimeout(() => {
      this.showModal = false;
      this.fileName = '';
      this.errorMessage = '';
      this.formErrors = [];
      this.resetForm();
    }, 300);
  }
}

