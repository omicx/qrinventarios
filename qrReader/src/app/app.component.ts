import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

//import { AuthService } from './services/auth.service';
import { AuthenticationService } from './services/authentication.service';
import { AlertService } from './services/alert.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {


  /*
  public appMenu = [
    {title:'Ingresar',    url:'ingresar',    icon:'home'},
    {title:'Home',        url:'home',        icon:'list'},
    {title:'Inventarios', url:'inventarios', icon:'add'},
    {title:'Resguardos',  url:'resguardos',  icon:'trash'}
  ];*/

  public appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'home'
    },
    {
      title: 'Productos',
      url: '/producto-update',
      icon: 'card-outline'
    },
    {
      title: 'Inventarios',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Resguardos',
      url: '/resguardos',
      icon: 'list'
    },
  ];



  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    //private authService: AuthService,
    private authService: AuthenticationService,
    private navCtrl: NavController,
    private alertService: AlertService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

       // Commenting splashScreen Hide, so it won't hide splashScreen before auth check
      this.splashScreen.hide();
      //this.authService.getToken();//funciona con laravel
      
    });
  }//function




   // When Logout Button is pressed 
   /*
   logout() {
    this.authService.logout().subscribe(
      data => {
        this.alertService.presentToast(data['message']);        
      },
      error => {
        console.log(error);
      },
      () => {
        this.navCtrl.navigateRoot('/landing');
      }
    );
  }//function

  */

}//class
