import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishRoutingModule } from './wish-routing.module';
import { WishDashboardComponent } from './wish-dashboard/wish-dashboard.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from 'angular-datatables';
import { MaterialModule } from '../../material/material.module';
import { TicketsComponent } from './tickets/tickets.component';
import { PringeComponentModule } from '../../primeng-component/pringe-component.module';
import { DialogModule } from 'primeng/dialog';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [


    WishDashboardComponent,
      TicketsComponent
  ],
  imports: [
    
    ToastrModule,
    DialogModule,
    CommonModule,
    PringeComponentModule,
    WishRoutingModule,
	CommonModule,
    ReactiveFormsModule,
    NgbModule,
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
