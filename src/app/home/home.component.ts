import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('fileInput') fileInputRef: ElementRef | undefined;
  fileName: string = ''; 
  modalAnimationClass = '';
  errorMessage: string = '';
  showModal = false;

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
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (file.type === "application/json") {
      this.fileName = file.name;
      this.errorMessage = '';
      console.log('Fichier JSON détecté:', file.name);
    } else {
      this.errorMessage = 'Veuillez déposer uniquement des fichiers JSON.'; 
      this.fileName = '';
    }
  }

  openModal() {
    this.showModal = true;
    this.modalAnimationClass = 'modal-opening';
  }

  closeModal() {
    this.modalAnimationClass = 'modal-closing';
    setTimeout(() => this.showModal = false, 300); 
  }
  
}

 