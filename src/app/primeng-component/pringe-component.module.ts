import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridTableComponent } from './grid-table/grid-table.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
// import { FilterService } from 'primeng/api';
import { KeyFilterModule } from 'primeng/keyfilter';
import {MatMenuModule} from '@angular/material/menu';
import { GridWishComponent } from './grid-wish/grid-wish.component';
import { ChartModule } from 'primeng/chart';
import { ChartComponent } from './chart/chart.component';
@NgModule({
  declarations: [
    GridTableComponent,
    GridWishComponent,
    ChartComponent,
  ],
  imports: [
    CommonModule,
    ChartModule,
    MatMenuModule,
    FormsModule ,
    InputNumberModule,
    KeyFilterModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    DialogModule,
    PaginatorModule,
    TooltipModule,
    
    RippleModule
  ],
  exports: [
    GridTableComponent,
    GridWishComponent,
    ChartComponent
  ]
})
export class PringeComponentModule { }
