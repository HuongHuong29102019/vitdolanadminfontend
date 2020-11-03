import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-canbogiangvien',
  templateUrl: './canbogiangvien.component.html',
  styleUrls: ['./canbogiangvien.component.css'],
})
export class CanbogiangvienComponent extends BaseComponent implements OnInit {
  public canbogiangviens: any;
  public canbogiangvien: any;
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
    this._api.post('/api/canbogiangvien/searchadmin',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.canbogiangviens = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 20;
    this._api.post('/api/canbogiangvien/searchadmin',{page: this.page, pageSize: this.pageSize, HoVaTen: this.formsearch.get('HoVaTen').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.canbogiangviens = res.data;
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
          MaCBGV:value.MaCBGV ,
          MaPK:value.MaPK ,
          MaBMTT:value.MaBMTT,
          HoVaTen:value.HoVaTen,
          NgaySinh:value.NgaySinh,
          GioiTinh:+value.GioiTinh,
          MatKhau:value.MatKhau,
          DienThoai:value.DienThoai,
          Email:value.Email,
          ChucDanh:value.ChucDanh,
          SoTaiKhoan:value.SoTaiKhoan,
          TrangThai:+value.TrangThai,
          Quyen:+value.Quyen,
          NgayTao:value.NgayTao,
          NguoiTao:value.NguoiTao      
          };
        this._api.post('/api/canbogiangvien/create-canbogiangvien',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      debugger
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let tmp = {
          MaPK:value.MaPK ,     
          HoVaTen:value.HoVaTen,
          DienThoai:value.DienThoai,
          Email:value.Email,
          SoTaiKhoan:value.SoTaiKhoan,
          TrangThai:+value.TrangThai,
          Quyen:+value.Quyen,
          NgayTao:value.NgayTao,
          NguoiTao:value.NguoiTao ,    
          MaCBGV:this.canbogiangvien.maCBGV,          
          };
        this._api.post('/api/canbogiangvien/update-canbogiangvien',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    debugger
    this._api.post('/api/canbogiangvien/delete-canbogiangvien',{MaCBGV:row.maCBGV}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.canbogiangvien = null;
    this.formdata = this.fb.group({
      'MaCBGV': [''],
      'MaPK': [''],
      'MaBMTT': [''],
      'HoVaTen': [''],
      'NgaySinh': [''],
      'GioiTinh': [this.genders1[0].value],
      'MatKhau': [''],
      'DienThoai': [''],
      'Email': [''],
      'ChucDanh': [''],
      'SoTaiKhoan': [''],
      'TrangThai': [''],
      'Quyen': [this.roles1[0].value],
      'NgayTao': [this.today],
      'NguoiTao': [''],
    }); 
  }

  createModal() {
    debugger
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.canbogiangvien = null;
    setTimeout(() => {
      $('#createCanBoGiangVienModal').modal('toggle');
      this.formdata = this.fb.group({
        'MaCBGV': [''],
        'MaPK': [''],
        'MaBMTT': [''],
        'HoVaTen': [''],
        'NgaySinh': [''],
        'GioiTinh': [''],
        'MatKhau': [''],
        'DienThoai': [''],
        'Email': [''],
        'ChucDanh': [''],
        'SoTaiKhoan': [''],
        'TrangThai': [''],
        'Quyen': [''],
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
      $('#createCanBoGiangVienModal').modal('toggle');
      this._api.get('/api/canbogiangvien/get-by-id/'+ row.maCBGV).takeUntil(this.unsubscribe).subscribe((res:any) => {
        debugger
        this.canbogiangvien = res; 
        let NgayTao = new Date(this.canbogiangvien.ngayTao);
          this.formdata = this.fb.group({
            'MaPK': [this.canbogiangvien.maPK],
            'HoVaTen': [this.canbogiangvien.hoVaTen],
            'DienThoai': [this.canbogiangvien.dienThoai],
            'Email': [this.canbogiangvien.email],
            'SoTaiKhoan': [this.canbogiangvien.soTaiKhoan],
            'TrangThai': [this.canbogiangvien.trangThai],
            'Quyen': [this.canbogiangvien.quyen],
            'NgayTao': [NgayTao],
            'NguoiTao': [this.canbogiangvien.nguoiTao]
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createCanBoGiangVienModal').closest('.modal').modal('hide');
  }
}
