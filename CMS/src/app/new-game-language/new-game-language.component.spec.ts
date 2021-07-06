import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGameLanguageComponent } from './new-game-language.component';

describe('NewGameLanguageComponent', () => {
  let component: NewGameLanguageComponent;
  let fixture: ComponentFixture<NewGameLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGameLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGameLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
