import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesAdminComponent } from './games-admin.component';

describe('GamesAdminComponent', () => {
  let component: GamesAdminComponent;
  let fixture: ComponentFixture<GamesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
