import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeRegistroDeUsuariosPage } from './home-registro-de-usuarios.page';

describe('HomeRegistroDeUsuariosPage', () => {
  let component: HomeRegistroDeUsuariosPage;
  let fixture: ComponentFixture<HomeRegistroDeUsuariosPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomeRegistroDeUsuariosPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeRegistroDeUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
