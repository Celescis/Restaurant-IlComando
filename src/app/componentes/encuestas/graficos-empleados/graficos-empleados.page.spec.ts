import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GraficosEmpleadosPage } from './graficos-empleados.page';

describe('GraficosEmpleadosPage', () => {
  let component: GraficosEmpleadosPage;
  let fixture: ComponentFixture<GraficosEmpleadosPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficosEmpleadosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GraficosEmpleadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
