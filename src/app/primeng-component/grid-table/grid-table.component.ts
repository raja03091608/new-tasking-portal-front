
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

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrl: './grid-table.component.scss'
})
export class GridTableComponent implements OnInit {
    @Input() isPermanentDelete: boolean = false;
    @Input() isRestore: boolean = false;
  @Input() gridColumns: any[];
  @Input() gridData: any[];
  @Input() isEditable: boolean;
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
  @Output() completedEvent = new EventEmitter<any>();
  @Output() restoreEvent = new EventEmitter<any>();
  @Output() permanentDeleteEvent = new EventEmitter<any>();
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  newRowData: any = {}; // Object to store data for a new row
  currentPage: number = 1;
  rowsPerPage: number = 10;
  filteredData: any[];  // New property to store filtered data
  // filters:  { [field: string]: { value?: any } } = {};
  filters: { [field: string]: { value?: any; condition?: string } } = {};


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
              // Break the loop if value becomes null or undefined
              break;
          }
      }

      // Check if the resolved value is a date and format it
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
    this.isRestore = true;
    
      this.filteredData = this.gridData;
      console.log(this.gridData);
      console.log(this.gridColumns);
  }

  constructor(private filterService: FilterService) { }


  getFilterValue(field: string): any {
      return this.filters[field]?.value;
  }



  onCustomClear(field: string) {
      // Find the column in the gridColumns array
      const column = this.gridColumns.find(col => col.field === field);
      if (column) {
          // Reset the filter value for the column
          column.filterValue = null;
          // Apply filtering logic here
          this.applyFilters();
      }
  }


 

  onFilterChange(filterValue: string, field: string, condition: string) {
      if (filterValue && filterValue.trim()) {
          // Update the specific filter for the given field
          this.filters[field] = { value: filterValue.trim(), condition: condition };

          // Apply filtering logic here
          this.applyFilters();
      } else {
          // Clear the filter for the field
          delete this.filters[field];

          // Apply filtering logic here
          this.applyFilters();
      }
  }

  applyFilters() {
      // Copy original data
      this.filteredData = [...this.gridData];

      // Apply filtering logic for each field
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

      // Check if the resolved value is an object (indicating nested data)
      if (typeof resolvedValue === 'object' && resolvedValue !== null) {
          // If the resolved value is an object, recursively apply the filter to its properties
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
    
  
  deleteTask(item: any) {
    this.deleteEvent.emit(item);
  }

  restoreTask(item: any) {
    this.restoreEvent.emit(item);
  }
  onRestore(rowData: any): void {
    // Handle the restore action here
    console.log('Restoring:', rowData);
  }
}

