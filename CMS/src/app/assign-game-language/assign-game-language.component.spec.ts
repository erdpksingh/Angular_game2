import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGameLanguageComponent } from './assign-game-language.component';

describe('AssignGameLanguageComponent', () => {
  let component: AssignGameLanguageComponent;
  let fixture: ComponentFixture<AssignGameLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignGameLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignGameLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
