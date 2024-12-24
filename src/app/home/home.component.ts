import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CardComponent } from '../card/card.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, HeaderComponent,CardComponent, FooterComponent],
})
export class HomeComponent  {

}