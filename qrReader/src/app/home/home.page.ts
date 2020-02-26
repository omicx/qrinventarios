import { Component } from '@angular/core';
import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient} from "@angular/common/http";

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
  qrData = '';
  scannedCode = null;
  rd_list_inventarios:any;
  ver_segmentos:string = "ocultar";
 
  barcodeScannerOptions: BarcodeScannerOptions;
  elementType : 'url' | 'canvas' | 'img' | 'firma' = 'canvas';

  
  //api_url = "https://inventarioitst.abzoft.com";
  api_url = "http://app.inventariositst";

  rd_inventario_selected:any;
  
  product_description : any;
  product_id : any;
  dataProducto : any;
  product_img_url:any;
    
  constructor(
    private platform: Platform, 
    private barcodeScanner: BarcodeScanner,
    private base64ToGallery: Base64ToGallery,
    private toastCtrl:ToastController,
    private http: HttpClient 
    ) {

    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };

    this.product_id = "";
    this.product_description = "";

    this.rd_inventario_selected="";


    this.loadInventariosLar();
    
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
    //console.log("EventoSelected: " + this.rd_inventario_selected);
  }//function

  loadInventariosLar(){
    
    let data:Observable<any>;
    this.http.get(this.api_url+'/api/getevents')
    .subscribe(result => { 
      console.log("getevents: "+result);
                            this.rd_list_inventarios = result;
               },
               error  => { 
                            console.log("Error en loadInventarios: " + error)
               }
    );  

    
  }//function

  loadInventarios(){
    /*
    let data:Observable<any>;
    this.http.get(this.api_url+'/web-services/get-inventarios-list')
    .subscribe(result => { 
                            this.rd_list_inventarios = result;
               },
               error  => { 
                            console.log("Error en loadInventarios: " + error)
               }
    );  */

    
    this.rd_list_inventarios = [
      {id:"1",
       descripcion:"Inventario 1 2020"
      },
      {id:"2",
       descripcion:"Inventario 2 2020"
      }] 
  }//function

  
  scanCode() {
    /*
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        this.scannedCode = barcodeData.text;
        this.qrData      = this.scannedCode;
        this.product_id = this.scannedCode;
      })
      .catch(err => {
        this.product_description = "Error: " + err ;
      }); 
      */
      
      
      
     this.scannedCode = this.qrData;// '1581537725000001';
     this.qrData = this.scannedCode;
     this.product_id = this.scannedCode; 

     console.log("qrData" + this.qrData);
     


     this.getDataProductLar();

     this.ver_segmentos = "visualizar";
     

  }//function


  /*
  Obtiene las propiedades del Producto publicado en el web service por medio del product_id
  @param send: product_id
  */
 getDataProductLar(){
    
  let identificador_unico = this.product_id;

    let datosenviados = {
      identificador_unico   : identificador_unico,
      inventario_id         : this.rd_inventario_selected
    };

  this.http.post(this.api_url+'/api/getproduct', 
  JSON.stringify(datosenviados),{observe: 'response'})
     .subscribe(dataRec => {

      console.log(dataRec);

      this.dataProducto = dataRec.body;
      //console.log(this.dataProducto);


      this.product_id           = this.dataProducto.numero_serie;
      this.product_description  = this.dataProducto.descripcion_larga;
      this.product_img_url      = this.dataProducto.fotografia;
      }, error => {
        this.product_description = "error post -> "+ error;
     });   

     

}//function




  /*
  Obtiene las propiedades del Producto publicado en el web service por medio del product_id
  @param send: product_id
  */
  getDataProduct(){
    
    /*
    let data:Observable<any>;
    data = this.http.get('http://app.inventariositst/api/getproduct');
    data.subscribe(result => {

      this.dataProducto = result.product[0];

      //console.log(result.product[0].descripcion);
      //console.log(this.dataProducto);

      this.product_id = result.product[0].numero_serie;
      this.product_description =result.product[0].descripcion;
      this.product_img_url = this.dataProducto.fotografia;

    });
*/
    
    
  
    
    /*
    //btoa(this.product_id)   encripta en base64 y funciona con el cakephp3.8
    data = this.http.get(this.api_url+'/web-services/get-data-product/'+btoa(this.product_id) );
    data.subscribe(result => { 
      this.product_description = result.body["descripcion_larga"];
      console.log(result.id + " - " +result.persona.nombre  );
    }); 
*/
    //console.log(btoa(this.product_id));
    
      //MTU4MTUzNzcyNTAwMDAwMQ==
      //console.log(atob("MTU4MTUzNzcyNTAwMDAwMQ==")); // password

      //console.log(this.api_url);

      let identificador_unico = btoa(this.product_id);

      let datosenviados = {
        identificador_unico   : identificador_unico,
        inventario_id         : this.rd_inventario_selected
      };
  
    this.http.post(this.api_url+'/web-services/get-data-product', 
    JSON.stringify(datosenviados),{observe: 'response'})
       .subscribe(dataRec => {

        //console.log(dataRec);

        this.dataProducto = dataRec.body;
        //console.log(this.dataProducto);


        this.product_id           = this.dataProducto.numero_serie;
        this.product_description  = this.dataProducto.descripcion_larga;
        this.product_img_url      = this.dataProducto.fotografia;
        }, error => {
          this.product_description = "error post -> "+ error;
       });   

       

  }//function



  saveRegistro(){
    let datosenviados = {
      inventario_id   : "",
      producto_id     : this.product_id,
      fecha_inventario: "date",
      tipo_inventario : "fisico",
      accion: 'register'
    };


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






}
