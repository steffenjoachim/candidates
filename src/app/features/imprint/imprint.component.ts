import { Component } from '@angular/core';
import { Header2Component } from '../../shared/header2/header2.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-imprint',
  imports: [Header2Component, FooterComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.css',
})
export class ImprintComponent {}
