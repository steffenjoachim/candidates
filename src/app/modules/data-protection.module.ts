import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataProtectionComponent } from '../data-protection/data-protection.component';

const routes: Routes = [
  { path: '', component: DataProtectionComponent },
];

@NgModule({
  imports: [CommonModule, 
            DataProtectionComponent,
            RouterModule.forChild(routes)],
})
export class DataProtectionModule {}
