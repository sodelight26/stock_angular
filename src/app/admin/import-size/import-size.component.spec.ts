import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSizeComponent } from './import-size.component';

describe('ImportSizeComponent', () => {
  let component: ImportSizeComponent;
  let fixture: ComponentFixture<ImportSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
