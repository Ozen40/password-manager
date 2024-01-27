import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
})
export class DisplayComponent {


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
}

export interface Password {
  name: string;
  password: string;
  category: string;
}