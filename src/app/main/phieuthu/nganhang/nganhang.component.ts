import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-nganhang',
  templateUrl: './nganhang.component.html',
  styleUrls: ['./nganhang.component.css'],
})
export class NganhangComponent extends BaseComponent implements OnInit {
  public nganhangs: any;
  public nganhang: any;
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
      'Ten': ['']
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/nganhang/searchadmin',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.nganhangs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/nganhang/searchadmin',{page: this.page, pageSize: this.pageSize, Ten: this.formsearch.get('Ten').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.nganhangs = res.data;
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
      debugger
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let tmp = {
           MaNganHang:value.MaNganHang,
           Ten:value.Ten,
           DiaChi:value.DiaChi,
           MatKhau:value.MatKhau,
           KichHoat:+value.KichHoat,
           GhiChu:value.GhiChu,
           NgayTao:value.NgayTao,
           NguoiTao:value.NguoiTao      
          };
        this._api.post('/api/nganhang/create-nganhang',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      debugger
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let tmp = {
           Ten:value.Ten,
           DiaChi:value.DiaChi,
           MatKhau:value.MatKhau,
           KichHoat:+value.KichHoat,
           GhiChu:value.GhiChu,
           NgayTao:value.NgayTao,
           NguoiTao:value.NguoiTao,
           MaNganHang:this.nganhang.maNganHang,          
          };
        this._api.post('/api/nganhang/update-nganhang',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/nganhang/delete-nganhang',{MaNganHang:row.maNganHang}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.nganhang = null;
    this.formdata = this.fb.group({
      'MaNganHang': [''],
      'Ten': [''],
      'DiaChi': [''],
      'MatKhau': [''],
      'KichHoat': [''],
      'GhiChu': [''],
      'NgayTao': [this.today],
      'NguoiTao': [''],
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.nganhang = null;
    setTimeout(() => {
      $('#createNganHangModal').modal('toggle');
      this.formdata = this.fb.group({
        'MaNganHang': [''],
        'Ten': [''],
        'DiaChi': [''],
        'MatKhau': [''],
        'KichHoat': [''],
        'GhiChu': [''],
        'NgayTao': [''],
        'NguoiTao': [''],
      });
      this.formdata.get('NgayTao').setValue(this.today);
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createNganHangModal').modal('toggle');
      this._api.get('/api/nganhang/get-by-id/'+ row.maNganHang).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.nganhang = res; 
        let NgayTao = new Date(this.nganhang.ngayTao);
          this.formdata = this.fb.group({
            'Ten': [this.nganhang.ten],
            'DiaChi': [this.nganhang.diaChi],
            'MatKhau': [this.nganhang.matKhau],
            'KichHoat': [this.nganhang.kichHoat],
            'GhiChu': [this.nganhang.ghiChu],
            'NgayTao': [NgayTao],
            'NguoiTao': [this.nganhang.nguoiTao]
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createNganHangModal').closest('.modal').modal('hide');
  }
}
