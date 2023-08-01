import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePrincipalDeBartenderPage } from './home-principal-de-bartender.page';

describe('HomePrincipalDeBartenderPage', () => {
  let component: HomePrincipalDeBartenderPage;
  let fixture: ComponentFixture<HomePrincipalDeBartenderPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePrincipalDeBartenderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePrincipalDeBartenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
