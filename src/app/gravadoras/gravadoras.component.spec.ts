import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravadorasComponent } from './gravadoras.component';

describe('GravadorasComponent', () => {
  let component: GravadorasComponent
  ;
  let fixture: ComponentFixture<GravadorasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GravadorasComponent]
    });
    fixture = TestBed.createComponent(GravadorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
