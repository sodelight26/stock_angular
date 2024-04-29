import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptOrderComponent } from './receipt-order.component';

describe('ReceiptOrderComponent', () => {
  let component: ReceiptOrderComponent;
  let fixture: ComponentFixture<ReceiptOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
