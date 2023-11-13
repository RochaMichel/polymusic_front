import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposDeTapesComponent } from './tipos-de-tapes.component';

describe('TiposDeTapesComponent', () => {
  let component: TiposDeTapesComponent
  ;
  let fixture: ComponentFixture<TiposDeTapesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TiposDeTapesComponent]
    });
    fixture = TestBed.createComponent(TiposDeTapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
