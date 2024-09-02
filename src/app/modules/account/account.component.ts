import { Component, ViewChild,OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from "../../confirmation-dialog/confirmation-dialog.component";
import { ApiService } from "../../service/api.service";
import { NotificationService } from "../../service/notification.service";
import { environment } from "../../../environments/environment";
import { language } from "../../../environments/language";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { ConsoleService } from "../../service/console.service";
// import custom validator  class
import { CustomValidators } from '../../providers/CustomValidators';
declare var moment:any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
	ErrorMsg:any;
  error_msg=false;
  showError=false;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;


  constructor(private dialog:MatDialog,public router: Router,public api: ApiService, private notification : NotificationService) {}

  ngOnInit(): void {}
  changePasswordForm = new FormGroup({
    old_password: new FormControl("", [Validators.required]),
    new_password: new FormControl("", [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
    new_password2: new FormControl("", [Validators.required]),
	user_id:new FormControl(""),
  },
  CustomValidators.mustMatch('new_password', 'new_password2') // insert here
  );
  public signinDisable=false;

//   populate(data) {
//     this.changePasswordForm.patchValue(data);
//   }

  initForm() {
    this.changePasswordForm.patchValue({
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.changePasswordForm.controls[controlName].hasError(errorName);
  };

  /*changePassword() {
    //this.crudName = "Add";
    //this.isReadonly=false;
    this.changePasswordForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
  } */

  onSubmit() {
	this.showError=true;
	if (this.changePasswordForm.valid) {
	 this.changePasswordForm.value.user_id = this.api.userid.user_id;
	 this.api
	   .postAPI(
		 environment.API_URL + "api/auth/change-password",
		 this.changePasswordForm.value
	   )
	   .subscribe((res) => {
		 //this.logger.log('response',res);
		 //this.error= res.status;
		 if(res.status==environment.SUCCESS_CODE){
		   // this.logger.log('Formvalue',this.changePasswordForm.value);
		   this.notification.success(res.message);
		   this.closebutton.nativeElement.click();
		 } else if(res.status==environment.ERROR_CODE) {
		   this.error_msg=true;
		   this.notification.displayMessage(res.message);
		   this.ErrorMsg=res.message;
		   setTimeout(()=> {
			 this.error_msg = false;
		  }, 2000);
		 } else {
		   this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
		 }

	   });
   }
 }

}
