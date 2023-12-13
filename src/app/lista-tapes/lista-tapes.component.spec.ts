import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTapesComponent } from './lista-tapes.component';

describe('ListaTapesComponent', () => {
  let component: ListaTapesComponent;
  let fixture: ComponentFixture<ListaTapesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaTapesComponent]
    });
    fixture = TestBed.createComponent(ListaTapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
