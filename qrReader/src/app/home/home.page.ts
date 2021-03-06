import { Component } from '@angular/core';
import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient} from "@angular/common/http";
import {catchError, finalize} from 'rxjs/operators';
import {BarcodeScannerOptions,BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ToastController } from '@ionic/angular';
import { EnvService } from '../services/env.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription; 

  //qrData = '1583738944000002';
  qrData = '';
  scannedCode = null;
  rd_list_inventarios:any;
  ver_segmentos:string = "ocultar";
 
  barcodeScannerOptions: BarcodeScannerOptions;
  elementType : 'observaciones' | 'canvas' | 'img' | 'espacio_fisico' | 'update' | 'firma' = 'canvas';

  api_url = this.env.API_SERVER;

  rd_inventario_selected:any=null;
  rd_inventario_valued : boolean = false;
  
  //atributos del producto
  product_identificador_unico : any;
  product_description : any;
  product_observaiones : any;
  product_espacio_fisico : any;
  product_folio_factura : any;
  product_resguardante : any;
  product_responsable : any;
  product_color : any;
  product_estado_fisico:any;
  product_tipo_adquisicion :any;
  product_grupo_bien    :any;
  product_grupo_bien_categoria   :any;
  product_grupo_bien_subcategoria :any;
  product_material_tipo :any;
  product_espacio_fisico_nombre :any;
  product_unidad_administrativa : any;

  product_unidad_administrativa_id :any;
  product_espacio_fisico_id :any;
  product_responsable_id :any;
  product_persona_id :any;



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
    private loadingCtrl: LoadingController,
    private env: EnvService,
  ) {

    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };

    this.product_id = "";
    this.product_description = "";
    this.rd_inventario_selected="";

    //this.rd_inventario_valued = true;//quitar solo para iniciar bien la app
    this.loadInventarios();

    //this.scanCode();//quitar solo para iniciar bien la app
    
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

    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        this.scannedCode = barcodeData.text;
        this.qrData      = this.scannedCode;
        this.product_id = this.scannedCode;
        this.product_identificador_unico = this.qrData;
      })
      .catch(err => {
        this.msgToastError("Error: " + err.message );
      }); 
      
      /*
     this.scannedCode = this.qrData;
     this.qrData = this.scannedCode;
     this.product_id = this.scannedCode; 
     this.product_identificador_unico = this.qrData; 
      */

     this.getDataProduct();
     this.ver_segmentos = "visualizar";
     

  }//function


  /*
  Obtiene las propiedades del Producto publicado en el web service por medio del product_id
  @param send: product_id
  */
  async getDataProduct(){
    let loading = await this.loadingCtrl.create({message:'Espere..'});
    await loading.present();

      let identificador_unico = btoa(this.product_id); //encripta el id para mandarlo

      //console.log(identificador_unico);

      let datosenviados = {
        identificador_unico   : identificador_unico,
        inventario_id         : this.rd_inventario_selected
      };
  
    this.http.post(this.api_url+'/web-services/get-data-product', 
    JSON.stringify(datosenviados),{observe: 'response'}). 
    pipe( finalize( () => loading.dismiss() ) ).
    subscribe(dataRec => {

      //console.log( dataRec );

        this.dataProducto = dataRec.body;

        this.product_id           = this.dataProducto.id;
        this.product_description  = this.dataProducto.descripcion_larga;
        this.product_img_url      = "/assets/product.png";//this.dataProducto.fotografia;
        this.product_num_serie    = this.dataProducto.numero_serie;
        this.product_marca        = this.dataProducto.marca.name;
        this.product_espacio_fisico=this.dataProducto.espacio_fisico_id;
        this.product_folio_factura = this.dataProducto.folio_factura;
        this.product_resguardante = this.dataProducto.persona.nombre + " "+this.dataProducto.persona.ap_paterno + " "+this.dataProducto.persona.ap_materno;
        this.product_responsable  = this.dataProducto.Responsable.nombre + " "+this.dataProducto.Responsable.ap_paterno + " "+this.dataProducto.Responsable.ap_materno;
        this.product_color        = this.dataProducto.color.name;
        this.product_estado_fisico= this.dataProducto.producto_estado.name;
        this.product_material_tipo= this.dataProducto.material_tipo.name;
        this.product_tipo_adquisicion = this.dataProducto.tipo_adquisicion.name;
        this.product_grupo_bien    = this.dataProducto.grupo_bien.name;
        this.product_grupo_bien_categoria    = this.dataProducto.grupo_bien_categoria.name;
        this.product_grupo_bien_subcategoria = this.dataProducto.grupo_bien_subcategoria.name;
        this.product_espacio_fisico        = this.dataProducto.espacio_fisico.clave + " "+this.dataProducto.espacio_fisico.descripcion; 
        this.product_unidad_administrativa = this.dataProducto.unidad_administrativa.clave +" "+ this.dataProducto.unidad_administrativa.name;
        
        this.product_unidad_administrativa_id = this.dataProducto.unidad_administrativa.id;
        this.product_espacio_fisico_id = this.dataProducto.espacio_fisico.id;
        this.product_responsable_id  = this.dataProducto.Responsable.id;
        this.product_persona_id  = this.dataProducto.persona.id;


        }, 
        error => {
          this.msgToastError("Error: " + error.message);
       });   


       

  }//function



  
  insertInventarioFisico(){

    if(this.rd_inventario_valued == false) {
      this.msgToast("Selecciona Opcion de Inventario");
      return;
    }


    let ident_unico = btoa(this.product_identificador_unico); //encripta el id para mandarlo

    let datosenviados = {
      identificador_unico    : ident_unico,
      producto_id            : this.product_id,
      observaciones          : this.product_observaiones,
      inventario_fisico_id   : this.rd_inventario_selected,
      unidad_administrativa_id : this.product_unidad_administrativa_id,
      espacio_fisico_id      : this.product_espacio_fisico_id,
      responsable_id         : this.product_responsable_id,
      persona_id             : this.product_persona_id
    };

  this.http.post(this.api_url+'/web-services/insert-inventario-fisico', 
  JSON.stringify(datosenviados),{observe: 'response'})
     .subscribe(dataRec => {
      this.resultData = dataRec.body;
      //console.log(this.resultData);

      if( this.resultData['action'] == "SUCCESS"){
          this.msgToast( this.resultData['message'] );
      }else{
        this.msgToastError( this.resultData['message'] );
      }
      
      }, 
      error => {
        this.msgToastError( error.status +"  "+ error.message);
        //this.product_description = "error post -> "+ error;
     });   


  }//function




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
