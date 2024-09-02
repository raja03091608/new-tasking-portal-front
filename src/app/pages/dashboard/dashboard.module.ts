import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { WidgetsModule } from '../../_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TaskListComponent } from './task-list/task-list.component';
import { ApprovedTaskComponent } from './approved-task/approved-task.component';
import { PendingTaskComponent } from './pending-task/pending-task.component';
import { TaskBlockComponent } from './task-block/task-block.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { DataTablesModule } from 'angular-datatables';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Dashboard1Component } from './dashboard1/dashboard1.component';

import { MaterialModule } from '../../material/material.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ButtonModule } from 'primeng/button';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DashboardComponent, TaskListComponent, ApprovedTaskComponent, PendingTaskComponent, TaskBlockComponent, Dashboard1Component],
  imports: [
    ButtonModule,
    CommonModule,
    InlineSVGModule,
    NgbModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    CKEditorModule,
    FormsModule,
	MaterialModule,
    DataTablesModule,
    AngularEditorModule,
    RouterModule.forChild([
      {
        path: 'view-task',
        component: DashboardComponent,
      },
      // {
      //   path: '',
      //   component: TaskListComponent,
      //   data: {some_data: 'Sponsoring Directorate'}

      // },
      {
        path: 'dashboard1',
        component: Dashboard1Component,
        data: {some_data: 'Sponsoring Directorate'}

      },
      {
        path: 'dashboard2',
        component: TaskListComponent,
        data: {some_data: 'Admin'}

      },
      {
        path: 'dashboard3',
        component: TaskListComponent,
         data: {some_data: 'DG Wesee'}

      },
      {
        path: 'dashboard4',
        component: Dashboard1Component,
        data: {some_data: 'ACOM(IT & S) and COM'}

      },
      {
        path: 'pending-task',
        component: PendingTaskComponent,
      },
      {
        path: 'approved-task',
        component: ApprovedTaskComponent,
      },
    ]),
    WidgetsModule,
  ],
})

export class DashboardModule {}
