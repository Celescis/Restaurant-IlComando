import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePrincipalDeCocineroPage } from './home-principal-de-cocinero.page';

describe('HomePrincipalDeCocineroPage', () => {
  let component: HomePrincipalDeCocineroPage;
  let fixture: ComponentFixture<HomePrincipalDeCocineroPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePrincipalDeCocineroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePrincipalDeCocineroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
