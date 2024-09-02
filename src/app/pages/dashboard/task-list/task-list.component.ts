import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild,Input} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskBlockComponent } from '../task-block/task-block.component';
//import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { ActivatedRoute } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexFill, ApexDataLabels, ApexGrid, ApexYAxis, ApexXAxis, ApexPlotOptions, ChartComponent, ApexTooltip } from 'ng-apexcharts';
import moment from 'moment';
declare let $: any;
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "../../../service/notification.service";
import { ConfirmationDialogComponent } from "../../../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "../../../../environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "../../../service/console.service";
import { of } from 'rxjs';
import { formatDate } from "@angular/common";


declare function closeModal(selector): any;
declare function openModal(selector): any;
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  tooltip:ApexTooltip;
};


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, AfterViewInit,OnDestroy{
	displayedColumns: string[] = [
		"task_number_dee",
		"task_description",
		// "file",
		"due_date",
		"assignee",
		"Action",

	  ];
	@ViewChild('template') template: ElementRef;
	@ViewChild('template1') template1: ElementRef;
    @ViewChild(MatPaginator) pagination: MatPaginator;
	@ViewChild("closebutton") closebutton;
  deleteProjectRef:any;
  TaskBlockRef:any;
  username:any;
  filterValue: any;
  country:any;
  ImageUrl: string;
  image: any;

  public crudName = "Save";
  public countryList = [];
  public statusTasking = [];

  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  showError=false;
sub:any;
//country:any;

dataSource: MatTableDataSource<any>;

//dtOptions: DataTables.Settings = {};
@ViewChild("chart") chart: ChartComponent;
public chartOptions: Partial<ChartOptions> | any;
constructor(private modalService: NgbModal, private route: ActivatedRoute,public api: ApiService, private notification: NotificationService,
    private dialog: MatDialog, private router: Router, private elementref: ElementRef, private logger: ConsoleService) {


    this.sub = this.route.data
    .subscribe((v:any) => {
    this.username= v.some_data});

    this.chartOptions = {

			series: [
				{
				   data:this.chart_data

        }
      ],
      tooltip: {
        enabled:true
        // custom: function({series, seriesIndex, dataPointIndex, w}) {
        //   var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

        //   return '<ul>' +
        //   '<li><b>Price</b>: ' + data.x + '</li>' +
        //   '<li><b>Number</b>: ' + data.y + '</li>' +
        //   '<li><b>Product</b>: \'' + data.product + '\'</li>' +
        //   '<li><b>Info</b>: \'' + data.info + '\'</li>' +
        //   '<li><b>Site</b>: \'' + data.site + '\'</li>' +
        //   '</ul>';
        // }
      },
      chart: {
        height: 450,
        type: "rangeBar",
        events: {
          click: (event:any, chartContext:any, config:any) => {
            // console.log(config.seriesIndex);
            // console.log(config.dataPointIndex);
            this.openPopup();
          }
        }

      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          dataLabels: {
            hideOverflowingLabels: false
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val:any, opts:any) {
          var label = opts.w.globals.labels[opts.dataPointIndex];
          var a = moment(val[0]);
          var b = moment(val[1]);
          var diff = b.diff(a, "days");
          return label + "- " + diff+0 + (diff > 10 ? " %" : " %");
        },
        style: {
          colors: ["#f3f4f5", "#fff"]
        },
        // events: {
        //   click:
        //     // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
        //     this.openDelete()

        // }
      },

      xaxis: {
        type: "datetime"
      },
      yaxis: {
        show: false
      },

      grid: {
        row: {
          colors: ["#f3f4f5", "#fff"],
          opacity: 1
        }
      }
    };
  }
  taskForm = new FormGroup({
    id: new FormControl(""),

	status: new FormControl(""),
    comment_status:new FormControl(""),
//   });
   sdForm : new FormGroup({
	sponsoring_directorate: new FormControl("",[Validators.required]),
    task_description: new FormControl(""),
    file: new FormControl("",),
  }),
weseeForm : new FormGroup({
      id: new FormControl(""),
      cost_implication: new FormControl(""),
     comments_of_wesee: new FormControl(""),
     time_frame_for_completion: new FormControl(""),
  }),
deeForm : new FormGroup({
     task_number_dee: new FormControl(""),
    comments_of_dee: new FormControl(""),
  }),
acomForm : new FormGroup({
	recommendation_of_acom_its:new FormControl(""),
}),
comForm : new FormGroup({
	approval_of_com: new FormControl(""),
})
});

status = this.taskForm.value.status;

  populate(data) {
    this.taskForm.get('sdForm').patchValue(data);
	this.taskForm.get('weseeForm').patchValue(data);
	this.taskForm.get('deeForm').patchValue(data);
	this.taskForm.get('acomForm').patchValue(data);
	this.taskForm.get('comForm').patchValue(data);
  this.taskForm.patchValue({sdForm:{sponsoring_directorate:data.sponsoring_directorate}})
	if (data ? data.file : "") {
		var img_link = data.file;
		//var trim_img = img_link.substring(1)
		this.ImageUrl = img_link;
	  }

  }

  initForm() {
    this.taskForm.patchValue({
      status: "1",
    });

  }

  Error = (controlName: string, errorName: string) => {
    return this.taskForm.controls[controlName].hasError(errorName);
  };

  statusValue=[];
  series:any;
  chart_data=[];
  getStatusTasking() {
	this.api
	.postAPI(environment.API_URL + "transaction/trial/status",{'tasking_id':this.token_detail.tasking_id})
	.subscribe((res) => {
	  this.dataSource = new MatTableDataSource(res.data);
	  this.statusTasking = res.data;
	  this.dataSource.paginator = this.pagination;
	  // this.logger.log('ytyty', this.statusTasking)
	  for(let i=0;i<this.statusTasking.length;i++){
		this.statusValue.push({value:this.statusTasking[i].project_status.project_progress,category:this.statusTasking[i].task_number_dee})
		this.series.data.push({value:this.statusTasking[i].project_status.project_progress,category:this.statusTasking[i].task_number_dee})
	  }
	  for(let i=0;i<this.statusTasking.length;i++){
		this.chart_data.push({y:[new Date(this.statusTasking[i].project_status.start_date).getTime(),new Date(this.statusTasking[i].project_status.end_date).getTime()],x:this.statusTasking[i].task_number_dee,  product: 'name',
		info: 'info',
		site: 'name',
		fillColor: "#008FFB"})
		 //     new Date("2019-03-07").getTime(),


	   }

	});
}


token_detail:any;
  ngOnInit(): void {
	this.token_detail=this.api.decryptData(localStorage.getItem('token-detail'));
	this.getTasking();
	this.getStatusTasking();
    // this.dtOptions = {
    //   pagingType: 'full_numbers'
    // };


    // $("#kt_datatable_dom_positioning").DataTable({
    //   "language": {
    //    "lengthMenu": "Show _MENU_",
    //   },
    //   "dom":
    //    "<'row'" +
    //    "<'col-sm-6 d-flex align-items-center justify-conten-start'l>" +
    //    "<'col-sm-6 d-flex align-items-center justify-content-end'f>" +
    //    ">" +

    //    "<'table-responsive'tr>" +

    //    "<'row'" +
    //    "<'col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'i>" +
    //    "<'col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'p>" +
    //    ">"
    //  });


    let root = am5.Root.new("chartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
// start and end angle must be set both for chart and series
let chart = root.container.children.push(am5percent.PieChart.new(root, {
  startAngle: 180,
  endAngle: 360,

  layout: root.verticalLayout,
  innerRadius: am5.percent(50)
}));

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
// start and end angle must be set both for chart and series
this.series = chart.series.push(am5percent.PieSeries.new(root, {
  startAngle: 180,
  endAngle: 360,
  valueField: "value",
  categoryField: "category",
  alignLabels: false
}));

this.series.states.create("hidden", {
  startAngle: 180,
  endAngle: 180
});

this.series.slices.template.setAll({
  cornerRadius: 5
});

this.series.ticks.template.setAll({
  forceHidden: true
});

this.series.labels.template.setAll({
  text: "{category}"
});
this.series.slices.template.setAll({
  tooltipText: "{category}"
});

// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
// series.data.setAll([
//   { value: 10, category: "Task 1" },
//   { value: 9, category: "Task 2" },
//   { value: 6, category: "Task 3" },
//   { value: 5, category: "Task 4" },
//   { value: 4, category: "Task 5" },
//   { value: 3, category: "Task 6" },
//   { value: 1, category: "Task 7" }
// ]);

this.series.appear(1000, 100);

  }
  getTasking() {
    this.api
      .postAPI(environment.API_URL + "transaction/trial/status",{'tasking_id':this.token_detail.tasking_id})
      .subscribe((res) => {
        //this.dataSource = new MatTableDataSource(res.data);
        this.countryList = res.data;
      });

  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if (this.filterValue) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getTasking();
    }
  }
  currentDate: Date;
  onSubmit() {
	this.showError=true;
	this.currentDate = new Date();
	 //this.taskForm.value.id=this.id;

	const cValue = formatDate(this.currentDate, 'yyyy', 'en-US');
	const ccValue=formatDate(this.currentDate,'dd','en-US');
	(new Date(),'yyyy/MM/dd', 'en');
	this.taskForm.get('deeForm').value.task_number_dee;
 	if(this.taskForm.get('deeForm').value.task_number_dee!=''){
 	  this.taskForm.get('deeForm').value.task_number_dee='WESEE/'+this.taskForm.get('deeForm').value.task_number_dee+'/'+cValue+'/'+ccValue;
	 	}

//console.log(this.sponsoring_directorate,this.taskForm.get('sdForm').value.sponsoring_directorate)
//  if(this.taskForm.get('sdForm').value.sponsoring_directorate!=''){
// 	this.taskForm.get('sdForm').value.sponsoring_directorate='IHQ MOD(N)/'+this.api.userid.first_name;
// 	  }
    //this.taskForm.value.sponsoring_directorate='IHQ MOD(N)/'+this.taskForm.value.sponsoring_directorate;
    //this.taskForm.value.created_by = this.api.userid.user_id;
   //this.taskForm.value.status = this.taskForm.value.status==true ? 1 : 2;
    const formData = new FormData();
    formData.append('sponsoring_directorate', this.taskForm.get('sdForm').value.sponsoring_directorate);
    formData.append('task_description', this.taskForm.get('sdForm').value.task_description);
    formData.append('id', this.taskForm.value.id);
    // formData.append('file', this.imgToUpload);

	formData.append('cost_implication', this.taskForm.get('weseeForm').value.cost_implication);
	formData.append('time_frame_for_completion', this.taskForm.get('weseeForm').value.time_frame_for_completion);
	formData.append('comments_of_wesee', this.taskForm.get('weseeForm').value. comments_of_wesee);
	formData.append('task_number_dee', this.taskForm.get('deeForm').value. task_number_dee);
	formData.append('comments_of_dee', this.taskForm.get('deeForm').value. comments_of_dee);
	formData.append('recommendation_of_acom_its', this.taskForm.get('acomForm').value.recommendation_of_acom_its);
	formData.append('approval_of_com', this.taskForm.get('comForm').value.approval_of_com);

    //formData.append('created_by', this.taskForm.value.created_by);
    formData.append('modified_by', this.api.userid.user_id);


	if (this.taskForm.valid) {
		//formData.append('id', this.editForm.value.id);
		this.api
		  .postAPI(
			environment.API_URL + "transaction/tasking/crud",
			formData,
		  )

        .subscribe((res) => {
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTasking();
            this.closebutton.nativeElement.click();
          } else if(res.status==environment.ERROR_CODE) {
            this.error_msg=true;
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

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {

    let root = am5.Root.new("chartdiv1");



// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  layout: root.verticalLayout
}));

let colors = chart.get("colors");

let data = [{
  country: "One",
  visits: 725
}, {
  country: "Two",
  visits: 625
}, {
  country: "Three",
  visits: 602
}, {
  country: "Four",
  visits: 509
}, {
  country: "Five",
  visits: 322
}, {
  country: "Six",
  visits: 214
}, {
  country: "Seven",
  visits: 204
},
];

prepareParetoData();

function prepareParetoData() {
  let total = 0;

  for (var i = 0; i < data.length; i++) {
    let value = data[i].visits;
    total += value;
  }

  let sum = 0;
  for (var i = 0; i < data.length; i++) {
    let value = data[i].visits;
    sum += value;
    //data[i].pareto = sum / total * 100;
  }
}



// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "country",
  renderer: am5xy.AxisRendererX.new(root, {
    minGridDistance: 30
  })
}));

xAxis.get("renderer").labels.template.setAll({
  paddingTop: 20
});

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
}));

let paretoAxisRenderer = am5xy.AxisRendererY.new(root, {opposite:true});
let paretoAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: paretoAxisRenderer,
  min:0,
  max:100,
  strictMinMax:true
}));

paretoAxisRenderer.grid.template.set("forceHidden", true);
paretoAxis.set("numberFormat", "#'%");


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "visits",
  categoryXField: "country"
}));

series.columns.template.setAll({
  tooltipText: "{categoryX}: {valueY}",
  tooltipY: 0,
  strokeOpacity: 0,
  cornerRadiusTL: 6,
  cornerRadiusTR: 6
});

// series.columns.template.adapters.add("fill", function(fill, target) {
//   return chart.get("colors").getIndex(series.dataItems.indexOf(target.dataItem));
// })


// pareto series
let paretoSeries = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: paretoAxis,
  valueYField: "pareto",
  categoryXField: "country",
  stroke: root.interfaceColors.get("alternativeBackground"),
  maskBullets:false
}));

paretoSeries.bullets.push(function() {
  return am5.Bullet.new(root, {
    locationY: 1,
    sprite: am5.Circle.new(root, {
      radius: 5,
      fill: series.get("fill"),
      stroke:root.interfaceColors.get("alternativeBackground")
    })
  })
})

series.data.setAll(data);
paretoSeries.data.setAll(data);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear();
chart.appear(1000, 100);




}

  openView(){
		this.TaskBlockRef = this.modalService.open(TaskBlockComponent, { size: 'lg' });
		this.TaskBlockRef.componentInstance.modelData = { 'data': 'view' };

  }

  openPopup(){
    this.deleteProjectRef = this.modalService.open(this.template1);
  }

  id:any;
  list:any;

  openEdit(country) {
    this.isReadonly=false;
    this.taskForm.enable();
    this.crudName = "Edit";
	this.id=country.id;
    this.populate(country);
    this.list=country;
	this.taskForm.disable();
	openModal('#crud-countries');}

  openDelete(){
    this.deleteProjectRef = this.modalService.open(this.template);


  }

  ngOnDestroy(){
    // am5.disposeAllCharts();
   // root.dispose();
  }
  imgToUpload:any;
  onImageHandler(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload= event.target.files[0];

     };

    }
	cancelmodal(){
		closeModal('#crud-countries');
	  }

}
