import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregadoresComponent } from './agregadores.component';

describe('AgregadoresComponent', () => {
  let component: AgregadoresComponent;
  let fixture: ComponentFixture<AgregadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregadoresComponent]
    });
    fixture = TestBed.createComponent(AgregadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
