import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmpleadoRegistroPage } from './empleado-registro.page';

describe('EmpleadoRegistroPage', () => {
  let component: EmpleadoRegistroPage;
  let fixture: ComponentFixture<EmpleadoRegistroPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmpleadoRegistroPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadoRegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
