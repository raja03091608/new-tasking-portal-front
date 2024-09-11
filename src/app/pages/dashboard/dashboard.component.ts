import * as am5 from '@amcharts/amcharts5';
import { ApiService } from "../../service/api.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { environment } from "../../../environments/environment";
import * as am5percent from '@amcharts/amcharts5/percent';
import { ConsoleService } from "../../service/console.service";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { NotificationService } from "../../service/notification.service";
import { ActivatedRoute } from '@angular/router';
import { language } from "../../../environments/language";

import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  ViewEncapsulation,
  Input,

} from '@angular/core';
import GSTC, { Config, GSTCResult } from 'gantt-schedule-timeline-calendar';
import { Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from 'gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js';
import { ApexAxisChartSeries, ApexChart, ApexFill,ApexLegend, ApexDataLabels, ApexGrid, ApexYAxis, ApexXAxis, ApexPlotOptions, ChartComponent, ApexTooltip,ApexStroke,ApexTitleSubtitle, } from 'ng-apexcharts';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

export type ChartOptions1 = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	fill: ApexFill;
	legend: ApexLegend;
	xaxis: ApexXAxis;
	plotOptions: ApexPlotOptions;
  };

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

  declare function openModal(selector):any;
  declare function closeModal(selector):any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss',
  '../../../../node_modules/gantt-schedule-timeline-calendar/dist/style.css',
  ],
  encapsulation: ViewEncapsulation.None,

})

export class DashboardComponent implements OnInit {
  @Input() item:any;
  id:any;
  sub:any;
  username:any;
  series: any;
  login_id:any;
  dataSourcelist: MatTableDataSource<any>;
  public countryList1 = [];
  public chartOptions1: Partial<ChartOptions1> |any;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  token_detail:any;
  constructor(public api: ApiService ,private dialog: MatDialog,private logger: ConsoleService,private route: ActivatedRoute, private notification: NotificationService,) {

    this.route.queryParams.subscribe(params => {
       this.id = atob(params['tasking_id']);
       console.log('iddd',this.id);
       this.login_id = this.api.userid.user_id
     // Print the parameter to the console.
  });


  this.token_detail=this.api.decryptData(localStorage.getItem('token-detail'));


  this.sub = this.route.data
    .subscribe((v:any) => {
    this.username= v.some_data});

    var updateChart1 = this.chartOptions1 = {
      series:
        this.milstonechartData,
      chart: {
        redrawOnWindowResize: true,
        height: 450,
        type: "rangeBar",
		toolbar: {
			show: false
		  },
		  zoom: {
			enabled:false,
		  },

      },
      responsive: true,
      maintainAspectRatio: true,
      dataLabels: {
        enabled: false,
      },
      animations: {
        enabled: true,
      },
      plotOptions: {
        bar: {
        horizontal: true,
        barHeight: "20%",

        }
      },
      xaxis: {
        type: "datetime",


      },
      fill: {
        type: "gradient",
        gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [50, 0, 100, 100]
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left"
      }

      };

      var updateChart = this.chartOptions = {
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
      updateChart1
      updateChart
  }, 1000);





  }
  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild('gstcElement', { static: true })  gstcElement: ElementRef;
  @ViewChild("closebutton") closebutton;
  gstc: GSTCResult;
  public statuslist = [];
  public statusTasking = [];
  public countryList = [];
  public commentForm = new FormGroup({
    id: new FormControl(""),
    tasking:new FormControl(""),
    status : new FormControl(""),
    created_by: new FormControl(""),
    comments: new FormControl("",[Validators.required]),

  });
  populate(data) {
    this.commentForm.patchValue(data);
  }

  Error = (controlName: string, errorName: string) => {
    return this.commentForm.controls[controlName].hasError(errorName);
  };
  Errorcomment = (controlName: string, errorName: string) => {
    return this.commentForm.controls[controlName].hasError(errorName);
  };


  dataSource: MatTableDataSource<any>;
  generateConfig(): Config {
    const iterations = 400;
    // GENERATE SOME ROWS

    const rows:any = {};
    for (let i = 0; i < iterations; i++) {
      const withParent = i > 0 && i % 2 === 0;
      const id = GSTC.api.GSTCID(i.toString());
      rows[id] = {
        id,
        label: 'Room ' + i,
        parentId: withParent ? GSTC.api.GSTCID((i - 1).toString()) : undefined,
        expanded: false,
      };
    }

    // GENERATE SOME ROW -> ITEMS

    let start = GSTC.api.date().startOf('day').subtract(30, 'day');
    const items:any = {};
    for (let i = 0; i < iterations; i++) {
      const id = GSTC.api.GSTCID(i.toString());
      start = start.add(1, 'day');
      items[id] = {
        id,
        label: 'User id ' + i,
        time: {
          start: start.valueOf(),
          end: start.add(1, 'day').valueOf(),
        },
        rowId: id,
      };
    }

    // LEFT SIDE LIST COLUMNS

    const columns = {
      percent: 100,
      resizer: {
        inRealTime: true,
      },
      data: {
        [GSTC.api.GSTCID('label')]: {
          id: GSTC.api.GSTCID('label'),
          data: 'label',
          expander: true,
          isHtml: true,
          width: 230,
          minWidth: 100,
          header: {
            content: 'Room',
          },
        },
      },
    };

    return {
      licenseKey:
        '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
      list: {
        rows,
        columns,
      },
      chart: {
        items,
      },
      plugins: [TimelinePointer(), Selection()],
    };
  }
  valueType=[];
  mapped=[];
  statusValue=[];

  dataValue=[];
  chart_data=[];


  getTasking() {
    this.api
      .postAPI(environment.API_URL + "transaction/trial/status",{'tasking_id':this.token_detail.tasking_id,'process_id':this.token_detail.process_id})
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.countryList = res.data;
        this.dataSource.paginator = this.pagination;
      });

  }
  pending=[];
  name=[];
  completed=[];
  getStatusTasking() {
    // if(this.token_detail.role_id==3 ){
    if(this.token_detail.process_id==3 && this.token_detail.tasking_id!=''){
      this.api
    .postAPI(environment.API_URL + "transaction/trial/status",{'tasking_id':this.token_detail.tasking_id,'process_id':this.token_detail.process_id})
    .subscribe((res) => {
      this.dataSource = new MatTableDataSource(res.data);
      this.statusTasking = res.data;
      this.dataSource.paginator = this.pagination;

      });

    }
    else if (this.token_detail.process_id==2 && this.token_detail.department_id!=''){
      this.api
    .postAPI(environment.API_URL + "transaction/trial/status",{'process_id':this.token_detail.process_id})
    .subscribe((res) => {
      this.dataSource = new MatTableDataSource(res.data);
      this.statusTasking = res.data;
      this.dataSource.paginator = this.pagination;
      // this.logger.log('ytyty', this.statusTasking)
      // for(let i=0;i<this.statusTasking.length;i++){
      //   if(this.statusTasking[i].project_status && this.statusTasking[i].task_number_dee){
      //     if(this.statusTasking[i].project_status.project_progress!='' && this.statusTasking[i].task_number_dee!=''){
      //       this.pending.push([100-this.statusTasking[i].project_status.project_progress])
      //       this.completed.push('-'+[this.statusTasking[i].project_status.project_progress])
      //       this.name.push([this.statusTasking[i].task_number_dee])

      //     }


      //   }
      // }

      });

    }
   else{
      this.api
    .postAPI(environment.API_URL + "transaction/trial/status",{'process_id':''})
    .subscribe((res) => {
      this.dataSource = new MatTableDataSource(res.data);
      this.statusTasking = res.data;
      this.dataSource.paginator = this.pagination;

      });

    }


  }

  commentModal(comment){
    openModal('#comment-modal')
    this.commentForm.patchValue(comment)
  }
  commentclose(){
    closeModal('#comment-modal');
    this.commentForm.patchValue({comments:''})
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

            this.getviewstatuscomment();

          }
          else{
            this.notification.success(res.message);
          this.getviewstatuscomment();
          }
          // this.commentForm.reset();


        })
      }
        dialogRef=null;

      });
    }
  getViewstatus(){

		this.api
		  .getAPI(environment.API_URL + "transaction/tasking-status?tasking_id="+this.id)
		  .subscribe((res) => {

			this.viewstatus = res.data;
      this.taskname=this.viewstatus[0]?this.viewstatus[0].tasking.task_name:''
      this.tasknumber=this.viewstatus[0]?this.viewstatus[0].tasking.task_number_dee:''
      for(let i=0;i<this.viewstatus.length;i++){
        // if(this.viewstatus[i].taskingtask_number_dee){
          if(this.viewstatus[i].project_progress!='' && this.viewstatus[i].tasking.task_number_dee!=''){
            this.pending.push([100-this.viewstatus[i].project_progress])
            this.completed.push('-'+[this.viewstatus[i].project_progress])
            this.name.push([this.viewstatus[i].tasking.task_number_dee])

          }


        // }
      }

		  });
	  }
    mileList:any;
    counter:any;
	getComments() {

		this.api
		  .getAPI(environment.API_URL + "transaction/trials_status?tasking="+this.id)
		  .subscribe((res) => {
			this.countryList1 = res.data;
			console.log('List',this.countryList1);

		  });

	  }

    getMileStone(){

      this.api
        .getAPI(environment.API_URL + "transaction/milestone-status?tasking_id="+this.id)
        .subscribe((res) => {

        this.mileList = res.data;
        this.counter = 0;
        for (let i = 0; i < this.mileList.length; i++) {
          this.counter=this.counter+parseInt(this.mileList[i].manpower);
        }

        });
      }

viewstatus:any;
milstonechartData=[];
getChart(){
  this.api
  .getAPI(environment.API_URL + "transaction/milestone-status?tasking_id="+this.id)
  .subscribe((res) => {
    this.mileList = res.data;

    for (let i=0;i<this.mileList.length;i++){

      this.milstonechartData.push({name:this.mileList[i].milestone,data:[{x:this.mileList[i].tasking.task_name,y:[new Date(this.mileList[i].task_start_date).getTime(),new Date(this.mileList[i].task_end_date).getTime()]}]})

    }

});

}



manpowercount:any;
taskname:any;
tasknumber:any;
  ngOnInit(): void {
  this.getStatusTasking();
	this.getTasking();
  this.getMileStone();
  this.getViewstatus();
  this.getChart();
  this.getComments();
  this.getviewstatuscomment();
	// this.getTaskingGroups();
    setTimeout(() => {
    this.chartOptions1 = {
      series:
        this.milstonechartData,
      chart: {
        redrawOnWindowResize: true,
        height: 450,
        type: "rangeBar",
        toolbar: {
          show: false
        },
        zoom: {
          enabled:false,
        },
      },
      responsive: true,
      maintainAspectRatio: true,
      dataLabels: {
        enabled: false,
      },
      animations: {
        enabled: true,
      },
      plotOptions: {
        bar: {
        horizontal: true,
        barHeight: "20%",

        }
      },
      xaxis: {
        type: "datetime",


      },
      fill: {
        type: "gradient",
        gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [50, 0, 100, 100]
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left"
      }

      };

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
    }, 1000);


  }


  updateFirstItem(): void {
    this.gstc.state.update(
      `config.chart.items.${GSTC.api.GSTCID('0')}`,
      (item:any) => {
        item.label = 'Dynamically updated!';
        return item;
      }
    );
  }

  updateFirstRow(): void {
    this.gstc.state.update(
      `config.list.rows.${GSTC.api.GSTCID('0')}`,
      (row:any) => {
        row.label = 'Dynamically updated!';
        return row;
      }
    );
  }

  scrollToCurrentTime(): void {
    this.gstc.api.scrollToTime(GSTC.api.date().valueOf());
  }

  clearSelection(): void {
    this.gstc.api.plugins.Selection.selectCells([]);
    this.gstc.api.plugins.Selection.selectItems([]);
  }

  showError=false;
  ErrorMsg: any;
  error_msg = false;
  commentslist:any;
  showcomments=false;
  saveviewstatus() {
    this.showcomments=true;
    console.log('commentform',this.commentForm);
    if(this.commentForm.value.created_by!=null && this.commentForm.value.tasking!=null){
    this.commentForm.value.created_by = this.api.userid.user_id;
    this.commentForm.value.tasking = this.id;
    this.commentForm.value.status = '1';
    }
     if (this.commentForm.valid) {
      this.api
        .postAPI(
          environment.API_URL + "transaction/comments/crud",
          this.commentForm.value,

        )
        .subscribe((res) => {
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            this.getviewstatuscomment();
            // this.commentForm.reset();
            this.showcomments=false;
            this.commentclose()
            // this.closebutton.nativeElement.click();
            this.showError=false;
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
  getviewstatuscomment(){

    	this.api
    	  .getAPI(environment.API_URL + "transaction/comments?tasking_id="+this.id)
    	  .subscribe((res) => {
    		this.dataSourcelist = new MatTableDataSource(res.data);
    		this.commentslist = res.data;
    	  });
      }



	//   taskingGroups:any;
	//   getTaskingGroups() {
	// 	this.api
	// 	  .getAPI(environment.API_URL + "master/taskinggroups")
	// 	  .subscribe((res) => {
	// 		this.taskingGroups = res.data;
	// 		console.log('Tasking Group',this.taskingGroups);

	// 		//console.log('taskingGroups0',this.taskingGroups)
	// 	  });
	//   }
  }



