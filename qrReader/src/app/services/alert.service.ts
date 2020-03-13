import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastController:ToastController) { }

  async presentToast(message:any){
    const toast = await this.toastController.create({
      message:message,
      duration:2000,
      position:'top',
      color:'success'
    });

    toast.present();

  }//function


  async presentToastError(message:any){
    const toast = await this.toastController.create({
      message:message,
      duration:3000,
      position:'top',
      color:'danger'
    });

    toast.present();

  }//function


}
