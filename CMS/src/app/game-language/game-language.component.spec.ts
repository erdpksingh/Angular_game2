import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLanguageComponent } from './game-language.component';

describe('GameLanguageComponent', () => {
  let component: GameLanguageComponent;
  let fixture: ComponentFixture<GameLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
