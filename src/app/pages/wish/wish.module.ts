import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishRoutingModule } from './wish-routing.module';
import { WishDashboardComponent } from './wish-dashboard/wish-dashboard.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CKEditorModule } from 'ckeditor4-angular';
import { DataTablesModule } from 'angular-datatables';
import { MaterialModule } from '../../material/material.module';
import { TicketsComponent } from './tickets/tickets.component';



@NgModule({
  declarations: [


    WishDashboardComponent,
      TicketsComponent
  ],
  imports: [
    CommonModule,
    WishRoutingModule,
	CommonModule,
    ReactiveFormsModule,
    NgbModule,
    CKEditorModule,
    DataTablesModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: 'wish-dashboard',
        component: WishDashboardComponent,
	},
	{
        path: 'tickets',
        component: TicketsComponent,
	},
])
]
})
export class WishModule { }
