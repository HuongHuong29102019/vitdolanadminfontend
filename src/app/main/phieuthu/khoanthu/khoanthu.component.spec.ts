import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhoanthuComponent } from './khoanthu.component';

describe('KhoanthuComponent', () => {
  let component: KhoanthuComponent;
  let fixture: ComponentFixture<KhoanthuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhoanthuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhoanthuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
