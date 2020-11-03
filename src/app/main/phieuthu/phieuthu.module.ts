import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PhieuthuComponent } from './phieuthu/phieuthu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LophocComponent } from './lophoc/lophoc.component';
import { SinhvienComponent } from './sinhvien/sinhvien.component';
import { CanbogiangvienComponent } from './canbogiangvien/canbogiangvien.component';
import { KhoanthuComponent } from './khoanthu/khoanthu.component';
import { NganhangComponent } from './nganhang/nganhang.component';

@NgModule({
  declarations: [ 
  PhieuthuComponent, LophocComponent, SinhvienComponent, CanbogiangvienComponent, KhoanthuComponent, NganhangComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'phieuthu',
        component: PhieuthuComponent,
      },
      {
        path: 'lophoc',
        component: LophocComponent,
      },
      {
        path: 'sinhvien',
        component: SinhvienComponent,
      },
      {
        path: 'canbogiangvien',
        component: CanbogiangvienComponent,
      },
      {
        path: 'khoanthu',
        component: KhoanthuComponent,
      },
      {
        path: 'nganhang',
        component: NganhangComponent,
      }
  ]),  
  ]
})
export class PhieuThuModule { }
