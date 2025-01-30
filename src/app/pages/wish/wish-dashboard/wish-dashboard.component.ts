import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
//import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "../../../service/notification.service";
import { ConfirmationDialogComponent } from "../../../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "../../../../environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "../../../service/console.service";



@Component({
  selector: 'app-wish-dashboard',
  templateUrl: './wish-dashboard.component.html',
  styleUrls: ['./wish-dashboard.component.scss']
})
export class WishDashboardComponent implements OnInit {
	displayedColumns: string[] = [

		"ticket",
		"title",
		"priority",
		"assigned_to",
		"submitter",
		"created",
		"view"



	  ];
    gridColumns = [
      { field: 'ticket', header: 'Ticket', filter: true, filterMatchMode: 'contains' },
      { field: 'title', header: 'Title', filter: true, filterMatchMode: 'contains' },
      { field: 'priority', header: 'Priority', filter: true, filterMatchMode: 'contains' },
      { field: 'assigned_to', header: 'Assigned To', filter: true, filterMatchMode: 'contains' },
      { field: 'submitter', header: 'Submitter', filter: true, filterMatchMode: 'contains' },
      { field: 'created', header: 'Created', filter: true, filterMatchMode: 'contains' },
      { field: 'view', header: 'View', filter: true, filterMatchMode: 'contains' },

    ]
	dataSource: MatTableDataSource<any>;
	dataSourcelist: MatTableDataSource<any>;
	@ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
	constructor(private notification : NotificationService,
		private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,private http:HttpClient){}
  public countryList = [];
  public countryList1 = [];
  url:any;
  ngOnInit(): void {
	this.getopendata();
	this.getTicketCount();
	this.getcloseddata();
  this.url=environment.WISH_URL;
  }

  










  getopendata() {
    this.http.get(environment.WISH_URL + "ticket/view?status=1")
      .subscribe((res:any) => {

			this.dataSource = new MatTableDataSource(res.data);

			this.countryList = res.data;
			this.dataSource.paginator = this.pagination;
      });
  }
  getcloseddata() {
    this.http.get(environment.WISH_URL + "ticket/view?status=4")
      .subscribe((res:any) => {

			this.dataSourcelist = new MatTableDataSource(res.data);

			this.countryList1 = res.data;
			this.dataSourcelist.paginator = this.pagination;

      });
  }
  open:any;
  closed:any;
  resolved:any;
  reopened:any;
  filterValue:any;
  filterValue1:any;
  getTicketCount(){
	this.http.get(environment.WISH_URL + "ticket/view?status=1")
	.subscribe((res:any) => {
		this.open=res.data.length;

  });
  this.http.get(environment.WISH_URL + "ticket/view?status=2")
	.subscribe((res:any) => {
		this.reopened=res.data.length;

  });
  this.http.get(environment.WISH_URL + "ticket/view?status=3")
  .subscribe((res:any) => {
	  this.resolved=res.data.length;

});
this.http.get(environment.WISH_URL + "ticket/view?status=4")
.subscribe((res:any) => {
	this.closed=res.data.length;
});
}
applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if(this.filterValue){
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getopendata();
    }
  }
  applyFilter1(event: Event) {
    this.filterValue1 = (event.target as HTMLInputElement).value;
    if(this.filterValue1){
      this.dataSourcelist.filter = this.filterValue1.trim().toLowerCase();
    } else {
      this.getcloseddata();
    }
  }

}
