import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from '../account/account.component';
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileDetailsComponent } from './settings/forms/profile-details/profile-details.component';
import { ConnectedAccountsComponent } from './settings/forms/connected-accounts/connected-accounts.component';
import { DeactivateAccountComponent } from './settings/forms/deactivate-account/deactivate-account.component';
import { EmailPreferencesComponent } from './settings/forms/email-preferences/email-preferences.component';
import { NotificationsComponent } from './settings/forms/notifications/notifications.component';
import { SignInMethodComponent } from './settings/forms/sign-in-method/sign-in-method.component';
import { DropdownMenusModule, WidgetsModule ,CardsModule} from '../../_metronic/partials';
import { DocumentsComponent } from './documents/documents.component';
import { TrainingComponent } from './training/training.component';
import { ScheduledTrainingComponent } from './scheduled-training/scheduled-training.component';
import { ScheduledInterviewsComponent } from './scheduled-interviews/scheduled-interviews.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AccountComponent,
    OverviewComponent,
    SettingsComponent,
    ProfileDetailsComponent,
    ConnectedAccountsComponent,
    DeactivateAccountComponent,
    EmailPreferencesComponent,
    NotificationsComponent,
    SignInMethodComponent,
    DocumentsComponent,
    TrainingComponent,
    ScheduledTrainingComponent,
    ScheduledInterviewsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    InlineSVGModule,
	ReactiveFormsModule,
	MaterialModule,
    CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
		}),
    FlatpickrModule.forRoot(),
    DropdownMenusModule,
    WidgetsModule,
    CardsModule
  ],
})
export class AccountModule {}
