
import { NgIf } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { FilterService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { ApiService } from '../../service/api.service';
interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrl: './grid-table.component.scss'
})
export class GridTableComponent implements OnInit {
    first: number = 0;
    rows: number = 10;
    @Input() isupload:boolean;
    @Input() isPermanentDelete: boolean;
    @Input() isRestore: boolean;
  @Input() gridColumns: any[];
  @Input() gridData: any[];
  @Input() isEditable: boolean;
  @Input() isStatusAdd: boolean;
  @Input() isArchiveTask: boolean;
  @Input() isAction: boolean;
  @Input() isFormEditable: boolean;
  @Input() isDeletable: boolean;
  @Input() ispaniNater: boolean;
  @Input() isView: boolean;
  @Input() isCheckBox: boolean;
  @Input() isStatus: boolean;
  @Input() isCompleted: boolean;
  @Input() isExport: boolean;
  @Input() isDownload: boolean;
  @Output() filterEvent = new EventEmitter<any>();
  @Output() paginationEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() viewEvent = new EventEmitter<any>();
  @Output() exportEvent = new EventEmitter<any>();
  @Output() downloadEvent = new EventEmitter<any>();
  @Output() statusEvent = new EventEmitter<any>();
  @Output() statusEventAdd = new EventEmitter<any>();
  @Output() completedEvent = new EventEmitter<any>();
  @Output() restoreEvent = new EventEmitter<any>();
  @Output() permanentDeleteEvent = new EventEmitter<any>();
  @Output() uploadEvent = new EventEmitter<any>();
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @Output() archivetaskEvent = new EventEmitter<any>();
  token_detail:any
  @Input() totalRecords:number;
  newRowData: any = {}; 
 
  filteredData: any[];  
  // filters:  { [field: string]: { value?: any } } = {};
  filters: { [field: string]: { value?: any; condition?: string } } = {};
    searchValue: string;
  


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

  clear(dataTable: any) {
    dataTable.clear(); // Clears all filters applied to the table
    this.filteredData = [...this.gridData]; // Replace filtered data with the original dataset
    this.searchValue = ''; // Clear the search box value
}



  createEmptyRowData(): any {
      const emptyRowData: any = {};
      // Iterate through the columns to set initial values for each field
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
              // Check if the key contains square brackets indicating an array index
              const isArrayIndex = key.includes('[') && key.includes(']');
              if (isArrayIndex) {
                  const parts = key.split('[');
                  const arrayKey = parts[0];
                  const arrayIndex = parseInt(parts[1].split(']')[0], 10);
                  if (Array.isArray(originalData[arrayKey])) {
                      if (arrayIndex >= 0 && arrayIndex < originalData[arrayKey].length) {
                          // Recursively apply changes for nested properties within arrays
                          this.applyChanges(originalData[arrayKey][arrayIndex], { [parts[1].split(']')[1].slice(1)]: value });
                      }
                  }
              } else if (key in originalData) {
                  // If the key exists in the original data object, update its value
                  originalData[key] = value;
              } else {
                  // Handle nested properties dynamically
                  let nestedKeys = key.split('.');
                  let nestedObject = originalData;
                  for (let nestedKey of nestedKeys) {
                      if (nestedKey in nestedObject) {
                          nestedObject = nestedObject[nestedKey];
                      } else {
                          // If the nested key does not exist, break the loop
                          break;
                      }
                  }
                  // Update the value of the deepest nested property
                  nestedObject[nestedKeys.pop()] = value;
              }
          }
      }
  }


  

 

  
 

  ngOnInit(): void {
  this.token_detail = this.api.decryptData(localStorage.getItem('token-detail'));
      this.filteredData = this.gridData;
  }

  constructor(private filterService: FilterService, private api:ApiService) { }
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
          this.filters[field] = { value: filterValue.trim(), condition: condition };

          this.applyFilters();
      } else {
          delete this.filters[field];

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
                      return true; // Return true if any nested property matches the filter
                  }
              }
          }
          return false; // If no nested property matches the filter, return false
      } else {
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
    
  
  deleteTask(item: any) {
    this.deleteEvent.emit(item);
  }

  restoreTask(item: any) {
    this.restoreEvent.emit(item);
  }
  onRestore(rowData: any): void {
    // Handle the restore action here
    // console.log'Restoring:', rowData);
  }
  uploadData(rowData:any):boolean {
    if(!rowData?.legacy_attachment && rowData?.legacy_data =='Yes' && this.token_detail.process_id==1 )
        return true


    return false
  }
  downloadData(rowData:any):boolean {
    if(rowData?.legacy_attachment && rowData?.legacy_data =='Yes')
        { return true} return false
    

  }
  formatApprovedDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


getButtonClass(status: number): string {
    const statusClasses = {
        7: 'bg-info-subtle text-primary', // Commented
        8: 'bg-warning-subtle text-warning', // Pending
        9: 'bg-warning-light text-warning-dark', // Uploaded
        10: 'bg-orange-subtle text-orange', // Returned
        11: 'bg-danger-subtle text-danger', // Redrafted
        12: 'bg-purple-subtle text-purple', // Reuploaded
        13: 'bg-indigo-subtle text-indigo', // Draft
        14: 'bg-teal-subtle text-teal', // Initiated
        15: 'bg-blue-subtle text-blue', // Concurrence
        16: 'bg-yellow-subtle text-yellow' // Initiation Started
    };

    return statusClasses[status] || 'bg-light text-dark'; // Default class
}
onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.paginationEvent.emit(event);
    console.log(event)
}
}

