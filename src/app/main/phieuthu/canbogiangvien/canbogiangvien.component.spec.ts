import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanbogiangvienComponent } from './canbogiangvien.component';

describe('CanbogiangvienComponent', () => {
  let component: CanbogiangvienComponent;
  let fixture: ComponentFixture<CanbogiangvienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanbogiangvienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanbogiangvienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
