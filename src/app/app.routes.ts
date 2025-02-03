import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./features/imprint/imprint.component').then(
        (m) => m.ImprintComponent,
      ),
  },
  {
    path: 'datenschutz',
    loadComponent: () =>
      import('./features/data-protection/data-protection.component').then(
        (m) => m.DataProtectionComponent,
      ),
  },
];
