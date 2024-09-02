import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    ProjectComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    MaterialModule,
    DataTablesModule,ReactiveFormsModule,
    FormsModule,
    CKEditorModule,
    AngularEditorModule,
    RouterModule.forChild([

			{
				path: '',
				component: ProjectComponent,
			}

    ])

  ]
})
export class ProjectModule { }
