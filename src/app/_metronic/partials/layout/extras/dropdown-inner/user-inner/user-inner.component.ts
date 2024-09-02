import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { ApiService } from "../../../../../../service/api.service";
import { environment } from "../../../../../../../environments/environment";
import { language } from "../../../../../../../environments/language";
import { ConfirmationDialogComponent } from "../../../../../../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";

//import { AuthService, UserType } from '../../../../../../modules/auth';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  //user$: Observable<UserType>;
  langs = languages;
  private unsubscribe: Subscription[] = [];
  interval;
  constructor(
   // private auth: AuthService,
    private translationService: TranslationService,
	public api: ApiService,private dialog:MatDialog

  ) {

}

  ngOnInit(): void {
    //this.user$ = this.auth.currentUserSubject.asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());
  }
auth:any;
logout()
{

  let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
	width: '350px',
	data: language[environment.DEFAULT_LANG].logoutMessage
  });
	dialogRef.afterClosed().subscribe(result => {
	  if(result) {
		let response= localStorage.getItem('token-detail');
		let decResponse=this.api.decryptData(response);
		this.api.applicationLogoutLog();
		clearInterval(this.interval);
	  }
	  dialogRef=null;
	});
}

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg',
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg',
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg',
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg',
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
];
