import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
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
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  constructor(private notification : NotificationService,
		private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,private http:HttpClient) { }
  public ticketlist = [];
  filterValue: any;
  url:any;

  displayedColumns: string[] = [
	"ticket",
	"title",
	"priority",
    "assigned_to",
	"submitter",
	"created",
    "status",
	"view",
    // "actions"
  ];
  ngOnInit(): void {
    this.getticketlist();
    this.url=environment.WISH_URL;
  }
  getticketlist() {
    this.http.get(environment.WISH_URL + "ticket/view")
      .subscribe((res:any) => {

			this.dataSource = new MatTableDataSource(res.data);

			this.ticketlist = res.data;
			this.dataSource.paginator = this.pagination;

      });
  }
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if (this.filterValue) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getticketlist();
    }
  }


}
