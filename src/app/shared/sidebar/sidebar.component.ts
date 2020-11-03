import { Component, OnInit } from '@angular/core';
declare let $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public menus = [
  {name :'Người dùng', url:'',icon:'user',childs:[{name:'Quản lý người dùng',url:'user/user'},
  {name:'Đăng xuất', url:'/login'},
  {name:'Đăng nhập', url:'/login'}]},
  {name:'Phiếu thu',url:'',icon:'signal',childs:[{name:'Quản lý phiếu thu',url:'/phieuthu/phieuthu'},
  {name:'Quản lý lớp học',url:'/phieuthu/lophoc'},
  {name:'Quản lý sinh viên',url:'/phieuthu/sinhvien'},
  {name:'Quản lý cán bộ giảng viên',url:'/phieuthu/canbogiangvien'},
  {name:'Quản lý khoản thu',url:'/phieuthu/khoanthu'},
  {name:'Quản lý ngân hàng',url:'/phieuthu/nganhang'}
  ]}];
  constructor() { } 
  ngOnInit(): void {
  }
}
