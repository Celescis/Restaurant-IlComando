import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EncuestaDeEmpleadoPage } from './encuesta-de-empleado.page';

describe('EncuestaDeEmpleadoPage', () => {
  let component: EncuestaDeEmpleadoPage;
  let fixture: ComponentFixture<EncuestaDeEmpleadoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestaDeEmpleadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EncuestaDeEmpleadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
