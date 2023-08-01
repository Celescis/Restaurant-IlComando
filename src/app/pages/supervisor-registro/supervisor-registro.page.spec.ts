import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SupervisorRegistroPage } from './supervisor-registro.page';

describe('SupervisorRegistroPage', () => {
  let component: SupervisorRegistroPage;
  let fixture: ComponentFixture<SupervisorRegistroPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorRegistroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SupervisorRegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
