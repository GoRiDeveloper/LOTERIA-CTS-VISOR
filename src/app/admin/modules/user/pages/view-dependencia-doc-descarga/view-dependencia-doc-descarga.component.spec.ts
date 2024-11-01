import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDependenciaDocDescargaComponent } from './view-dependencia-doc-descarga.component';

describe('ViewDependenciaDocDescargaComponent', () => {
  let component: ViewDependenciaDocDescargaComponent;
  let fixture: ComponentFixture<ViewDependenciaDocDescargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDependenciaDocDescargaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDependenciaDocDescargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
