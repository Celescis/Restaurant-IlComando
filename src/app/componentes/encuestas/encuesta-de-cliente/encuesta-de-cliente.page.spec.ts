import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EncuestaDeClientePage } from './encuesta-de-cliente.page';

describe('EncuestaDeClientePage', () => {
  let component: EncuestaDeClientePage;
  let fixture: ComponentFixture<EncuestaDeClientePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestaDeClientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EncuestaDeClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
