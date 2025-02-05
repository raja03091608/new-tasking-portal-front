import { Component, OnInit, ViewChild } from "@angular/core";
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from "../../../../service/api.service";
import { ConsoleService } from "../../../../service/console.service";
import { environment } from "../../../../../environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { NotificationService } from "../../../../service/notification.service";
//import { ConfirmationDialogComponent } from "../../../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "../../../../../environments/language";
import { userDetail } from '../../../../../environments/userDetail';
import { Subscription, Observable } from 'rxjs';
//import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
	selectedTab: string = 'tasking'; // Default selected tab
	signinDisable: boolean = false;
	constructor(public api: ApiService, private notification : NotificationService,private dialog:MatDialog,
	  private router: Router, private logger : ConsoleService) { }
	public loginForm = new FormGroup({
		username: new FormControl(""),
	  //email: new FormControl("", [Validators.required]),
		// Validators.pattern("/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/")
	  password: new FormControl("", [Validators.required,Validators.minLength(1),Validators.maxLength(100)]),
	  remember: new FormControl("")
	});
	public loginButton='Sign in';
	isLoading$: Observable<boolean>;
	showError=false;
	showPassword=false;

	ngOnInit(): void {
		let data = 'abc';
	  localStorage.setItem('token-detail',data);
	  localStorage.removeItem('userDetail');
	  localStorage.removeItem('fp-detail');
	  localStorage.removeItem('log-detail');
	  // localStorage.removeItem('tmsToken');
	  // localStorage.removeItem('liveCounter');
	  localStorage.removeItem('token-detail');
	  localStorage.removeItem('applicant-details');
	  let userInfo=localStorage.getItem('userInfo');
	  if(userInfo) {
		let getUser=this.api.decryptData(userInfo);
		// this.logger.info(getUser);
		this.populate(getUser);

	  }
	  // var element = <HTMLInputElement> document.getElementById("exampleCheck1");
	  //    element.checked=true;
	}

	Error = (controlName: string, errorName: string) => {
	  return this.loginForm.controls[controlName].hasError(errorName);
	};


	onSubmit() {
		this.showError=true;

	  if (this.loginForm.valid) {
		this.loginButton='Please wait...';
		this.signinDisable=true;
		// console.log'djfjks',this.loginForm.value)
		this.api.getToken(
			//this.loginForm.value.email,
			this.loginForm.value.username,
			this.api.encrypt(this.loginForm.value.password,environment.SECRET_KEY)
		  ,this.selectedTab)
		  .subscribe((res) => {
				this.showError=false;

				// // console.logres,'res')
				this.loginButton='Sign in';
				this.signinDisable=false;
				if(res.status=='success')
				{
				  userDetail.loginname=this.loginForm.value.username;
				  //userDetail.email=this.loginForm.value.email;
				  userDetail.password=this.loginForm.value.password;
				  localStorage.setItem('APPLOGO','assets/meadia/logos/logo.png');
				  localStorage.setItem('LOGINPAGE','/authenticate/login');
				  this.api.setUserLoggedIn(true);
				  if(this.loginForm.value.remember) {
					localStorage.setItem('userInfo',this.api.encryptData(this.loginForm.value));
				  }
				  localStorage.setItem('userDetail',this.api.encryptData(userDetail));
				  localStorage.setItem('token-detail',this.api.encryptData(res));
				  // this.router.navigateByUrl('/locations/countries');

					//this.router.navigateByUrl('/dashboard/dashboard1');

				  if(res.role_center?.length==0)
	        {
	          this.notification.displayMessage("It seems no previlleges has been set for this account. Please contact administrator");
	        }else{
	          if(res.role_center?.length>1) {
	              this.router.navigateByUrl('/authenticate/role-selection');
	          } else {
	            //// console.logres.role_center[0].user_role.id)
	            this.api.getAPI(environment.API_URL+"access/permissions?user_role_id="+res.role_center[0].user_role.id+'&process_id='+res.process_id).subscribe((res1)=>{
	              if(res1.status==environment.SUCCESS_CODE) {
	                if(res1.data.length==1){
	                  let data =this.api.decryptData(localStorage.getItem('token-detail'));
	                  data.permissions = res1.data[0].permissions;
	                  data.role_code=res.role_center[0].user_role.code;
	                  data.role_id=res.role_center[0].user_role.id;
	                  data.center=res.role_center[0].center?res.role_center[0].center.id:'';
	                  data.center_name=res.role_center[0].center?res.role_center[0].center.name:'';
	                  data.role_name = res.role_center[0].user_role.name;
					  localStorage.setItem('user_id',res.user_id);
	                  this.api.postAPI(environment.API_URL+"api/auth/authentications",{user_id:res.user_id,user_role_id:res.role_center[0].user_role.id,center_id:(res.role_center[0].center?res.role_center[0].center.id:'')}).subscribe((res2)=>{
	                    data.token_user=res2.authentication.token_user;
	                    localStorage.setItem('token-detail',this.api.encryptData(data));

	                    if(res2.authentication.biometric) {
	                      if(res2.authentication.fpdata.length<3) {
	                      this.router.navigateByUrl('/authenticate/biometrics-log');
	                      } else {
	                        this.router.navigateByUrl('/authenticate/biometrics-verify');
	                      }
	                    } else if(res2.authentication.twofactor){
	                      this.router.navigateByUrl('/authenticate/twofactor');
	                    }else if(res1?.data[0]?.process === 4) {
	                      this.router.navigateByUrl('/wish/wish-dashboard');
	                    }
						else {
	                      this.router.navigateByUrl('/dashboard/dashboard1');
	                    }
	                  });
	                }
	              }
	            });
	          }
	        }
			  }
				else
				{
				  this.notification.displayMessage(res.message);
				}
		  });
	  }
	}

	Forgot() {
	  this.notification.displayMessage(language[environment.DEFAULT_LANG].contactAdmin);
	}

	capitalizeInput(controlName: string): void {
		const control = this.loginForm.get(controlName);
		if (control && control.value) {
		  const capitalizedValue = control.value.toUpperCase();
		  control.setValue(capitalizedValue, { emitEvent: false });
		}
	  }
	  
	populate(user) {
	//  this.logger.info(user)
	 if(user)
	 {
	  //this.loginForm.patchValue({email:user.email});
	  this.loginForm.patchValue({username:user.username});
	  this.loginForm.patchValue({password:user.password});
	  this.loginForm.patchValue({remember:user.remember});
	 }

	}

	rememberMe(evt) {
	  if(!evt.checked)
	  {
		localStorage.removeItem('userInfo');
		/*this.loginForm.patchValue({username:''});
		this.loginForm.patchValue({password:''});*/
		this.loginForm.patchValue({remember:''});
	  }
	}


  }
