import { Component, OnInit} from "@angular/core";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";



@Component({
  selector: 'app-wish-dashboard',
  templateUrl: './wish-dashboard.component.html',
  styleUrls: ['./wish-dashboard.component.scss']
})
export class WishDashboardComponent implements OnInit {

  duplicate:number=0;
  closed: number = 0;
  resolved:number=0;
  reopened:number=0;
  open:number=0;
  createdTicket: any[] = [];
    closeTicket: any[] = [];
    detailsForm: FormGroup;
    selectedFilterIndex: number = 0; 
    file: File | null = null;
    selectedCardName: string = 'Open Ticket';


    
  gridColumns = [
    { field: 'id', header: 'Ticket No.', filter: true, filterMatchMode: 'contains' },
    { field: 'title', header: 'Title', filter: true, filterMatchMode: 'contains' },
    { field: 'priority', header: 'Priority', filter: true, filterMatchMode: 'contains' },
    { field: 'status', header: 'Status', filter: true, filterMatchMode: 'contains' },
    { field: 'assigned_to.first_name', header: 'Assigned To', filter: true, filterMatchMode: 'contains' },
    { field: 'submitter_email', header: 'Submitter', filter: true, filterMatchMode: 'contains' },
    { field: 'resolution', header: 'Resolution', filter: true, filterMatchMode: 'contains' },
    { field: 'view', header: 'View', filter: true, filterMatchMode: 'contains' },
    { field: 'description', header: ' Description', filter: true, filterMatchMode: 'contains' },
  ]

  displayPopup: boolean = false;
  
  ticketData: any;
  showGrid: boolean;
  currentRowData: any;
  commentPopup: boolean = false;  // To control popup visibility
  comments = []; // Your comment data
  new: string = ''; // New com

  constructor(private api: ApiService, private fb: FormBuilder,private toastr: ToastrService) {

    
  }

  
  ngOnInit(): void {
    this.loadTickets();
    this. getTicketCounts();
    this.detailsForm = this.fb.group({
      title: ['', Validators.required], 
      description: ['', Validators.required], 
      submitter_email: ['', [Validators.required, Validators.email]], // Ensuring email format
      assigned_to: ['', Validators.required], 
      on_hold: [null], 
      priority: [null, Validators.required], 
      due_date: [null], 
      merged_to: [''], 
      followup_set: ['']
    });
    
  }

 
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }






addTicket() {
  
  console.log('addTicket()');
  this.displayPopup = true;
}

ticketId:any; 

onDelete(event: any, ticketId: string) {
  console.log('Delete event:', event);
  console.log('Ticket ID:', ticketId);
  
  this.api.deleteAPI(`${environment.API_URL}/ticket/api/tickets/${ticketId}/`, event).subscribe({
    next: (response) => {
      console.log('Response:', response);
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}




onView($event){

}



submitForm() {
  this.detailsForm.get('status')?.enable();

  console.log("Form Validation Status:", this.detailsForm.valid);
  console.log("Form Values:", this.detailsForm.value);

  if (!this.detailsForm.valid) {
    console.error("Form is invalid:");
    Object.keys(this.detailsForm.controls).forEach(key => {
      const controlErrors = this.detailsForm.get(key)?.errors;
      if (controlErrors) {
        console.error(`Key: ${key}, Errors: `, controlErrors);
      }
    });
    this.toastr.error('Please fill all required fields', 'Error');
    return;
  }

  const formData = new FormData();
  if (this.file) formData.append('attachment', this.file);

  // Append each form field value to FormData
  formData.append('title', this.detailsForm.get('title')?.value || '');
  formData.append('description', this.detailsForm.get('description')?.value || '');
  formData.append('submitter_email', this.detailsForm.get('submitter_email')?.value || '');
  formData.append('assigned_to', this.detailsForm.get('assigned_to')?.value || '');
  // formData.append('status', this.detailsForm.get('status')?.value || '');
  formData.append('on_hold', this.detailsForm.get('on_hold')?.value ? '1' : '0');
  formData.append('priority', this.detailsForm.get('priority')?.value || '');
  formData.append('due_date', this.detailsForm.get('due_date')?.value || null);
  formData.append('merged_to', this.detailsForm.get('merged_to')?.value || '');
  // formData.append('attachment',this.file || null);
  formData.append('followup_set', this.detailsForm.get('followup_set')?.value || '');

  this.api.postAPI(environment.API_URL + `ticket/api/tickets/`, formData).subscribe(
        res => {
          this.toastr.success('Form submitted successfully', 'Success');
          this.displayPopup = false;
        },
        error => {
          this.toastr.error('Failed to submit Ticket', 'Error');
        }
      );
 
}





// card counts api
  getTicketCounts(): void {
    this.api.getAPI(environment.API_URL +'ticket/dashboard')  // Replace with your actual API URL
      .subscribe(
        (response) => {
          console.log('API response:', response);  // Log the response to the console
          
          // Directly accessing the properties from the response object
          this.open = response.open_tickets || 0;
          this.reopened = response.reopen_tickets || 0;
          this.resolved = response.resolved_tickets || 0;
          this.closed = response.closed_tickets || 0;
          this.duplicate = response.duplicate || 0;
  
          // Optional: Log total_tickets if needed
          console.log('Total tickets:', response.total_tickets);
        },
        (error) => {
          console.error('API error:', error);  // Log the error if the API request fails
        }
      );
  }

  
 
  handleCardClick(cardName: string): void {
    this.selectedCardName = cardName; 
    this.showGrid = false; // Hide the table first
    this.loadTickets(); // Load the tickets again
  }

  loadTickets(): void {
    
    const url = environment.API_URL + 'ticket/api/tickets/?status=open';
    console.log('Fetching tickets from URL:', url);

    this.api.getAPI(url).subscribe({
      next: (response) => {
        console.log('Full API response:', response);
        this.ticketData = response; // Store API response in table data
        this.showGrid = true;  // Show the table again
        console.log('Ticket data loaded:', this.ticketData);
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
      }
    });
  }
  
  handleCardClick2() {
    this.selectedCardName = 'Reopen Tickets';
    this.showGrid = false; // Pehle table ko hide kar do

    const url = environment.API_URL + 'ticket/api/tickets/?status=reopened';
    console.log('Fetching tickets from URL:', url);
  
    this.api.getAPI(url).subscribe({
      next: (response) => {
        console.log('Full API response:', response);
  
        // Assuming the response itself is the data array
        this.ticketData = response;
        this.showGrid = true;  // Show the grid after data is loaded
        console.log('Ticket data loaded:', this.ticketData);
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
        console.error('Error details:', error.message);
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          console.error('Client-side error:', error.error.message);
        } else {
          // Server-side error
          console.error(`Server-side error: ${error.status} ${error.statusText}`);
          console.error('Error response body:', error.error);
        }
      }
    });
  }

  handleCardClick3() {
    this.selectedCardName = 'Reolved Tickets';

    this.showGrid = false; // Pehle table ko hide kar do

    const url = environment.API_URL + 'ticket/api/tickets/?status=resolved';
    console.log('Fetching tickets from URL:', url);
  
    this.api.getAPI(url).subscribe({
      next: (response) => {
        console.log('Full API response:', response);
  
        // Assuming the response itself is the data array
        this.ticketData = response;
        this.showGrid = true;  // Show the grid after data is loaded
        console.log('Ticket data loaded:', this.ticketData);
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
        console.error('Error details:', error.message);
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          console.error('Client-side error:', error.error.message);
        } else {
          // Server-side error
          console.error(`Server-side error: ${error.status} ${error.statusText}`);
          console.error('Error response body:', error.error);
        }
      }
    });
  }
  
  handleCardClick4() {
    this.selectedCardName = 'Closed Tickets';

    this.showGrid = false; // Pehle table ko hide kar do

    const url = environment.API_URL + 'ticket/api/tickets/?status=closed';
    console.log('Fetching tickets from URL:', url);
  
    this.api.getAPI(url).subscribe({
      next: (response) => {
        console.log('Full API response:', response);
  
        // Assuming the response itself is the data array
        this.ticketData = response;
        this.showGrid = true;  // Show the grid after data is loaded
        console.log('Ticket data loaded:', this.ticketData);
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
        console.error('Error details:', error.message);
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          console.error('Client-side error:', error.error.message);
        } else {
          // Server-side error
          console.error(`Server-side error: ${error.status} ${error.statusText}`);
          console.error('Error response body:', error.error);
        }
      }
    });
  }
  
  
 

  
 

  onEdit(event: any, ticketId: string) {
    console.log("Ticket ID:", ticketId);  
    this.detailsForm.get('status')?.enable();
  
    console.log("Form Validation Status:", this.detailsForm.valid);
    console.log("Form Values:", this.detailsForm.value);
  
    let formData = new FormData();
  
    formData.append('title', this.detailsForm.get('title')?.value || null);
    formData.append('description', this.detailsForm.get('description')?.value || null);
    // formData.append('submitter_email', this.detailsForm.get('submitter_email')?.value || '');
    formData.append('assigned_to', this.detailsForm.get('assigned_to')?.value || '');
    formData.append('status', this.detailsForm.get('status')?.value || '');
    formData.append('priority', this.detailsForm.get('priority')?.value || '');
    formData.append('due_date', this.detailsForm.get('due_date')?.value || null);
  
    this.api.putAPI(`${environment.API_URL}ticket/api/tickets/${ticketId}/`, formData).subscribe(
      res => {
        this.displayPopup = false;
      },
      error => {
        this.toastr.error('Failed to submit Ticket', 'Error');
      }
    );
  }
  


onCommentPopup() {
  this.commentPopup = true;
  this.api.getAPI(`${environment.API_URL}ticket/comments/`)
  .subscribe(
    (response) => {
      // Update comments array with the response data
      this.comments = response;
    },
    (error) => {
      console.error('Error fetching comments:', error);  // Log error if the API call fails
    }
  );
}




statusUpadetd(str){
  if(str.code === 1){
    this.toastr.success(str.status, 'Success');
    this.ticketData=[]
    this.loadTickets()
  }
  else
  this.toastr.error(str.status, 'Error');

}

}