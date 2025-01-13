import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'impressum', loadChildren: () => import('./modules/imprint.module').then(m => m.ImprintModule) },
  { path: 'datenschutz', loadChildren: () => import('./modules/data-protection.module').then(m => m.DataProtectionModule) },
];
