import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(private router: Router, private platform: Platform, private navCtrl: NavController) {
  }

  ngOnInit() {
    StatusBar.hide();
  }

   ionViewDidEnter() {
    SplashScreen.hide();
    setTimeout(() => {
      this.navCtrl.navigateRoot(['/login']);
    }, 3000);
  }
}
