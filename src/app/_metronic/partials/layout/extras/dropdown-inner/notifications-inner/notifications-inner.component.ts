import { Component, EventEmitter, HostBinding, OnInit,Output,ViewChild } from '@angular/core';
import { LayoutService } from '../../../../../layout';
import { environment } from "../../../../../../../environments/environment";
import { language } from "../../../../../../../environments/language";
import { ApiService } from "../../../../../../service/api.service";
import { NotificationService } from "../../../../../../service/notification.service";
import { Router } from '@angular/router';
import { MatTableDataSource } from "@angular/material/table";
declare let $: any;
// import { TopbarComponent } from "../../../_metronic/layout/components/topbar/topbar.component";

declare var moment:any;

export type NotificationsTabsType =
  | 'kt_topbar_notifications_1'
  | 'kt_topbar_notifications_2'
  | 'kt_topbar_notifications_3';

@Component({
  selector: 'app-notifications-inner',
  templateUrl: './notifications-inner.component.html',
})
export class NotificationsInnerComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  activeTabId: NotificationsTabsType = 'kt_topbar_notifications_1';
  alerts: Array<AlertModel> = defaultAlerts;
  logs: Array<LogModel> = defaultLogs;
  interval;

  constructor(public api: ApiService, private notification : NotificationService,public router: Router) {}
  moment=moment;
  currentPath=location.hash;
  dataSource: MatTableDataSource<any>;
  tmsToken:any;
  header:any;
  modules = [];
  taskinglist:any;
  data:any;
  token_detail:any;
  @Output() closeNotificationClick = new EventEmitter<any>();
  // @ViewChild(TopbarComponent,{static:false}) headercom:TopbarComponent ;

  ngOnInit(): void {
    this.token_detail=this.api.decryptData(localStorage.getItem('token-detail'));
    this.router.events.subscribe((val) => {
      this.currentPath=location.hash;
    });
    this.data = this.api.decryptData(localStorage.getItem('token-detail'));

    this.tmsToken = localStorage.getItem('tmsToken');
    if( this.data.role_center.length==1){
      this.header =  this.data.role_center[0].user_role.code
    } else {
      this.header =  this.data.role_code
    }

    if( this.data.permissions) {
      this.modules = JSON.parse( this.data.permissions);
    }
    this.getPage(this.modules);
    this.getNotifications();
    this.reloadNotifications();


  }


  reloadNotifications()
  {
    this.interval = setInterval(() => {
      this.getNotifications();
    },1000*60*3);

  }
  getPage(modules) {
    let currentUrl = modules.map(value => value.url);
    // // console.logcurrentUrl);

  }


  setActiveTabId(tabId: NotificationsTabsType) {
    this.activeTabId = tabId;
  }

  list:any;


  notificationsList=[];
  created:any;
  notifyLength:any;



    getNotifications(page: number = 1) {
      if (this.data.process_id == 2 && this.data.role_id == 3) {
        this.api.getAPI(
          `${environment.API_URL}notification/get-notifications?tasking__created_by_id=${this.data.user_id}&page=${page}`
        ).subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.notification = res.results.total_unread_notifications;
          } else if (res.status == environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }
        });
      } 
      else if (this.data.process_id == 3) {
        this.api.getAPI(
          `${environment.API_URL}notification/get-notifications?process_id=${this.data.process_id}&tasking_group=${this.data.tasking_id}&page=${page}`
        ).subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.notification = res.results.total_unread_notifications;
          } else if (res.status == environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
          }
        });
      } 
      else {
        this.api.getAPI(
          `${environment.API_URL}notification/get-notifications?page=${page}`
        ).subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.notification = res.results.total_unread_notifications;
          } else if (res.status == environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }
        });
      }
    }
    
  //  notification1
    saveNotificationsLog(notification_id) {
      this.api.postAPI(environment.API_URL + "notification/save-notification-log",{notification_id:notification_id}).subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
        this.getNotifications();
        //// console.log'save',res)
        } else if(res.status==environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
        } else {
          // this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
        }
      });
  }


  viewTrialRequest(tasking_id,notification_id,comment_status)
    {

      this.saveNotificationsLog(notification_id);
      let viewTrial=tasking_id;

      if(comment_status!='' && comment_status=='3' && tasking_id!=''){

        this.router.navigateByUrl('/tasking-portal/view-tasking-status');
      }
      else if(tasking_id==null && comment_status==null){

        this.router.navigateByUrl('/wish/tickets');
      }
      else{

        this.router.navigateByUrl('/tasking-portal/task-list');

      }

      // viewTrial['type']='view';
      // localStorage.setItem('trial_form',this.api.encryptData(viewTrial));

      //this.goToTrialForm(viewTrial.trial_type.code);
      // if(tasking_id.trial_type.type=='Trials')
      //   this.router.navigateByUrl('/transaction/trials');
      // if(trial.trial_type.type=='Returns')
      //   this.router.navigateByUrl('/transaction/returns');
      // if(trial.trial_type.type=='CBPM')
      //   this.router.navigateByUrl('/transaction/cbpm');
    }

    closeNotification(notificationId: number): void {
      // // console.log'Close notification clicked:', notificationId);
      // Remove the notification from the list
      this.notificationsList = this.notificationsList.filter(notification => notification.id !== notificationId);
      this.api.postAPI(environment.API_URL + "notification/notification-closed",{id:notificationId}).subscribe((res) => {});
    }
  


}

interface AlertModel {
  title: string;
  description: string;
  time: string;
  icon: string;
  state: 'primary' | 'danger' | 'warning' | 'success' | 'info';
}

const defaultAlerts: Array<AlertModel> = [
  {
    title: 'Project Alice',
    description: 'Phase 1 development',
    time: '1 hr',
    icon: 'icons/duotune/technology/teh008.svg',
    state: 'primary',
  },
  {
    title: 'HR Confidential',
    description: 'Confidential staff documents',
    time: '2 hrs',
    icon: 'icons/duotune/general/gen044.svg',
    state: 'danger',
  },
  {
    title: 'Company HR',
    description: 'Corporeate staff profiles',
    time: '5 hrs',
    icon: 'icons/duotune/finance/fin006.svg',
    state: 'warning',
  },
  {
    title: 'Project Redux',
    description: 'New frontend admin theme',
    time: '2 days',
    icon: 'icons/duotune/files/fil023.svg',
    state: 'success',
  },
  {
    title: 'Project Breafing',
    description: 'Product launch status update',
    time: '21 Jan',
    icon: 'icons/duotune/maps/map001.svg',
    state: 'primary',
  },
  {
    title: 'Banner Assets',
    description: 'Collection of banner images',
    time: '21 Jan',
    icon: 'icons/duotune/general/gen006.svg',
    state: 'info',
  },
  {
    title: 'Icon Assets',
    description: 'Collection of SVG icons',
    time: '20 March',
    icon: 'icons/duotune/art/art002.svg',
    state: 'warning',
  },
];

interface LogModel {
  code: string;
  state: 'success' | 'danger' | 'warning';
  message: string;
  time: string;
}

const defaultLogs: Array<LogModel> = [
  { code: '200 OK', state: 'success', message: 'New order', time: 'Just now' },
  { code: '500 ERR', state: 'danger', message: 'New customer', time: '2 hrs' },
  {
    code: '200 OK',
    state: 'success',
    message: 'Payment process',
    time: '5 hrs',
  },
  {
    code: '300 WRN',
    state: 'warning',
    message: 'Search query',
    time: '2 days',
  },
  {
    code: '200 OK',
    state: 'success',
    message: 'API connection',
    time: '1 week',
  },
  {
    code: '200 OK',
    state: 'success',
    message: 'Database restore',
    time: 'Mar 5',
  },
  {
    code: '300 WRN',
    state: 'warning',
    message: 'System update',
    time: 'May 15',
  },
  {
    code: '300 WRN',
    state: 'warning',
    message: 'Server OS update',
    time: 'Apr 3',
  },
  {
    code: '300 WRN',
    state: 'warning',
    message: 'API rollback',
    time: 'Jun 30',
  },
  {
    code: '500 ERR',
    state: 'danger',
    message: 'Refund process',
    time: 'Jul 10',
  },
  {
    code: '500 ERR',
    state: 'danger',
    message: 'Withdrawal process',
    time: 'Sep 10',
  },
  { code: '500 ERR', state: 'danger', message: 'Mail tasks', time: 'Dec 10' },
];
