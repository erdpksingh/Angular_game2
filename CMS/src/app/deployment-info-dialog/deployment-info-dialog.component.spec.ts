import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentInfoDialogComponent } from './deployment-info-dialog.component';

describe('DeploymentInfoDialogComponent', () => {
  let component: DeploymentInfoDialogComponent;
  let fixture: ComponentFixture<DeploymentInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
