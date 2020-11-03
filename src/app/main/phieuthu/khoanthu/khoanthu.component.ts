import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-khoanthu',
  templateUrl: './khoanthu.component.html',
  styleUrls: ['./khoanthu.component.css'],
})
export class KhoanthuComponent extends BaseComponent implements OnInit {
  public khoanthus: any;
  public khoanthu: any;
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
      'MoTa': ['']
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/khoanthu/searchadmin',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.khoanthus = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/khoanthu/searchadmin',{page: this.page, pageSize: this.pageSize, MoTa: this.formsearch.get('MoTa').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.khoanthus = res.data;
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
          MaKhoanThu:value.MaKhoanThu ,
          MoTa:value.MoTa ,
          TinhChat:+value.TinhChat,
          HoaDonDienTu:+value.HoaDonDienTu,
          NgayTao:value.NgayTao,
          NguoiTao:value.NguoiTao      
          };
        this._api.post('/api/khoanthu/create-khoanthu',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      debugger
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let tmp = {
          MoTa:value.MoTa ,
          TinhChat:+value.TinhChat,
          HoaDonDienTu:+value.HoaDonDienTu,
          NgayTao:value.NgayTao,
          NguoiTao:value.NguoiTao,  
          MaKhoanThu:this.khoanthu.maKhoanThu,          
          };
        this._api.post('/api/khoanthu/update-khoanthu',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/khoanthu/delete-khoanthu',{MaKhoanThu:row.maKhoanThu}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.khoanthu = null;
    this.formdata = this.fb.group({
      'MaKhoanThu': [''],
      'MoTa': [''],
      'TinhChat': [''],
      'HoaDonDienTu': [''],
      'NgayTao': [this.today],
      'NguoiTao': [''],
    }); 
  }

  createModal() {
    debugger
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.khoanthu = null;
    setTimeout(() => {
      $('#createKhoanThuModal').modal('toggle');
      this.formdata = this.fb.group({
        'MaKhoanThu': [''],
        'MoTa': [''],
        'TinhChat': [''],
        'HoaDonDienTu': [''],
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
      $('#createKhoanThuModal').modal('toggle');
      this._api.get('/api/khoanthu/get-by-id/'+ row.maKhoanThu).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.khoanthu = res; 
        let NgayTao = new Date(this.khoanthu.ngayTao);
          this.formdata = this.fb.group({
            'MoTa': [this.khoanthu.moTa ],
            'TinhChat': [this.khoanthu.tinhChat],
            'HoaDonDienTu': [this.khoanthu.hoaDonDienTu],
            'NgayTao': [NgayTao],
            'NguoiTao': [this.khoanthu.nguoiTao]
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createKhoanThuModal').closest('.modal').modal('hide');
  }
}
