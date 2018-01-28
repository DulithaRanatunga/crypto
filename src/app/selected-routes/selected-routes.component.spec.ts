import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedRoutesComponent } from './selected-routes.component';

describe('SelectedRoutesComponent', () => {
  let component: SelectedRoutesComponent;
  let fixture: ComponentFixture<SelectedRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
