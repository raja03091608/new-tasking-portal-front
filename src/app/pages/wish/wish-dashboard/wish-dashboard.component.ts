import { Component, OnInit} from "@angular/core";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { HttpHeaders } from "@angular/common/http";
@Component({
  selector: 'app-wish-dashboard',
  templateUrl: './wish-dashboard.component.html',
  styleUrls: ['./wish-dashboard.component.scss']
})
export class WishDashboardComponent implements OnInit {
  taskingGroups: any[] = [];
  usersList: any[] = [];
  listDelapso: number;
  token_detail: any = {};
  crudName: string;
  isEditMode: boolean = false; 
  tickets: any[] = [];
  ticket_id:any;
  userOptions: any[] = [];
  displayPopup: boolean = false;
  closed: number = 0;
  resolved:number=0;
  reopened:number=0;
  open:number=0;
    detailsForm: FormGroup;
    file: File | null = null;
    selectedCardName: string = 'open';
    editorVisible = false; // Control visibility of the editor modal
    htmlContent = ''; // The content to bind with Angular Editor
    ticketId:any; 
    ticketData: any;
    showGrid: boolean;
    commentPopup: boolean = false;  // To control popup visibility
    comments = []; 
    editorContent = new FormControl();
    currentTicketId: string;
    

    editorConfig: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      minHeight: '15rem',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      defaultFontSize: '3',
      fonts: [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' },
        { class: 'comic-sans-ms', name: 'Comic Sans MS' }
      ],
      customClasses: [
        {
          name: "quote",
          class: "quote",
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: "titleText",
          class: "titleText",
          tag: "h1",
        },
      ],
      uploadWithCredentials: false,
      sanitize: true,
      toolbarPosition: 'top',
      toolbarHiddenButtons: [
        ['subscript', 'superscript'],
        ['fontSize', 'toggleEditorMode', 'customClasses']
      ],
      outline: true
    };
    
  gridColumns = [
    { field: 'id', header: 'Ticket No.', filter: true, filterMatchMode: 'contains' },
    { field: 'title', header: 'Title', filter: true, filterMatchMode: 'contains' },
    { field: 'priority', header: 'Priority', filter: true, filterMatchMode: 'contains' },
    { field: 'status', header: 'Status', filter: true, filterMatchMode: 'contains' },
    { field: 'assigned_to.first_name', header: 'Assigned To', filter: true, filterMatchMode: 'contains' },
    { field: 'description', header: ' Description', filter: true, filterMatchMode: 'contains' },
  ]
  constructor(private api: ApiService, private fb: FormBuilder,private toastr: ToastrService) {
    this.editorContent.setValue('<p><strong></strong></p>');
    this.api.getAPI(`${environment.API_URL}master/taskinggroups`).subscribe(
      (res) => {
        this.taskingGroups = res.data;
      },
      (error) => {
        console.error('API कॉल में त्रुटि:', error);
      }
    );
    
  }
priorityOptions = [
  { id: 1, value: 'high', label: 'High' },
  { id: 2, value: 'medium', label: 'Medium' },
  { id: 3, value: 'low', label: 'Low' },
];
  ngOnInit(): void {
    this.handleCardClick('open', 'Open Tickets');
   this. getTicketCounts();
   this.initializeForm();
    this.getTaskingGroups();

    this.detailsForm = this.fb.group({
      title: ['', Validators.required], 
      description: ['', Validators.required], 
      submitter_email: [null], 
      assigned_to: [null], 
      on_hold: [null], 
      priority: [''], 
      due_date: [null], 
      status:['']
    });
    
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
addTicket() {
  this.displayPopup = true;
}
Delete(event: any, ticketId: string) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  const options = { headers: headers };
  this.api.deleteAPI(`${environment.API_URL}/ticket/api/tickets/${event.id}/`).subscribe({
    next: (response) => {
      this.toastr.success('Ticket deleted successfully');
      this.handleCardClick('open', 'Open Tickets');
    },
  });
}
submitForm() {
  this.isEditMode = false; // Ensure edit mode is off
  this.currentTicketId = ''; //
  this.detailsForm.get('status')?.enable();
  if (!this.detailsForm.valid) {
    Object.keys(this.detailsForm.controls).forEach(key => {
      const controlErrors = this.detailsForm.get(key)?.errors;
      if (controlErrors) {
        console.error(`Key: ${key}, Errors: `, controlErrors);
      }
    });
    this.toastr.error('Please fill all required fields', 'Error');
    return;
  }
  this.detailsForm.get('status')?.disable(); // Disable status field in add mode

  const formData = new FormData();
  if (this.file) formData.append('attachment', this.file);
  formData.append('title', this.detailsForm.get('title')?.value || '');
  formData.append('description', this.detailsForm.get('description')?.value || '');
  // formData.append('submitter_email', this.detailsForm.get('submitter_email')?.value || null);
  formData.append('status', this.detailsForm.get('status')?.value || '');
  formData.append('assigned_to', this.detailsForm.get('assigned_to')?.value || null);
  formData.append('on_hold', this.detailsForm.get('on_hold')?.value ? '1' : '0');
  formData.append('priority', this.detailsForm.get('priority')?.value || '');
  formData.append('due_date', this.detailsForm.get('due_date')?.value || '');

  if (this.currentTicketId) {
    this.api.putAPI(`${environment.API_URL}ticket/api/tickets/${this.currentTicketId}/`, formData).subscribe(
      res => {
        this.toastr.success('Ticket updated successfully', 'Success');
        this.displayPopup = false;
        this.handleCardClick('open', 'Open Tickets');
        this.detailsForm.reset();
      },
      error => {
        this.toastr.error('Failed to update ticket', 'Error');
      }
    );
  } else {
    this.api.postAPI(`${environment.API_URL}ticket/api/tickets/`, formData).subscribe(
      res => {
        this.toastr.success('Ticket created successfully', 'Success');
        this.displayPopup = false;
        this.handleCardClick('open', 'Open Tickets');
        this.detailsForm.reset();

      },
      error => {
        this.toastr.error('Failed to create ticket', 'Error');
      }
    );
  }
}
// card counts api
  getTicketCounts(): void {
    this.api.getAPI(environment.API_URL +'ticket/dashboard')  // Replace with your actual API URL
      .subscribe(
        (response) => {
          this.open = response.open_tickets || 0;
          this.reopened = response.reopen_tickets || 0;
          this.resolved = response.resolved_tickets || 0;
          this.closed = response.closed_tickets || 0;
        },
      );
  }
handleCardClick(status: string, cardName: string): void {
  this.selectedCardName = cardName;
  this.showGrid = false; // Hide the table first
  const url = `${environment.API_URL}ticket/api/tickets/?status=${status}`;
  this.api.getAPI(url).subscribe({
    next: (response) => {

      this.ticketData = response;
      this.showGrid = true; // Show the grid after data is loaded
    },
   
  });
}
statusUpadetd(str){
  if(str.code === 1){
    this.toastr.success(str.status, 'Success');
    this.ticketData=[]
  }
  else
  this.toastr.error(str.status, 'Error');

}
statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'reopened', label: 'Reopened' },
  { value: 'duplicate', label: 'Duplicate' }
];
  cancel() {
  }
  assignUpadetd(str:any) {
    if (str.code === 1) {
      this.toastr.success(str.status, 'Success');
      this.ticketData = [];
    } else {
      this.toastr.error(str.status, 'Error');
    }
  }
  isView: boolean = false;
  onUsersFetched(userOptions: any[]): void {
    this.userOptions = userOptions;  // Assign the fetched users to the dropdown options
}
onEdit(event: any, ticketId: string){
  this.isEditMode = true;
  this.currentTicketId=ticketId
  this.detailsForm.patchValue({
        title: event.title,
    description: event.description,
    assigned_to: event.assigned_to,
    status: event.status,
    priority: event.priority,
    due_date: event.due_date,
    submitter_email: event.submitter_email,
    on_hold: event.on_hold,
      });
   this.displayPopup = true;
   this.handleCardClick('open', 'Open Tickets');

}
onCommentPopup(event: any) {
  this.ticket_id = event.id;
    this.commentPopup = true;
    this.api.getAPI(`${environment.API_URL}ticket/comments/`)
    .subscribe(
      (response) => {
        this.comments = response;
      },
    );
    this.editorVisible = true;
  }
  addComment() {
    const commentText = this.editorContent.value.trim();
    if (!commentText) return; // Prevent empty comments
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
    const payload = {
      ticket: this.ticket_id,
      user: Number(userId),
      comment_text: commentText,
    };
    this.api.postAPI(`${environment.API_URL}ticket/comments/`, payload).subscribe({
      next: () => {
        this.toastr.success('Comment added successfully!', 'Success');
        this.editorContent.reset(); // Clear input field
        this.refreshComments(); // Refresh comments after adding
      },
      error: () => {
        this.toastr.error('Failed to add comment. Please try again.', 'Error');
      }
    });
  }
  
  

  refreshComments() {
    this.api.getAPI(`${environment.API_URL}ticket/comments/`).subscribe({
      next: (response) => {
        this.comments = response;
      },
      error: () => {
        this.toastr.error('Failed to load comments', 'Error');
      }
    });
  }
  initializeForm(): void {
    this.detailsForm = this.fb.group({
      tasking_group: ['', Validators.required],
      assigned_to: [null]
    });
  }

  getTaskingGroups(): void {
    this.api.getAPI(`${environment.API_URL}master/taskinggroups`).subscribe(
      (res) => {
        this.taskingGroups = res.data;
      },
      (error) => {
        console.error('Error fetching tasking groups:', error);
      }
    );
  }

  onTaskingGroupChange(event: any): void {
    const selectedTaskingGroupId = event.value;
    if (selectedTaskingGroupId) {
      this.getTaskingUser(selectedTaskingGroupId);
    } else {
      this.usersList = []; // Clear the users list if no tasking group is selected
    }
  }
  getTaskingUser(taskingGroupId: string): void {
    this.api.getAPI(`${environment.API_URL}api/auth/users?tasking_id=${taskingGroupId}`).subscribe(
      (res) => {
        this.usersList = res;
        console.log('Fetched users:', this.usersList);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  
  disableWesee(): boolean {
    return false;
  }
  
}  