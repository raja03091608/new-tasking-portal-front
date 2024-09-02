import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from './new-task/new-task.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AllocateTasksComponent } from './allocate-tasks/allocate-tasks.component';
import { ViewTasksComponent } from './view-tasks/view-tasks.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ViewStatusComponent } from './view-status/view-status.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { DataTablesModule } from 'angular-datatables';
import { TaskListComponent } from './task-list/task-list.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from '../../material/material.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ArchiveTaskComponent } from './archive-task/archive-task.component';
import {MatFormFieldModule} from '@angular/material/form-field';
@NgModule({
  declarations: [
    NewTaskComponent,
    AllocateTasksComponent,
    ViewTasksComponent,
    ViewStatusComponent,
    TaskListComponent,
    ArchiveTaskComponent,

  ],
  imports: [
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    CKEditorModule,
    DataTablesModule,
    MaterialModule,
    NgApexchartsModule,
    AngularEditorModule,
    RouterModule.forChild([
      {
        path: 'new-task',
        component: NewTaskComponent,
      },
      {
        path: 'view-tasking-status',
        component: ViewTasksComponent,
      },
      {
        path: 'allocate-tasking',
        component: AllocateTasksComponent,
      },
	  {
        path: 'task-list',
        component: TaskListComponent,
      },
      {
        path: 'archive-task',
        component: ArchiveTaskComponent,
      },
    ])
  ]
})
export class TaskingPortalModule { }
