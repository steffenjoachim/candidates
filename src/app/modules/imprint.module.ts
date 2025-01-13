import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImprintComponent } from '../imprint/imprint.component'; 

const routes: Routes = [
  { path: '', component: ImprintComponent },
];

@NgModule({
  imports: [CommonModule, 
            ImprintComponent,
            RouterModule.forChild(routes)],
})
export class ImprintModule {}
