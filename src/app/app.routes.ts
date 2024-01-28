import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DisplayComponent } from './display/display.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'display', component: DisplayComponent }
];

