import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EncryptionService } from '../service/encryptionService';
import { ActivatedRoute, Router} from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';
import { MatDialog, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { ThisReceiver } from '@angular/compiler';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true, direction: 'ltr'}}
  ],
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

  constructor(private encryptionService: EncryptionService,  private route: ActivatedRoute,
    private router: Router, public dialog: MatDialog) {}


  setPassword(){
    localStorage.setItem('secretKey',CryptoJS.SHA256(this.password).toString(CryptoJS.enc.Hex))
  }
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
      this.setPassword();
      this.resetForm(form);
      this.closeModal();
      this.router.navigate(['/display'], { relativeTo: this.route });
    }

    console.log('Formulaire soumis', this.safeName, this.password);
    this.resetForm(form);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
    input.value = null as any;
  }

  private handleFile(file: File): void {
    if (file.type === "application/json") {
      this.openPasswordDialog(file);
      this.errorMessage = '';
      console.log('Fichier JSON détecté:', file.name);
    } else {
      this.errorMessage = 'Veuillez déposer uniquement des fichiers JSON.';
      this.fileName = '';
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

  openPasswordDialog(file: File): void {
    const dialogRef = this.dialog.open(PasswordDialogComponent, {
      width: '400px',
      height: '200px',
      position: {
        top: "-31%",
        left: '40vw',
      },
      data: { password: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.encryptionService.decrypt(CryptoJS.SHA256(result).toString(CryptoJS.enc.Hex),file).then(fileDecrypt => {
          if(fileDecrypt != null){
            this.password = result;
            this.setPassword();
            this.fileName = file.name;
            this.router.navigate(['/display'], { relativeTo: this.route });
          }
          else{
            this.errorMessage = "Le mot de passe est incorrect";
          }
        });
      } else {
        console.log('Saisie annulée');
      }
    });
  }
  // }
}

