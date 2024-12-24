import { Component } from '@angular/core';
import { Header2Component } from '../header2/header2.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-data-protection',
  imports: [ Header2Component,
             FooterComponent
  ],
  templateUrl: './data-protection.component.html',
  styleUrl: './data-protection.component.css'
})
export class DataProtectionComponent {

}

