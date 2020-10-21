import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css'],
})
export class TypeComponent extends BaseComponent implements OnInit {
  public types: any;
  public type: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'item_group_name': ['']
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/itemgroupAdmin/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.types = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/itemgroupAdmin/search',{page: this.page, pageSize: this.pageSize, item_group_name: this.formsearch.get('item_group_name').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.types = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let tmp = {
          parent_item_group_id:value.parent_item_group_id,
          item_group_name:value.item_group_name,
          seq_num:+value.seq_num,
          url:value.url,  
          };
        this._api.post('/api/itemgroupAdmin/create-itemgroup',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let tmp = {
          //parent_item_group_id:value.parent_item_group_id,
          item_group_name:value.item_group_name,
          //seq_num:value.seq_num,
         // url:value.url, 
          item_group_id:this.type.item_group_id,          
          };
        this._api.post('/api/itemgroupAdmin/update-itemgroup',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/itemgroupAdmin/delete-itemgroup',{item_group_id:row.item_group_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.type = null;
    this.formdata = this.fb.group({
      'parent_item_group_id': [''],
      'item_group_name': ['', Validators.required],
      'seq_num': [''],
      'url': [''],
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.type = null;
    setTimeout(() => {
      $('#createTypeModal').modal('toggle');
      this.formdata = this.fb.group({
        'parent_item_group_id': [''],
        'item_group_name': ['', Validators.required],
        'seq_num': [''],
        'url': [''],
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createTypeModal').modal('toggle');
      this._api.get('/api/itemgroupAdmin/get-by-id/'+ row.item_group_id).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.type = res; 
          this.formdata = this.fb.group({
            //'parent_item_group_id': [this.type.parent_item_group_id],
            'item_group_name': [this.type.item_group_name, Validators.required],
            //'seq_num': [this.type.seq_num],
            //'url':[this.type.url],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createTypeModal').closest('.modal').modal('hide');
  }
}
