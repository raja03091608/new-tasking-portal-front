import { Component, ElementRef, OnInit, ViewChild, Inject, LOCALE_ID, signal, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewStatusComponent } from '../view-status/view-status.component';
import { MatTableDataSource } from "@angular/material/table";
import { environment } from "../../../../environments/environment";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { ConsoleService } from "../../../service/console.service";
import { ApiService } from "../../../service/api.service";
import { FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { NotificationService } from "../../../service/notification.service";
import { ConfirmationDialogComponent } from "../../../confirmation-dialog/confirmation-dialog.component";
import { language } from "../../../../environments/language";
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
declare var $;
declare var moment:any;
import { of } from 'rxjs';
import { formatDate } from "@angular/common";
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { AllocateTasksComponent } from '../allocate-tasks/allocate-tasks.component';
import { TestBed } from '@angular/core/testing';
import * as XLSX from 'xlsx';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
  ApexXAxis,
  ApexPlotOptions,
  ApexTooltip
} from "ng-apexcharts";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
};


type Tabs = "TaskWaiting" | "TaskApproved";
declare function closeModal(selector:any):any;
//declare function closeAllActiveModals(selector):any;
declare function openModal(selector:any):any;
declare function triggerClick(selector:any):any;
declare var moment:any;

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.scss'],
  providers:[DatePipe]
})

export class ViewTasksComponent implements OnInit {

  commentForm:FormGroup;
  extensionForm:FormGroup;
  archiveForm:FormGroup;
  completedForm:FormGroup;
  exportform:FormGroup;
  approvalForm:FormGroup;
  taskingForm:FormGroup;
  dataSource: MatTableDataSource<any>;
  dataSourcelist = new MatTableDataSource<any>([]); // Data source for Angular Material table
  dataSourceStatus: MatTableDataSource<any>;
  xlxsForm: FormGroup;
  isStatusAdd:boolean = false;
  patchValue(data: any) {
    throw new Error('Method not implemented.');
  }
  file: File[];
  displayedColumns: string[] = [
    "task_number_dee",
    "task_name",
    "cost_implication",
    "sponsoring_directorate",
    "time_frame_for_completion",
    "legacy_data",
    "status",
    "completed",
    "actions",
    "pdf",
	"Export"
  ];
  visible=false;
  displayedColumnslist: string[] = [
    "title",
    "start_date",
    "end_date",
    "project_progress",
    "file",
    "edit",
    "delete",

    ];


  country: any;
  image: any;
  public crudName = "Add";
  public countryList = [];
  public countryList1 = [];
  public statuslist:any = [];
  imgToUpload: any = null;
  filterValue: any;
  isReadonly = false;
  moduleAccess: any;
  ErrorMsg: any;
  error_msg = false;
  tasking:any;
  showError=false;
  moment=moment;
  fileToUpload: File | null = null;
  dateFormat=environment.DATE_FORMAT;
  ImgUrl:any;
  public permission = {
    add:false,
    view:false,
    archive:false,
    delete:false
  };
  isfileUpload:boolean;

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild('approve') approve: ElementRef;
  @ViewChild('reject') reject: ElementRef;
  @ViewChild('localForm') localForm: HTMLFormElement;
  start_date: string;
  end_date: string ;
  series:any;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  login_id:any;


  constructor(@Inject(LOCALE_ID) public locale: string,public api: ApiService, private notification: NotificationService,
    private dialog: MatDialog, private router: Router, private elementref: ElementRef, private logger: ConsoleService,private modalService: NgbModal,private fb:FormBuilder,public datepipe:DatePipe)
    {

       this.login_id = this.api.userid.user_id
       console.log('login_id',this.api.userid.user_id);
      this.dataSource = new MatTableDataSource();
      this.dataSourcelist = new MatTableDataSource();
      this.dataSourceStatus = new MatTableDataSource();
       this.commentForm = new FormGroup({
        id: new FormControl(""),
        tasking:new FormControl(""),
        status : new FormControl(""),
        created_by: new FormControl(""),
        comments: new FormControl("", [Validators.required]),

      });
      this.xlxsForm = new FormGroup({
        header: new FormControl([]),
        fileName: new FormControl(''),
      })
      this.archiveForm = new FormGroup({
        id:new FormControl(""),
        tasking:new FormControl(""),
        reason: new FormControl("",Validators.required),
        authority_permission: new FormControl("",Validators.required)

      });
      this.completedForm = new FormGroup({
        tasking:new FormControl(""),
        completed_status: new FormControl(""),
        completed_comments: new FormControl("")

      });
    this.extensionForm = new FormGroup({
      extensionNumber:new FormControl(""),
       authorityLetterNumber :new FormControl(""),
      description : new FormControl(""),
      extendedTill: new FormControl(""),
    })
  this.exportform = new FormGroup({
    id: new FormControl(""),
    initiator: new FormControl(""),
    apso: new FormControl(""),
    wesee: new FormControl(""),
    dg_wesee: new FormControl(""),
    dee: new FormControl(""),
    acom : new FormControl(""),
    com: new FormControl(""),
    tasking: new FormControl(""),
	  mile: new FormControl(""),
  });


  this.approvalForm = new FormGroup({
    id: new FormControl(""),
    tasking:new FormControl(""),
    approved_level: new FormControl(''),
    comments: new FormControl("",[Validators.required]),
    status: new FormControl(""),
    approved_role_id: new FormControl(''),
    //pendingAt:new FormControl(""),

  });

  this.taskingForm = new FormGroup({
    id: new FormControl(""),
    tasking:new FormControl(""),
    start_date:new FormControl(''),
    end_date:new FormControl(""),
    view_image:new FormControl(""),
    status_description:new FormControl(""),
    note:new FormControl(""),
    project_progress:new FormControl(""),
    created_by: new FormControl(""),
    created_ip:new FormControl(""),
    status_summary: new FormControl(""),
    title:new FormControl(""),
    status: new FormControl(""),
    secTitle:new FormControl(""),

  });
     var updateChart= this.chartOptions = {

        series: [
          {
            name: "Completed",
            data: this.completed

          },
          {
            name: "Pending",
            data: this.pending
          }
        ],
        chart: {
          type: "bar",
          height: 400,
          stacked: true
        },
        colors: ["#008FFB" ,"#FF4560"],
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "20%"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },

        grid: {
          xaxis: {
            lines: {
              show: false
            }
          }
        },
        yaxis: {
          min: -100,
          max: 100,
          title: {
            // text: 'Age',
          }
        },
        tooltip: {
          shared: false,
          x: {
            formatter: function(val) {
              return val.toString();
            }
          },
          y: {
            formatter: function(val) {
              return Math.abs(val) + "%";
            }
          }
        },
        xaxis: {
          categories: this.name,
          title: {
            text: "Percent"
          },
          labels: {
            formatter: function(val) {
              return Math.abs(Math.round(parseInt(val, 10))) + "%";
            }
          }
        }
      };
	  setTimeout(() => {
        updateChart
      }, 1000);

  }





  img_link1=0;
  //status = this.editForm.value.status;
  populate(data:any) {
    this.approvalForm.patchValue(data);
    this.taskingForm.patchValue(data);
    this.commentForm.patchValue(data);
    this.completedForm.patchValue(data);
    this.archiveForm.patchValue(data);
    // this.taskingForm.patchValue({sdForm:{sponsoring_directorate:data.sponsoring_directorate}})
    this.taskingForm.patchValue({status_summary:data.status_summary,secTitle:data.secondary_title })
    if (data ? data.file : "") {
      var img_link = data.file;
      this.img_link1 = data.file;
      var trim_img = img_link.substring(1)
      this.ImgUrl = environment.MEDIA_URL; + trim_img;
      }
      else{
        this.ImgUrl ="";
      }

    // this.logger.info(data.status)
    // console.log('data',this.data)
  }

  initForm() {

    this.approvalForm.patchValue({
      status: "1",
    })
    this.taskingForm.patchValue({
      status: "1",
      });


  }

  Errorcomment = (controlName: string, errorName: string) => {
    return this.commentForm.controls[controlName].hasError(errorName);
  };

  Errorarchive = (controlName: string, errorName: string) => {
    return this.archiveForm.controls[controlName].hasError(errorName);
  };

  Errorcompleted = (controlName: string, errorName: string) => {
    return this.completedForm.controls[controlName].hasError(errorName);
  };

  ErrorApproval = (controlName: string, errorName: string) => {
    return this.approvalForm.controls[controlName].hasError(errorName);
  };

  Error = (controlName: string, errorName: string) => {
    return this.taskingForm.controls[controlName].hasError(errorName);
  };

  // valueType=[];
  pending:any=[];
  name:any=[];
  completed:any=[];
  mapped:any=[];
  getstatus(tasking_id:any) {
	// this.series.data.setAll('')
    this.api
      .getAPI(environment.API_URL + "transaction/tasking-status?tasking_id="+tasking_id)
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.statuslist = res.data;
        this.dataSource.paginator = this.pagination;

        for(let i=0;i<this.statuslist.length;i++){

          const val =100-this.statuslist[i].project_progress;
          this.pending.push([val]);
          this.completed.push('-'+[this.statuslist[i].project_progress])

          // this.completed.push([this.statuslist[i].project_progress])
          this.name.push([this.statuslist[i].tasking.task_number_dee])

        }
      });

  }

  allocate_del:any;
  token_detail:any;
  ngOnInit(): void {
    this.token_detail=this.api.decryptData(localStorage.getItem('token-detail'));
    this.allocate_del=this.api.decryptData(localStorage.getItem('allocate_Del'));
    this.getTasking();
    this.getTaskingGroups();
    this.getAccess();
    this.gettitlelist();
    this.isStatusAdd= (this.token_detail.process_id == 3 || this.token_detail.process_id == 1) ? true : false
    // this.getstatus;
    // this.getViewStatus();





    // this.getviewstatuscomment();



    // let root = am5.Root.new("chartdiv");




    // // Set themes
    // // https://www.amcharts.com/docs/v5/concepts/themes/
    // root.setThemes([
    //   am5themes_Animated.new(root)
    // ]);


    // // Create chart
    // // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    // let chart = root.container.children.push(am5percent.PieChart.new(root, {
    //   layout: root.verticalLayout,
    //   innerRadius: am5.percent(50)
    // }));


    // // Create series
    // // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    // this.series = chart.series.push(am5percent.PieSeries.new(root, {
    //   valueField: "value",
    //   categoryField: "category",
    //   alignLabels: false
    // }));


    // this.series.labels.template.setAll({
    //   textType: "circular",
    //   centerX: 0,
    //   centerY: 0
    // });


    // // Set data
    // // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    // //
    //   this.series.data.setAll(
    //    this.mapped

    //  );
    //  console.log('serire',)
    //   // series.data.setAll(
    //   //   { value: 10, category: "Sep" },
    //   //   { value: 9, category: "Oct" },
    //   //   { value: 6, category: "Nov" },
    //   //   { value: 5, category: "Dec" },

    //   // );



    // // Create legend
    // // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
    // let legend = chart.children.push(am5.Legend.new(root, {
    //   centerX: am5.percent(50),
    //   x: am5.percent(50),
    //   marginTop: 15,
    //   marginBottom: 15,
    // }));

    // // legend.data.setAll(series.dataItems);


    // // Play initial series animation
    // // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
    // this.series.appear(1000, 100);






  }
onFilterChange(filterInput,item?,item2?){

}
onCustomClear(item){

}



  data_list:any;
  add(country:any) {
    this.showError=false;
    this.crudName = "Add";
    this.isReadonly=false;
    this.taskingForm.enable();
    this.data_list=country;
    let reset = this.formGroupDirective.resetForm();
    this.getViewStatus(country.id)
    // if(reset!==null) {
    //   this.initForm();
    // }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    // element.checked = true;
    openModal('#tasking-modal');

  }

  showSecTitle : boolean = false;
  secondaryTitle


  onSelectionChange(event){
    console.log(event,"==============<<<<<<<<<<<<>>>>>>")
    if(event){
      if(event !== 'Task Closed'){
        let url  = `master/lookup?type__code=${event == 'Work In Progress'? 'PRO_SEC': 'PRO_TER'}`
        this.api
      .getAPI(environment.API_URL + url)
      .subscribe((res) => {
        console.log(res,"============>>>>>>>>>>>>>")
        this.secondaryTitle = res.data;
        this.showSecTitle = true;
      });
      }else{
        this.showSecTitle = false;
      }
    }

  }
  isViewExtension: boolean = false;
extension(){
  console.log('Extension button clicked'); // Add this to check if it's firing
  this.isViewExtension = true

}


  onSubmit() {
    this.showError=true;
    // this.taskingForm.value.status == "1";
    this.taskingForm.patchValue({start_date:this.datepipe.transform(this.start_date,'yyyy-MM-dd')});
    this.taskingForm.patchValue({end_date:this.datepipe.transform(this.end_date,'yyyy-MM-dd')});
    if(this.taskingForm.value.status){
      if(this.taskingForm.value.status=="1")
        this.taskingForm.value.status="1"
    }
    else{
      this.taskingForm.value.status="2"
    }
    const formData = new FormData();
    // formData.append('file',this.imgToUpload);
    formData.append('status_description', this.taskingForm.value.status_description);
    formData.append('start_date', this.taskingForm.value.start_date);
    formData.append('title', this.taskingForm.value.title);
    formData.append('end_date', this.taskingForm.value.end_date);
    formData.append('tasking', this.data_list.id);
    formData.append('project_progress', this.taskingForm.value.project_progress);
    formData.append('id', this.taskingForm.value.id);
    formData.append('created_by', this.api.userid.user_id);
    formData.append('status_summary', this.taskingForm.value.status_summary);
    formData.append('status', this.taskingForm.value.status);
    // formData.append('file', this.imgToUpload)
    formData.append('secondary_title', this.taskingForm.value.secTitle)


    // if(this.imgToUpload !=null){
    //   formData.append('file', this.imgToUpload)
    // }
     if (this.taskingForm.valid) {


      this.taskingForm.value.created_by = this.api.userid.user_id;
      // this.editForm.value.status = this.editForm.value.status==true ? "1" : "2";
      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking-status/crud",
          formData,
          // this.taskingForm.value

        )
        .subscribe((res) => {
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            this.getViewStatus( this.data_list.id);
            // this.closebutton.nativeElement.click();
            let reset = this.formGroupDirective.resetForm();
            if(reset!==null) {
              this.initForm();
            }
            // this.showError=false;
          } else if(res.status==environment.ERROR_CODE) {
            this.error_msg=false;
            this.ErrorMsg=res.message;
            setTimeout(()=> {
              this.error_msg = true;
           }, 2000);
          } else {
            const msg = language[environment.DEFAULT_LANG].unableSubmit;
            this.notification.displayMessage(msg);
          }

        });
    }
    // closeModal('#tasking-modal');
  }


  onImageHandler(event:any) {
    //console.log(event,event.target.files[0])
    if (event.target.files.length > 0) {
      this.imgToUpload= event.target.files[0];
     };

    }



  taskingGroups: any;
  getTaskingGroups() {
    this.api
      .getAPI(environment.API_URL + "master/taskinggroups")
      .subscribe((res) => {
        this.taskingGroups = res.data;
      });
  }

  id: any;
  task_name: any;
  task_Desc: any;
  tasking_group: any;


  getAccess() {
   this.moduleAccess = this.api.getPageAction();
    if (this.moduleAccess) {
      let addPermission=(this.moduleAccess).filter(function(access){ if(access.code=='ADD') return access.status; }).map(function(obj) {return obj.status;});
      let viewPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'VIW') { return access.status; } }).map(function (obj) { return obj.status; });;
      let archivePermission=(this.moduleAccess).filter(function(access){ if(access.code=='ARCHIVE') return access.status; }).map(function(obj) {return obj.status;});
      let deletePermission=(this.moduleAccess).filter(function(access){ if(access.code=='DEL') return access.status; }).map(function(obj) {return obj.status;});
      this.permission.add=addPermission.length>0?addPermission[0]:false;
      this.permission.view = viewPermission.length > 0 ? viewPermission[0] : false;;
      this.permission.archive = archivePermission.length > 0 ? archivePermission[0] : false;;
      this.permission.delete=deletePermission.length>0?deletePermission[0]:false;

    }

  }

  // applyFilter(event: Event) {
  //   this.filterValue = (event.target as HTMLInputElement).value;
  //   if (this.filterValue) {
  //     this.dataSourcelist.filter = this.filterValue.trim().toLowerCase();
  //   } else {
  //     this.getTasking();
  //   }
  // }

  selectedTrial:any;
  taskname:any;
  tasknumber:any
  openCurrentStatus(country){
	this.id=country.id;
    console.log('tasking country',country)
    this.taskname = country.task_name;
    this.tasknumber = country.task_number_dee;
    // this.selectedTrial=tasking;
    openModal('#trial-status-modal');
	this.getComments();
  }
  printReceipt(country) {
    this.id=country.id;
    window.open(environment.API_URL+"transaction/approved_task/"+ this.id)
  }

  UploadReceipt(country) {
    this.id=country.id;
    window.open(environment.API_URL+"transaction/approved_all_task_view/"+ this.id)
  }

  completedtask(country) {
    this.id=country.id;
    openModal('#completedTask-modal');
  }

  archivetask(country){
    this.id=country.id;
    console.log('this.id0',this.id)
    openModal('#archive-modal')
  }
  commentModal(comment){
    openModal('#comment-modal')
    this.commentForm.patchValue(comment)
  }

  taskid:any;
  opentask(country:any){
	  console.log('countyryry',country);
    this.resetexportform();
    // this.exportform.reset();
    openModal('#export');
	  this.taskid = country.id;

  }


  data:any;
  approvalData:any;
  pendingAt:any;
  openApproveDialog(countryList) {
    // this.id=tasking.id;
    // if(reset !==null)

    this.id=countryList.id;
    this.approvalData = countryList;
    // this.id=data.id
    // this.candidateName=data.name
    this.approvalForm.patchValue({id:this.id,tasking:this.id,approved_level:countryList.approved_level,approved_role_id:this.token_detail.role_center[0].user});

    // openModal('#approval-modal');
    // this.approveForm=this.fb.group({

    //  remark:[''],
    //  pendingAt:['']
    // });

    this.dialogRef = this.modalService.open(this.approve);
    // let reset = this.formGroupDirective.resetForm();
    // if (reset !== null) {
    //   this.initForm();
    // }

  }
  approvalType='Recommendation';
  approvalButton='Recommend';
  aTrial:any;
  appLevel:any;

  onApproval()
  {
   this.approvalForm.patchValue({status:"1"});
    triggerClick('#approvalSubmit');
  }
  approved_level:any;
  approved_role_id:any;
  status:any;

  onApprovalSubmit()
  {
   this.showError=true;
   this.approvalForm.value.id=this.approvalData.id;
    // this.approvalForm.value.trail_id=this.trail_id=2;
    //this.approvalForm.value.trail_id=this.id;
  //  this.approvalForm.value.approved_level=this.approved_level;
    this.approvalForm.value.status = this.approvalData.status;
    this.approvalForm.value.approved_role_id = this.token_detail.role_center[0].user;

    // this.approvalForm.value.status==true ? 1 : 2
      if (this.approvalForm.valid) {
        this.api.postAPI(environment.API_URL + "transaction/trials/approval",this.approvalForm.value).subscribe((res) => {

            this.approvalForm.patchValue({comments:''});
           if(res.status==environment.SUCCESS_CODE){
              this.notification.success(res.message);
              // closeModal('#approval-modal');
              this.showError=false;
              this.dialogRef = this.modalService.dismissAll(this.approve);
             this.getTasking();
            //  this.localForm.submitted=false;
            } else if(res.status==environment.ERROR_CODE) {
              this.error_msg=true;
              this.ErrorMsg=res.message;
              setTimeout(()=> {
                this.error_msg = false;
             }, 2000);

            //  this.notification.displayMessage(res.message);
            } else {
             this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
            }

          });
      }
  }




  cancelmodal(){
    closeModal('#tasking-modal');
	closeModal('#export');
  }

 dismissmodal(){
   this.router.navigateByUrl('/tasking-portal/view-tasking-status')
 }



  activeTab: Tabs = "TaskWaiting";
  dialogRef:any;
  approveForm: FormGroup;
  rejectForm: FormGroup;
  statusRef:any;

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  // tasking_id:any;
  getTasking() {
    // if(this.token_detail.role_id==3 ){
      if(this.token_detail.process_id==3 ){
      this.api
      .postAPI(environment.API_URL + "transaction/trial/status",{'tasking_id':this.token_detail.tasking_id,'process_id':this.token_detail.process_id,'created_by':this.token_detail.user_id})
      .subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
          this.countryList = res.data
        this.dataSourcelist = new MatTableDataSource(this.countryList);

        this.dataSourcelist
        .paginator = this.pagination;
        // this.logger.log('country', this.countryList)
        }

      });

    }
    else{
      this.api
      .postAPI(environment.API_URL + "transaction/trial/status",{'tasking_id':this.token_detail.tasking_id,'process_id':this.token_detail.process_id})
      .subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
        this.dataSourcelist = new MatTableDataSource(res.data);
        this.countryList = res.data;
        this.dataSourcelist
        .paginator = this.pagination;
        // this.logger.log('codduntry', this.countryList)
        }

      });

    }

  }

  getComments() {

    this.api
      .getAPI(environment.API_URL + "transaction/trials_status?tasking="+this.id)
      .subscribe((res) => {
        this.countryList1 = res.data;

      });

  }

  approvalID:any;
  // openStatusDialog(id){
  //   console.log(this.approvalID)
  //   this.approvalID=id;
  //   this.statusRef= this.modalService.open(ViewStatusComponent,{ size: 'xl' });

  // }
  viewlist:any;
  viewStatusDialog(data){
    this.commentForm.get('comments').setValue(null);
    this.data_list=data.id;
    this.viewlist=data
    openModal('#viewTasking-modal');
     this.getstatus(data.id);
    console.log('datadata',data);
    this.taskname = data.task_name
    this.tasknumber = data.task_number_dee

    setTimeout(()=> {
      // this.getviewstatuscomment(this.viewlist.id);


      this.chartOptions = {
        series: [
          {
            name: "Completed",
            data: this.completed
          },
          {
            name: "Pending",
            data: this.pending
          }
        ],
        chart: {
          type: "bar",
          height: 400,
          stacked: true
        },
        colors: ["#008FFB" ,"#FF4560"],
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "20%"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        grid: {
          xaxis: {
            lines: {
              show: false
            }
          }
        },
        yaxis: {
          min: -100,
          max: 100,
          title: {
            // text: 'Age',
          }
        },
        tooltip: {
          shared: false,
          x: {
            formatter: function(val) {
              return val.toString();
            }
          },
          y: {
            formatter: function(val) {
              return Math.abs(val) + "%";
            }
          }
        },
        xaxis: {
          categories: this.name,
          title: {
            text: "Percent"
          },
          labels: {
            formatter: function(val) {
              return Math.abs(Math.round(parseInt(val, 10))) + "%";
            }
          }
        }
      };

	//   setTimeout(() => {
    //     updateChart
    //   }, 1000);
   }, 500);


  }

  commentslist:any;


  showcomments=false;
  closeviewlistmodal(){

    // this.series.data.setAll('');
    this.completed=[];
    this.pending=[];
    this.name=[];
    this.showcomments=false;


    closeModal('#viewTasking-modal');

    this.getTasking();


  }

  closecompletedmodal(){
    closeModal('#completedTask-modal');
  }

  closestatusmodal(){
    closeModal('#trial-status-modal');
  }

  saveviewstatus() {
    this.showcomments=true;
    console.log('commentform',this.commentForm);
    if(this.commentForm.value.created_by!=null && this.commentForm.value.tasking!=null){
    this.commentForm.value.created_by = this.api.userid.user_id;
    this.commentForm.value.tasking = this.viewlist.id;
    this.commentForm.value.status = '1';
    }
    // const formData = new FormData();
    // formData.append('tasking', this.viewlist.id);
    // formData.append('id',this.commentForm.value.id);

     if (this.commentForm.valid) {
      this.api
        .postAPI(
          environment.API_URL + "transaction/comments/crud",
          this.commentForm.value,
          // formData,

        )
        .subscribe((res) => {
          // this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            // this.getviewstatuscomment(this.viewlist.id);
            // this.commentForm.reset();

            this.closebutton.nativeElement.click();
            this.showcomments=false;
            this.commentclose()
          } else if(res.status==environment.ERROR_CODE) {
            this.error_msg=false;
            this.ErrorMsg=res.message;
            setTimeout(()=> {
              this.error_msg = true;
           }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
    // closeModal('#viewTasking-modal');
  }

  commentDelete(country:any){
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
    // this.commentForm.patchValue(country);
    // this.commentForm.patchValue({status:'3',comments:''});
        this.api
        .postAPI(
          environment.API_URL + "transaction/comments/crud",
          {status:'3',comments:'',id:country.id},
          // formData,

        )
        .subscribe((res) => {
          if(res.status === 1){
            this.notification.success(res.message);

            // this.getviewstatuscomment(this.viewlist.id);

          }
          else{
            this.notification.success(res.message);
          // this.getviewstatuscomment(this.viewlist.id);
          }
          // this.commentForm.reset();


        })
      }
        dialogRef=null;

      });
    }

  // getviewstatuscomment(id:any){

	// 	this.api
	// 	  .getAPI(environment.API_URL + "transaction/comments?tasking_id="+id)
	// 	  .subscribe((res) => {
	// 		this.dataSourcelist = new MatTableDataSource(res.data);
	// 		this.commentslist = res.data;
			
	// 	  });
	//   }

    addStatusdata=[];
  getViewStatus(id) {
    this.addStatusdata=[]
    this.api
      .getAPI(environment.API_URL + "transaction/tasking-status?tasking_id="+id)
      .subscribe((res) => {
        // this.dataSourceStatus = new MatTableDataSource(res.data);
        this.addStatusdata = res.data;
       

      });

  }

  addStatusHeader=[
  { field: 'title', header: 'Title', filter: true, filterMatchMode: 'contains' },
  { field: 'secondary_title', header: 'Secondary Title', filter: true, filterMatchMode: 'contains' },
  { field: 'start_date', header: 'Start Date', filter: true, filterMatchMode: 'contains' },
  { field: 'end_date', header: 'End Date', filter: true, filterMatchMode: 'contains' },

  ]
  editOption(view) {
    this.isReadonly=false;
    this.taskingForm.enable();
    this.crudName = "Edit";
    this.populate(view);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");

    openModal('#tasking-modal');


  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/tasking-status/crud", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('View Status '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getViewStatus(this.data_list.id);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  taskingID:any;
  close(){
    this.taskingID='';
    // let data=[];
    // this.dataSourceStatus= new MatTableDataSource(data);
    closeModal('#tasking-modal');
  }
  archiveclose(){
    closeModal('#archive-modal');
  }
  commentclose(){
    closeModal('#comment-modal');
    this.commentForm.patchValue({comments:''})
  }

  compleList:any;
  savecompleted() {
    this.showcomments=true;
    this.completedForm.value.completed_status = "1";
    this.completedForm.value.tasking=this.id;
    console.log('completedForm', this.countryList[this.completedForm.value.tasking])
     if (this.completedForm.valid) {
      this.api
        .postAPI(
          environment.API_URL + "transaction/completed-view",
          this.completedForm.value,

        )
        .subscribe((res) => {
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.completedForm.reset();
            this.closebutton.nativeElement.click();
            this.getTasking();
			this.closecompletedmodal();
            this.showcomments=false;
          } else if(res.status==environment.ERROR_CODE) {
            this.error_msg=false;
            this.ErrorMsg=res.message;
            setTimeout(()=> {
              this.error_msg = true;
           }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }

  }

  savearchive() {
    this.showcomments=true;
    // this.completedForm.value.reason = "1";
    this.archiveForm.value.tasking=this.id;
     if (this.archiveForm.valid) {
      this.api
        .postAPI(
          environment.API_URL + "transaction/reason-task",
          this.archiveForm.value,

        )
        .subscribe((res) => {
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.archiveForm.reset();
			closeModal('#archive-modal')
			this.getTasking()
            this.closebutton.nativeElement.click();
            this.showcomments=false;
          } else if(res.status==environment.ERROR_CODE) {
            this.error_msg=false;
            this.ErrorMsg=res.message;
            setTimeout(()=> {
              this.error_msg = true;
           }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
  ;
  }


  approvedDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/trial/status", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
			console.log('asdasdasd',res);

            this.notification.warn('Approved Task '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getTasking();
            // this.getViewStatus(this.data_list.id);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }


  processview = [];
  gettitlelist() {
    this.api
      .getAPI(environment.API_URL + "master/lookup?type__code=PRO")
      .subscribe((res) => {
        this.processview = res.data;
      });
  }


  exports:any
    saveform(taskid:any){
      console.log('export form',this.exportform.value);
      this.id=taskid;
      this.exportform.value.id = taskid

      window.open(environment.API_URL+"transaction/approved_all_task_excel/"+taskid+"/?initiator="+this.exportform.value.initiator+"&apso="+this.exportform.value.apso+"&wesee="+this.exportform.value.wesee+"&dg_wesee="+this.exportform.value.dg_wesee+"&dee="+this.exportform.value.dee+"&acom="+this.exportform.value.acom+"&com="+this.exportform.value.com+"&tasking="+this.exportform.value.tasking+"&mile="+this.exportform.value.mile)
      closeModal('#export');
      this.resetexportform();
  }

  resetexportform(){
    //this.exportform.patchValue({initiator:"false",apso:"false",wesee:"false",dg_wesee:"false",dee:"false",acom:"false",com:"false",tasking:"false",mile:"false"});
    this.exportform.reset();
  }

gridColumns=[
  { field: 'task_number_dee', header: 'Task Number (DEE)', filter: true, filterMatchMode: 'contains' },
  { field: 'task_name', header: 'Task Name', filter: true, filterMatchMode: 'contains' },
  { field: 'assigned_tasking_group.tasking_group.name', header: 'Assigned Tasking Group', filter: true, filterMatchMode: 'contains' },
  {     field: 'sponsoring_directorate',     header: 'Sponsoring Directorate', filter: true, filterMatchMode: 'contains', },
  {  field: 'time_frame_for_completion_month', header: 'Time Frame for Completion', filter: true, filterMatchMode: 'contains',},
  { field: 'legacy_data', header: 'Legacy Data', filter: true, filterMatchMode: 'contains' }
]
exportData:any;
filterData:any;
handleFilter(filterValue: any) {
  
  this.filterData = filterValue;
  console.log('Filter triggered with value:', filterValue);
}
handlePagination(pageEvent: any) {
  console.log('Pagination triggered with event:', pageEvent);
}


expDataHeader=[
  { field: 'task_number_dee', header: 'Task Number (DEE)' },
  { field: 'task_name', header: 'Task Name' },
  { field: 'cost_implication', header: 'Cost Implication' },
  { field: 'sponsoring_directorate', header: 'Sponsoring Directorate' },
  { field: 'time_frame_for_completion_month', header: 'Time Frame (Months)' },
  { field: 'comments_of_wesee', header: 'Wesee Comments' },
  { field: 'comments_of_dee', header: 'DEE Comments' },
  { field: 'comments_of_apso', header: 'APSO Comments' },
  { field: 'approval_of_com', header: 'COM Approval' },
  { field: 'tasking_status', header: 'Tasking Status' },
  { field: 'legacy_data', header: 'Legacy Data' },
  { field: 'created_by.first_name', header: 'Created By' },
  { field: 'created_on', header: 'Created On' },
  { field: 'modified_on', header: 'Modified On' }
]

downloadexcel() {
  let data = document.getElementById('xlseExport');
  if (!data) {
    console.error('Table element not found.');
    return;
  }

  // Create a worksheet from the table
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

  // Create a new workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Approved Tasks');

  // Write the workbook to a file with .xlsx extension
  XLSX.writeFile(wb, this.fileName);
  this.exportData=this.dataSourcelist.data
  this.visible=false;
  
}
protected readonly value = signal('');

protected onInput(event: Event) {
  this.value.set((event.target as HTMLInputElement).value);
}
selectedHeader=[]
fileName:string;
isFormHide=false
submitHeaderForm() {
  this.isFormHide=true
    // Extract form values
    this.selectedHeader = this.xlxsForm.get('header')?.value || [];
    this.fileName = this.xlxsForm.get('fileName')?.value+".xlsx" || 'sheet.xlsx';
    this.xlxsForm.reset()
    console.log(this.selectedHeader);
  }
  selectAll() {
    const allHeaders = this.expDataHeader.map(option => option);
    this.xlxsForm.get('header')?.setValue(allHeaders);
  }

  openPopexportExcel(){
    this.isFormHide=false
    this.visible=true;
    if(this.filterData){
      this.exportData=this.filterData;
    }
    else{
      this.exportData=this.dataSourcelist.data
    }
  }
  handleUpload(rowData: any) {
    console.log('Uploaded row data:', rowData);}

    onUpload(event) {
      for(let file of event.files) {
         
        }


}
onFileUpload(event) {   
  const formData = new FormData();;
 
     for (let file of event.files) {
       this.file = file;
       formData.append('legacy_attachment', file);
       formData.append('id',this.id);
  }

  this.api.postAPI(environment.API_URL + 'transaction/tasking/crud', formData).subscribe(res=>{
    if (res.status === 1) {
      this.notification.success(res.message);

    }
    else {
      this.notification.success(res.message);
      
    }
  })
 }

 download(event: any) {
  const url = event.legacy_attachment;
    window.open(url, '_blank');
  
}

}
