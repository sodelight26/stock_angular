import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptAdmitComponent } from './receipt-admit.component';

describe('ReceiptAdmitComponent', () => {
  let component: ReceiptAdmitComponent;
  let fixture: ComponentFixture<ReceiptAdmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptAdmitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptAdmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
