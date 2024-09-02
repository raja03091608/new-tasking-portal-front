import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CKEditorModule } from 'ckeditor4-angular';
import { DataTablesModule } from 'angular-datatables';
import { MaterialModule } from '../../material/material.module';
import { UsersComponent } from './users/users.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ModuleAccessComponent } from './module-access/module-access.component';



@NgModule({
	declarations: [
		UsersComponent,
  ConfigurationComponent,
  ModuleAccessComponent
	],
	imports: [
	  CommonModule,

	  CommonModule,
	  ReactiveFormsModule,
	  NgbModule,
	  CKEditorModule,
	  FormsModule,
	  DataTablesModule,
	  MaterialModule,
	  RouterModule.forChild([
		{
		  path: 'users',
		  component: UsersComponent,
		},
		{
			path: 'configuration',
			component: ConfigurationComponent,
		  },
		  {
			path: 'module-access',
			component: ModuleAccessComponent,
		  },

	  ])
	]
  })
export class AccessModuleModule { }
