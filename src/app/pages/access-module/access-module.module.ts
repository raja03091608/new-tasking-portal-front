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
import { PringeComponentModule } from '../../primeng-component/pringe-component.module';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';


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
	  PringeComponentModule, 
	  TableModule,
    DialogModule,
    InputTextModule, 
    PringeComponentModule, 
    DropdownModule,  ButtonModule,
	  
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
