import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EncuestaDeSupervisorPage } from './encuesta-de-supervisor.page';

describe('EncuestaDeSupervisorPage', () => {
  let component: EncuestaDeSupervisorPage;
  let fixture: ComponentFixture<EncuestaDeSupervisorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestaDeSupervisorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EncuestaDeSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
