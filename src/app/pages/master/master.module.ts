import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { UserGroupComponent } from './user-group/user-group.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CKEditorModule } from 'ckeditor4-angular';
import { DataTablesModule } from 'angular-datatables';
import { MaterialModule } from '../../material/material.module';
import { TaskingGroupComponent } from './tasking-group/tasking-group.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { SponsoringDirectorateComponent } from './sponsoring-directorate/sponsoring-directorate.component';


@NgModule({
  declarations: [
    UserGroupComponent,
    TaskingGroupComponent,
    UserRoleComponent,
    SponsoringDirectorateComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    CKEditorModule,
    DataTablesModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: 'user-group',
        component: UserGroupComponent,
      },
      {
        path: 'tasking-group',
        component: TaskingGroupComponent,
      },
      {
        path: 'user-role',
        component: UserRoleComponent,
      },
      {
        path: 'sponsoring-directorate',
        component: SponsoringDirectorateComponent,
      },
    ])
  ]
})
export class MasterModule { }
