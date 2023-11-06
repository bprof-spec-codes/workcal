import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerStatisticsComponent } from './worker-statistics.component';

describe('WorkerStatisticsComponent', () => {
  let component: WorkerStatisticsComponent;
  let fixture: ComponentFixture<WorkerStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkerStatisticsComponent]
    });
    fixture = TestBed.createComponent(WorkerStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
