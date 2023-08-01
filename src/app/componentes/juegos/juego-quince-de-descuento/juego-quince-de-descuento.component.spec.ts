import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JuegoQuinceDeDescuentoComponent } from './juego-quince-de-descuento.component';

describe('JuegoQuinceDeDescuentoComponent', () => {
  let component: JuegoQuinceDeDescuentoComponent;
  let fixture: ComponentFixture<JuegoQuinceDeDescuentoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoQuinceDeDescuentoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JuegoQuinceDeDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
