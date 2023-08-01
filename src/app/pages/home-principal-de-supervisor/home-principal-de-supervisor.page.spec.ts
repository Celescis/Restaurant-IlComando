import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePrincipalDeSupervisorPage } from './home-principal-de-supervisor.page';

describe('HomePrincipalDeSupervisorPage', () => {
  let component: HomePrincipalDeSupervisorPage;
  let fixture: ComponentFixture<HomePrincipalDeSupervisorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePrincipalDeSupervisorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePrincipalDeSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
