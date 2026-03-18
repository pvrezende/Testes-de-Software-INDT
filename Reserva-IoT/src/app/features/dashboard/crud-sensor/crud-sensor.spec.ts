import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudSensor } from './crud-sensor';

describe('CrudSensor', () => {
  let component: CrudSensor;
  let fixture: ComponentFixture<CrudSensor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudSensor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudSensor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
