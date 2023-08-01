import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePrincipalDeClientePage } from './home-principal-de-cliente.page';

describe('HomePrincipalDeClientePage', () => {
  let component: HomePrincipalDeClientePage;
  let fixture: ComponentFixture<HomePrincipalDeClientePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePrincipalDeClientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePrincipalDeClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
