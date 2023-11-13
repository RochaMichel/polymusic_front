import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapesComponent} from './tapes.component';

describe('TapesComponent', () => {
  let component: TapesComponent
  ;
  let fixture: ComponentFixture<TapesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TapesComponent]
    });
    fixture = TestBed.createComponent(TapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
