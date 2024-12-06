import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project/project.component';
import { DataTablesModule } from 'angular-datatables';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PringeComponentModule } from '../../primeng-component/pringe-component.module';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    ProjectComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    MaterialModule,
    DataTablesModule,ReactiveFormsModule,
    FormsModule,
    CKEditorModule,
    AngularEditorModule,
    TableModule,
    DialogModule,
    InputTextModule, 
    PringeComponentModule, 
    DropdownModule,  ButtonModule,
    RouterModule.forChild([

			{
				path: '',
				component: ProjectComponent,
			}

    ])

  ]
})
export class ProjectModule { }
