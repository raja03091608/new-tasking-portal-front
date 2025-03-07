
import { NgIf } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { FilterService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-grid-wish',

  templateUrl: './grid-wish.component.html',
  styleUrl: './grid-wish.component.scss'
})
export class GridWishComponent implements OnInit {  
    @Input() isRestore: boolean;
    @Input() totalRecords:any;
  @Input() gridColumns: any[];
  @Input() gridData: any[];
  @Input() isEditable: boolean;
  @Input() isStatusAdd: boolean;
  @Input() isArchiveTask: boolean;
  @Input() isCommentTask: boolean;
  @Input() isAction: boolean;
  @Input() isDeletable: boolean;
  @Input() isView: boolean;
  @Output() filterEvent = new EventEmitter<any>();
  @Output() paginationEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() viewEvent = new EventEmitter<any>();
  @Output() statusEventAdd = new EventEmitter<any>();
  @Output() assignedEventAdd = new EventEmitter<any>();
  @Output() usersFetched: EventEmitter<any> = new EventEmitter();
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @Output() archivetaskEvent = new EventEmitter<any>();
  @Output() commenttaskEvent = new EventEmitter<any>();
  @Output() usersLoaded = new EventEmitter<any[]>();
  token_detail:any
  newRowData: any = {}; // Object to store data for a new row
  currentPage: number = 1;
  rowsPerPage: number = 10;
  filteredData: any[];  // New property to store filtered data
  filters: { [field: string]: { value?: any; condition?: string } } = {};
  searchValue: string;
    selectedRow: any;
  resolveNestedField(obj: any, path: string): any {
      const parts = path.split('.');
      let value = obj;

      for (const part of parts) {
          if (value) {
              // Handling arrays with an index enclosed in square brackets
              const indexMatch = part.match(/^(\w+)\[(\d+)\]$/);
              if (indexMatch) {
                  const arrayName = indexMatch[1];
                  const arrayIndex = parseInt(indexMatch[2], 10);
                  value = value[arrayName] && value[arrayName][arrayIndex];
              } else {
                  value = value[part];
              }
          } else {
              break;
          }
      }
      if (
          value &&
          typeof value === 'string' &&
          /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z/.test(value)
      ) {
          const dateObj = new Date(value);
          const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
          return formattedDate;
      }
      return value;
  }
  resolveField(item: any, field: string): any {
      return this.resolveNestedField(item, field);
  }
  createEmptyRowData(): any {
      const emptyRowData: any = {};
      this.gridColumns.forEach(column => {
          emptyRowData[column.field] = null; // Set initial value as null, you can customize this if needed
      });
      return emptyRowData;
  }

  onPagination(event: any) {
      this.paginationEvent.emit(event);
  }
   applyChanges(originalData: any, updatedData: any): void {
      for (const key in updatedData) {
          if (updatedData.hasOwnProperty(key)) {
              const value = updatedData[key];
              const isArrayIndex = key.includes('[') && key.includes(']');
              if (isArrayIndex) {
                  const parts = key.split('[');
                  const arrayKey = parts[0];
                  const arrayIndex = parseInt(parts[1].split(']')[0], 10);
                  if (Array.isArray(originalData[arrayKey])) {
                      if (arrayIndex >= 0 && arrayIndex < originalData[arrayKey].length) {
                          this.applyChanges(originalData[arrayKey][arrayIndex], { [parts[1].split(']')[1].slice(1)]: value });
                      }
                  }
              } else if (key in originalData) {
                  originalData[key] = value;
              } else {
                  let nestedKeys = key.split('.');
                  let nestedObject = originalData;
                  for (let nestedKey of nestedKeys) {
                      if (nestedKey in nestedObject) {
                          nestedObject = nestedObject[nestedKey];
                      } else {
                          break;
                      }
                  }
                  nestedObject[nestedKeys.pop()] = value;
              }
          }
      }
  }
  ngOnInit(): void {
   this.getUser(null);
  this.token_detail = this.api.decryptData(localStorage.getItem('token-detail'));
    
      this.filteredData = this.gridData;
      
  }

  constructor(private filterService: FilterService, private api:ApiService,private ref: ChangeDetectorRef,private toastr: ToastrService) { }
  getFilterValue(field: string): any {
      return this.filters[field]?.value;
  }
  onCustomClear() {
    this.filteredData = [...this.gridData]; // Replace filtered data with the original dataset
    this.searchValue = ''; 
  }
  onSearchInput(val):string {
    return val.trimStart(); // Remove leading spaces
}
  onFilterChange(filterValue: string, field: string, condition: string) {
      if (filterValue && filterValue.trim()) {
          // Update the specific filter for the given field
          this.filters[field] = { value: filterValue.trim(), condition: condition };
          this.applyFilters();
      } else {
          // Clear the filter for the field
          delete this.filters[field];

          // Apply filtering logic here
          this.applyFilters();
      }
  }

  applyFilters() {
      this.filteredData = [...this.gridData];
      for (const field in this.filters) {
          if (this.filters.hasOwnProperty(field)) {
              const filter = this.filters[field];
              const filterValue = filter.value;
              const filterCondition = filter.condition;

              if (filterValue !== undefined && filterValue !== null && filterValue.trim() !== '') {
                  this.filteredData = this.filteredData.filter(row =>
                      this.applyFilter(row, field, filterValue, filterCondition)
                  );
              }
          }
      }

   
      this.filterEvent.emit(this.filteredData)
  }

  applyFilter(row: any, field: string, filterValue: any, condition: string): boolean {
      const resolvedValue = this.resolveNestedField(row, field);
      if (typeof resolvedValue === 'object' && resolvedValue !== null) {
          for (const key in resolvedValue) {
              if (resolvedValue.hasOwnProperty(key)) {
                  const nestedValue = resolvedValue[key];
                  if (this.applyFilter({ [key]: nestedValue }, key, filterValue, condition)) {
                      return true; 
                  }
              }
          }
          return false; // If no nested property matches the filter, return false
      } else {
          // If the resolved value is not an object, apply the filter directly
          if (resolvedValue !== undefined && resolvedValue !== null) {
              const formattedValue = resolvedValue.toString().toLowerCase();
              const formattedFilterValue = filterValue.toString().toLowerCase();

              switch (condition) {
                  case 'startsWith':
                      return formattedValue.startsWith(formattedFilterValue);
                  case 'endsWith':
                      return formattedValue.endsWith(formattedFilterValue);
                  case 'equals':
                      return formattedValue === formattedFilterValue;
                  case 'notEquals':
                      return formattedValue !== formattedFilterValue;
                  case 'notContains':
                      return !formattedValue.includes(formattedFilterValue);
                  default: // 'contains' condition by default
                      return formattedValue.includes(formattedFilterValue);
              }
          }
          return false;
      }
  }

  getStatusName(status: string): string {
    switch (status) {
      case 'initiator': return 'Initiator';
      case 'apso recommender': return 'APSO Recommender';
      case 'wesee recommender': return 'Wesee Recommender';
      case 'dwe recommender': return 'DWE Recommender';
      case 'dee recommender': return 'Dee Recommender';
      case 'approver': return 'Approver';
      case 'acom recommender': return 'ACom Recommender';
      case 'recommender': return 'Recommender';
      default: return status;
    }
  }

  getStatusStyle(status: string): any {
    switch (status) {
      case 'initiator': return { 'background-color': '#E0F7FA', 'color': '#00796B' }; // Initiator
      case 'apso recommender': return { 'background-color': '#FFF3E0', 'color': '#EF6C00' }; // APSO Recommender
      case 'wesee recommender': return { 'background-color': '#E1F5FE', 'color': '#0288D1' }; // Wesee Recommender
      case 'dwe recommender': return { 'background-color': '#F9FBE7', 'color': '#827717' }; // DWE Recommender
      case 'dee recommender': return { 'background-color': '#F8BBD0', 'color': '#C2185B' }; // Dee Recommender
      case 'approver': return { 'background-color': '#E8F5E9', 'color': '#388E3C' }; // Approver
      case 'acom recommender': return { 'background-color': '#FFFDE7', 'color': '#FBC02D' }; // ACom Recommender
      case 'recommender': return { 'background-color': '#F3E5F5', 'color': '#8E24AA' }; // Recommender
      default: return { 'background-color': '#F8BBD0', 'text-align': 'center', 'width': 'fit-content', 'margin': 'auto', 'color': '#D81B60' }; // Unknown
    }
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'initiator': return 'initiator';
      case 'apso recommender': return 'apso-recommender';
      case 'wesee recommender': return 'wesee-recommender';
      case 'dwe recommender': return 'dwe-recommender';
      case 'dee recommender': return 'dee-recommender';
      case 'approver': return 'approver';
      case 'acom recommender': return 'acom-recommender';
      case 'recommender': return 'recommender';
      default: return 'unknown-status';
    }
  }
  clear(table: Table) {
    table.clear();
    table.filterGlobal('', 'contains');
    this.searchValue = ''
}
getSeverityClass(status: string): string {
    switch (status) {
        case 'open':
            return 'info';
        case 'in_progress':
            return 'warning';
        case 'resolved':
            return 'success';
        case 'closed':
            return 'danger';
        case 'reopened':
            return 'primary';
        default:
            return 'neutral';
    }
}
getPriorityData(priority: number): { label: string; class: string } {
    switch (priority) {
        case 1:
            return { label: 'Low', class: 'low-priority' };
        case 2:
            return { label: 'Medium', class: 'medium-priority' };
        case 3:
            return { label: 'High', class: 'high-priority' };
        default:
            return { label: 'Unknown', class: 'unknown-priority' };
    }
}

statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'reopened', label: 'Reopened' },
    { value: 'duplicate', label: 'Duplicate' }
];
getStatusName2(status: string): { label: string; class: string } {
    switch (status) {
        case 'open':
            return { label: 'Open', class: 'status-open' };
        case 'in_progress':
            return { label: 'In Progress', class: 'status-in-progress' };
        case 'resolved':
            return { label: 'Resolved', class: 'status-resolved' };
        case 'closed':
            return { label: 'Closed', class: 'status-closed' };
        case 'reopened':
            return { label: 'Reopened', class: 'status-reopened' };
        default:
            return { label: 'Unknown', class: 'status-neutral' };
    }
}
old_status:any;
onStatusChange(rowData: any) {
    const apiUrl =environment.API_URL+ 'ticket/api/ticket-status-changes/';
    let payload = {
        ticket: rowData.id,
        changed_by: 1,  // Update with actual user ID dynamically
        old_status: this.old_status,
        new_status: rowData.status,
    };
    this.api.postAPI(apiUrl, payload).subscribe(
        response => {
            this.statusEventAdd.emit({status:'Status updated successfully:' ,code:1})
        },
        error => {
            this.statusEventAdd.emit({status:'Error updating status:',code:2})
        }
    );
}
userOptions:any[]=[];
onAssignedToChange(rowData: any) {
    const apiUrl = environment.API_URL + 'ticket/assign-change/';
    let payload = {
        ticket: rowData.id,
        changed_by: 1,  // Update with actual user ID dynamically
        changed_to: rowData.assigned_to.id,  // Ensure this ID exists in the database
    };
    const updatedRowData = { ...rowData, assigned_to: rowData.assigned_to };
    this.api.postAPI(apiUrl, payload).subscribe(
        response => {
            this.assignedEventAdd.emit({status:'Assigned To updated successfully:', code:1})
        },
        error => {
            this.assignedEventAdd.emit({status:'Error updating Assigned To:', code:2})
        }
    );
}
getUser(rowData){
    this.api.getAPI(environment.API_URL+ 'api/auth/users?process_id=3').subscribe(
        (response: any) => {
          this.userOptions =response.data
          this.usersFetched.emit(this.userOptions);
          const userOptions = response.data.map(user => ({
                          label: user.loginname,
                          value: user.id
                        }));
    })
    this.selectedRow = this.selectedRow === rowData ? null : rowData;


}

}