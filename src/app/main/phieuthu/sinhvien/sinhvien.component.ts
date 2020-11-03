import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-sinhvien',
  templateUrl: './sinhvien.component.html',
  styleUrls: ['./sinhvien.component.css'],
})
export class SinhvienComponent extends BaseComponent implements OnInit {
  public sinhviens: any;
  public sinhvien: any;
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
      'HoVaTen': ['']
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/sinhvien/searchadmin',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.sinhviens = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 20;
    this._api.post('/api/sinhvien/searchadmin',{page: this.page, pageSize: this.pageSize, HoVaTen: this.formsearch.get('HoVaTen').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.sinhviens = res.data;
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
        let data_image = data == '' ? null : data;
        let tmp = {
          Anh:data_image,
          MaSV:value.MaSV ,
          HoVaTen:value.HoVaTen ,
          NgaySinh:value.NgaySinh,
          GioiTinh:+value.GioiTinh,
          DanToc:value.DanToc,
          SoDinhDanh:value.SoDinhDanh,
          NoiCap:value.NoiCap,
          NgayCap:value.NgayCap,
          DienThoai:value.DienThoai,
          Email:value.Email,
          MatKhau:value.MatKhau,
          Quyen:+value.Quyen,
          TrangThai:+value.TrangThai,
          NgayTao:value.NgayTao,
          NguoiTao:value.NguoiTao      
          };
        this._api.post('/api/sinhvien/create-sinhvien',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      debugger
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          HoVaTen:value.HoVaTen ,
          DienThoai:value.DienThoai,
          Email:value.Email,
          TrangThai:+value.TrangThai,
          NgayTao:value.NgayTao,
          NguoiTao:value.NguoiTao ,    
          MaSV:this.sinhvien.maSV,          
          };
        this._api.post('/api/sinhvien/update-sinhvien',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    debugger
    this._api.post('/api/sinhvien/delete-sinhvien',{MaLop:row.maSV}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.sinhvien = null;
    this.formdata = this.fb.group({
      'MaSV': [''],
      'HoVaTen': [''],
      'NgaySinh': [''],
      'GioiTinh': [this.genders1[0].value],
      'DanToc': [''],
      'SoDinhDanh': [''],
      'NoiCap': [''],
      'NgayCap': [''],
      'DienThoai': [''],
      'Email': [''],
      'MatKhau': [''],
      'Quyen': [this.roles1[0].value],
      'TrangThai': [''],
      'NgayTao': [this.today],
      'NguoiTao': [''],
    }); 
  }

  createModal() {
    debugger
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.sinhvien = null;
    setTimeout(() => {
      $('#createSinhVienModal').modal('toggle');
      this.formdata = this.fb.group({
        'MaSV': [''],
        'HoVaTen': [''],
        'NgaySinh': [''],
        'GioiTinh': [''],
        'DanToc': [''],
        'SoDinhDanh': [''],
        'NoiCap': [''],
        'NgayCap': [''],
        'DienThoai': [''],
        'Email': [''],
        'MatKhau': [''],
        'Quyen': [''],
        'TrangThai': [''],
        'NgayTao': [''],
        'NguoiTao': [''],
      });
      this.formdata.get('NgayTao').setValue(this.today);
      this.formdata.get('GioiTinh').setValue(this.genders1[0].value);
      this.formdata.get('Quyen').setValue(this.roles1[0].value);
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    debugger
    setTimeout(() => {
      $('#createSinhVienModal').modal('toggle');
      this._api.get('/api/sinhvien/get-by-id/'+ row.maSV).takeUntil(this.unsubscribe).subscribe((res:any) => {
        debugger
        this. sinhvien= res; 
        let NgayTao = new Date(this.sinhvien.ngayTao);
          this.formdata = this.fb.group({
            'HoVaTen': [this.sinhvien.hoVaTen ],
            'DienThoai': [this.sinhvien.dienThoai],
            'Email': [this.sinhvien.email],
            'TrangThai': [this.sinhvien.trangThai],
            'NgayTao': [NgayTao],
            'NguoiTao': [this.sinhvien.nguoiTao]
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createSinhVienModal').closest('.modal').modal('hide');
  }
}
