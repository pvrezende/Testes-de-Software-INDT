import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudArea } from './crud-area';

describe('CrudArea', () => {
  let component: CrudArea;
  let fixture: ComponentFixture<CrudArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
