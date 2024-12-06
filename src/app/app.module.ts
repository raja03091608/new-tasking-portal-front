import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MaterialModule } from './material/material.module';
import { SnackbarComponent } from './service/snackbar/snackbar.component';

import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { AuthService } from '..=./modules/auth/services/auth.service';
import { environment } from '../environments/environment';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { ToastrModule } from 'ngx-toastr';
// #fake-end#
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthguardGuard } from './service/authguard.guard';
//import { UsergroupComponent } from './master/master/usergroup.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import{TableModule} from'primeng/table';
import { AuthService } from './service/interceptors/auth.service';

// import { PringeComponentModule } from './primeng-component/pringe-component.module';




@NgModule({
  declarations: [AppComponent,SnackbarComponent,ConfirmationDialogComponent],
  imports: [
    
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    MatTableModule,
	NgApexchartsModule,
  InputTextModule,
  DialogModule,
  
    ToastrModule.forRoot({
			closeButton: true,
			timeOut: 15000, // 15 seconds
			progressBar: true,
		  }),
    ClipboardModule,
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
          passThruUnknownUrl: true,
          dataEncapsulation: false,
        })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    MaterialModule,
    AngularEditorModule,
    TableModule

  ],

  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},AuthguardGuard,Title,
    {provide: HTTP_INTERCEPTORS,
			useClass: AuthService, 
			multi: true, 
		  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
