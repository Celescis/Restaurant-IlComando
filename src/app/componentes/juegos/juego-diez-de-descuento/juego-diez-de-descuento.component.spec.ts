import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JuegoDiezDeDescuentoComponent } from './juego-diez-de-descuento.component';

describe('JuegoDiezDeDescuentoComponent', () => {
  let component: JuegoDiezDeDescuentoComponent;
  let fixture: ComponentFixture<JuegoDiezDeDescuentoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDiezDeDescuentoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JuegoDiezDeDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
