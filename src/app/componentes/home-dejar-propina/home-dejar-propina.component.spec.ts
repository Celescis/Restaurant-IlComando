import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeDejarPropinaComponent } from './home-dejar-propina.component';

describe('HomeDejarPropinaComponent', () => {
  let component: HomeDejarPropinaComponent;
  let fixture: ComponentFixture<HomeDejarPropinaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeDejarPropinaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeDejarPropinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
