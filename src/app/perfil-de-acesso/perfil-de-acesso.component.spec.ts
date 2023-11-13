import { ComponentFixture, TestBed } from '@angular/core/testing';

import { perfildeacessoComponent } from './perfil-de-acesso.component';

describe('perfildeacessoComponent', () => {
  let component: perfildeacessoComponent;
  let fixture: ComponentFixture<perfildeacessoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [perfildeacessoComponent]
    });
    fixture = TestBed.createComponent(perfildeacessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
