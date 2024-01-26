import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  showModal = false;
  dragover = false;

  dragOverHandler(event: DragEvent) {
    event.preventDefault();
    this.dragover = true;
  }

  dragLeaveHandler() {
    this.dragover = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.dragover = false;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}

 