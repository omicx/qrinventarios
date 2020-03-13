import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userEmail: string;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private alertService: AlertService
  ) { }


  ngOnInit() {
    if(this.authService.userDetails()){
      this.userEmail = this.authService.userDetails().email;
    }else{
      this.navCtrl.navigateBack('');
    }
  }//function


  logout(){
    this.authService.logoutUser();
  }//function


  registrarInventario(){
    this.navCtrl.navigateRoot('/home');
  }

  productoUpdate(){
    this.navCtrl.navigateRoot('/producto-update');
  }

}//class
