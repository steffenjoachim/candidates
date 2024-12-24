import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImprintComponent } from './imprint/imprint.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'impressum', component: ImprintComponent },
    { path: 'datenschutz', component: DataProtectionComponent },
];
