import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-lophoc',
  templateUrl: './lophoc.component.html',
  styleUrls: ['./lophoc.component.css'],
})
export class LophocComponent extends BaseComponent implements OnInit {
  public lophocs: any;
  public lophoc: any;
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
      'TenLop': [''],
      'MaNganhHoc': ['']
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/lophoc/searchadmin',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.lophocs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 20;
    this._api.post('/api/lophoc/searchadmin',{page: this.page, pageSize: this.pageSize, TenLop: this.formsearch.get('TenLop').value, MaNganhHoc: this.formsearch.get('MaNganhHoc').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.lophocs = res.data;
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
          MaLop:value.MaLop ,
          TenLop:value.TenLop ,
          MaNganhHoc:value.MaNganhHoc,
          MaKhoaQuanLy:value.MaKhoaQuanLy,
          NienKhoa:value.NienKhoa,
          TrinhDo:+value.TrinhDo,
          He:+value.He,
          NgayNhapHoc:value.NgayNhapHoc,
          SiSo:+value.SiSo,
          TrangThai:+value.TrangThai,
          GhiChu:value.GhiChu,
          NgayTao:value.NgayTao,
          NguoiTao:value.NguoiTao      
          };
        this._api.post('/api/lophoc/create-lophoc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      debugger
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let tmp = {
          TenLop:value.TenLop ,
          TrangThai:+value.TrangThai,
          NgayTao:value.NgayTao,
          NguoiTao:value.NguoiTao ,    
          MaLop:this.lophoc.maLop,          
          };
        this._api.post('/api/lophoc/update-lophoc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    debugger
    this._api.post('/api/lophoc/delete-lophoc',{MaLop:row.maLop}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.lophoc = null;
    this.formdata = this.fb.group({
      'MaLop': [''],
      'TenLop': [''],
      'MaNganhHoc': [''],
      'MaKhoaQuanLy': [''],
      'NienKhoa': [''],
      'TrinhDo': [this.trinhdo[0].value],
      'He': [this.he[0].value],
      'NgayNhapHoc': [''],
      'SiSo': [''],
      'TrangThai': [''],
      'GhiChu': [''],
      'NgayTao': [this.today],
      'NguoiTao': [''],
    }); 
  }

  createModal() {
    debugger
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.lophoc = null;
    setTimeout(() => {
      $('#createLopHocModal').modal('toggle');
      this.formdata = this.fb.group({
        'MaLop': [''],
        'TenLop': [''],
        'MaNganhHoc': [''],
        'MaKhoaQuanLy': [''],
        'NienKhoa': [''],
        'TrinhDo': [''],
        'He': [''],
        'NgayNhapHoc': [''],
        'SiSo': [''],
        'TrangThai': [''],
        'GhiChu': [''],
        'NgayTao': [''],
        'NguoiTao': [''],
      });
      this.formdata.get('NgayTao').setValue(this.today);
      this.formdata.get('He').setValue(this.he[0].value);
      this.formdata.get('TrinhDo').setValue(this.trinhdo[0].value);
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    debugger
    setTimeout(() => {
      $('#createLopHocModal').modal('toggle');
      this._api.get('/api/lophoc/get-by-id/'+ row.maLop).takeUntil(this.unsubscribe).subscribe((res:any) => {
        debugger
        this.lophoc = res; 
        let NgayTao = new Date(this.lophoc.ngayTao);
          this.formdata = this.fb.group({
            'TenLop': [this.lophoc.tenLop],
            'TrangThai': [this.lophoc.trangThai],
            'NgayTao': [NgayTao],
            'NguoiTao': [this.lophoc.nguoiTao]
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createLopHocModal').closest('.modal').modal('hide');
  }
}
