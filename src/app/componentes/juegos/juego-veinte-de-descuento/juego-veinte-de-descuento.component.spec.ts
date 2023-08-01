import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JuegoVeinteDeDescuentoComponent } from './juego-veinte-de-descuento.component';

describe('JuegoVeinteDeDescuentoComponent', () => {
  let component: JuegoVeinteDeDescuentoComponent;
  let fixture: ComponentFixture<JuegoVeinteDeDescuentoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoVeinteDeDescuentoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JuegoVeinteDeDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
