import { Component } from '@angular/core';
import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient} from "@angular/common/http";
import {catchError, finalize} from 'rxjs/operators';

import {BarcodeScannerOptions,BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription; 

  //qrData = '1581537725000001';
  qrData = '1581537725000001';
  scannedCode = null;
  rd_list_inventarios:any;
  ver_segmentos:string = "ocultar";
 
  barcodeScannerOptions: BarcodeScannerOptions;
  elementType : 'url' | 'canvas' | 'img' | 'update' | 'firma' = 'canvas';

  
  api_url = "https://inventarioitst.abzoft.com";
  //api_url = "http://app.inventariositst";
  //api_url = "http://sysinvent.abzoft";

  rd_inventario_selected:any=null;
  rd_inventario_valued : boolean = false;
  
  product_identificador_unico : any;
  product_description : any;
  product_observaiones : any;
  inventario_fisico_nombre : any;
  product_id : any;
  dataProducto : any;
  resultData:any;
  product_img_url:any;
  product_num_serie:any;
  product_marca:any;
    
  constructor(
    private platform: Platform, 
    private barcodeScanner: BarcodeScanner,
    private base64ToGallery: Base64ToGallery,
    private toastCtrl:ToastController,
    private http: HttpClient ,
    private loadingCtrl: LoadingController
    ) {

    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };

    this.product_id = "";
    this.product_description = "";
    this.rd_inventario_selected="";

    console.log("rd_inventario_valued: "+this.rd_inventario_valued);
    this.loadInventarios();
    
  }//construct

  ngOnInit() { }
  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp(); 
    });
    
  }

  ngOnDestroy() { 
    this.backButtonSubscription.unsubscribe();
  }

  radioEventoSelect(event) {
    this.rd_inventario_selected     = event.detail.value;
    this.rd_inventario_valued = true;
    this.inventario_fisico_nombre = event.detail.text;

    
  }//function



  loadInventarios(){
    
    let data:Observable<any>;
    this.http.get(this.api_url+'/web-services/get-inventarios-list')
    .subscribe(result => { 
                            this.rd_list_inventarios = result;
               },
               error  => { 
                            alert("Error en loadInventarios: " + error.status + " "+ error.message)
               }
    );  
  }//function

  
   scanCode() {
    
  
  

      if(this.rd_inventario_valued == false) {
        this.msgToast("Selecciona Opcion de Inventario");
        return;
      }

      /*
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        this.scannedCode = barcodeData.text;
        this.qrData      = this.scannedCode;
        this.product_id = this.scannedCode;
        this.product_identificador_unico = this.qrData;
      })
      .catch(err => {
        this.product_description = "Error: " + err ;
      }); 
      */      

      
     this.scannedCode = this.qrData;
     this.qrData = this.scannedCode;
     this.product_id = this.scannedCode; 
     this.product_identificador_unico = this.qrData;

     this.getDataProduct();

     this.ver_segmentos = "visualizar";
     

  }//function


 


  /*
  Obtiene las propiedades del Producto publicado en el web service por medio del product_id
  @param send: product_id
  */
  async getDataProduct(){
    let loading = await this.loadingCtrl.create({message:'Espere..',

  });
  await loading.present();


      let identificador_unico = btoa(this.product_id); //encripta el id para mandarlo

      let datosenviados = {
        identificador_unico   : identificador_unico,
        inventario_id         : this.rd_inventario_selected
      };
  
    this.http.post(this.api_url+'/web-services/get-data-product', 
    JSON.stringify(datosenviados),{observe: 'response'}). 
    pipe( finalize( () => loading.dismiss() ) ).
    subscribe(dataRec => {
        this.dataProducto = dataRec.body;
        this.product_id           = this.dataProducto.id;
        this.product_description  = this.dataProducto.descripcion_larga;
        this.product_img_url      = this.dataProducto.fotografia;
        this.product_num_serie    = this.dataProducto.numero_serie;
        this.product_marca        = this.dataProducto.marca.name;

        }, 
        error => {
          this.product_description = "error post -> "+ error;
       });   


       

  }//function



  
  insertInventarioFisico(){
    let ident_unico = btoa(this.product_identificador_unico); //encripta el id para mandarlo

    let datosenviados = {
      identificador_unico    : ident_unico,
      producto_id            : this.product_id,
      observaciones          : this.product_observaiones,
      inventario_fisico_id   : this.rd_inventario_selected
    };

  this.http.post(this.api_url+'/web-services/insert-inventario-fisico', 
  JSON.stringify(datosenviados),{observe: 'response'})
     .subscribe(dataRec => {
      this.resultData = dataRec.body;
      console.log(this.resultData);

      if( this.resultData['action'] == "SUCCESS"){
          this.msgToast( this.resultData['message'] );
      }else{
        this.msgToastError( this.resultData['message'] );
      }
      
      }, 
      error => {
        alert( error.status +"  "+ error.message);
        //this.product_description = "error post -> "+ error;
     });   


  }//function



  downloadQR(){
    const canvas =document.querySelector('canvas') as HTMLCanvasElement;
    const imageData = canvas.toDataURL('image/jpeg').toString();
    //console.log('data: ', imageData);
    let data = imageData.split(',')[1];
    //console.log('[1]:', data);

    this.base64ToGallery.base64ToGallery(data,
      {prefix:'_img', mediaScanner:true })
      .then( async res => {
        let toast = await this.toastCtrl.create({
          header:'QR Code saved in your photolibrary'
        });
        toast.present();

      },
      err => console.log('err: ', err));
      
  }



  async msgToast(mess) {
    const toast = await this.toastCtrl.create({
      message: mess,
      position: 'middle',
      animated:true,
      color:'success',
      duration: 2000
    });
    toast.present();
  }//function


  async msgToastError(mess) {
    const toast = await this.toastCtrl.create({
      message: mess,
      position: 'middle',
      animated:true,
      color:'danger',
      buttons: [
      {
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }//function







}//class
