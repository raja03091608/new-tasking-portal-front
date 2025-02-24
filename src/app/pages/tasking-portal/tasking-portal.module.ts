import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
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
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PringeComponentModule } from '../../primeng-component/pringe-component.module';
import { FileUploadModule } from 'primeng/fileupload';
import {NgxPrintModule} from 'ngx-print';
import { TaskFormComponent } from './task-form/task-form.component';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [
    NewTaskComponent,
    AllocateTasksComponent,
    ViewTasksComponent,
    ViewStatusComponent,
    TaskListComponent,
    ArchiveTaskComponent,
    TaskFormComponent,
  ],
  imports: [
    TagModule,
    PaginatorModule,
    AutoCompleteModule,
    MultiSelectModule,
    TimelineModule,
    NgxPrintModule,
    ConfirmDialogModule,
    ToastModule,
    TableModule,
    InputTextModule,
    PringeComponentModule,
    DropdownModule,
    ButtonModule,
    MatFormFieldModule,
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    NgbModule,
    CKEditorModule,
    DataTablesModule,
    MaterialModule,
    NgApexchartsModule,
    AngularEditorModule,
    TableModule,
    FileUploadModule,
    CheckboxModule,
    ChipModule,
    DragDropModule,
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
        component: TaskFormComponent,
      },
      {
        path: 'archive-task',
        component: ArchiveTaskComponent,
      },
      {
        path: 'taskForm',
        component: TaskListComponent,
      },
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TaskingPortalModule { }
