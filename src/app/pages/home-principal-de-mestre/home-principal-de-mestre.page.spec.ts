import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePrincipalDeMestrePage } from './home-principal-de-mestre.page';

describe('HomePrincipalDeMestrePage', () => {
  let component: HomePrincipalDeMestrePage;
  let fixture: ComponentFixture<HomePrincipalDeMestrePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePrincipalDeMestrePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePrincipalDeMestrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
