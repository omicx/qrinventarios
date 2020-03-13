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
  selector: 'app-producto-update',
  templateUrl: './producto-update.page.html',
  styleUrls: ['./producto-update.page.scss'],
})
export class ProductoUpdatePage implements OnInit, OnDestroy, AfterViewInit  {

  backButtonSubscription; 
  //qrData = '1583738944000002';
  qrData = '';
  scannedCode = null;

  rd_list_personas:any;
  rd_list_responsables:any;
  rd_list_espacios_fisicos:any;
  rd_list_uadministrativas:any;

  ver_segmentos:string = "ocultar";
 
  barcodeScannerOptions: BarcodeScannerOptions;
  elementType : 'observaciones' | 'canvas' | 'img' | 'espacio_fisico' | 'update' | 'firma' = 'canvas';

  api_url = this.env.API_SERVER;

  //variables para los radios y valores de los mismos
  rd_personas_selected:any=null;
  rd_personas_valued : boolean = false;

  rd_responsable_selected:any=null;
  rd_responsable_valued : boolean = false;
  
  rd_espaciofisico_selected:any=null;
  rd_espaciofisico_valued : boolean = false;

  rd_uadministrativa_selected:any=null;
  rd_uadministrativa_valued : boolean = false;

  //atributos del producto
  product_identificador_unico : any;
  product_description : any;
  product_observaciones : any;
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
  product_partida :any;
  product_partida_concepto :any;
    
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

    this.rd_personas_selected="";
    this.rd_responsable_selected="";
    this.rd_espaciofisico_selected="";
    this.rd_uadministrativa_selected="";
 


    
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

  radioPersonasSelect(event) {
    this.rd_personas_selected = event.detail.value;
    this.rd_personas_valued = true;
  }//function

  radioResponsablesSelect(event) {
    this.rd_responsable_selected = event.detail.value;
    this.rd_responsable_valued = true;
  }//function

  radioEspacioFisicoSelect(event) {
    this.rd_espaciofisico_selected = event.detail.value;
    this.rd_espaciofisico_valued = true;
  }//function

  radioUnidadAdministrativaSelect(event) {
    this.rd_uadministrativa_selected = event.detail.value;
    this.rd_uadministrativa_valued = true;
  }//function
  


  loadPersonas(){
    let data:Observable<any>;
    this.http.post(this.api_url+'/web-services/personas-list','')
    .subscribe(result => { 
                            this.rd_list_personas = result;
               },
               error  => { 
                            this.msgToastError("Error en loadInventarios: " + error.status + " "+ error.message)
               }
    );  
  }//function

  loadUnidadAdministrativas(){    
    let data:Observable<any>;
    this.http.post(this.api_url+'/web-services/unidad-administrativas-list','')
    .subscribe(result => { 
                            this.rd_list_uadministrativas = result;
               },
               error  => { 
                    this.msgToastError("Error en loadInventarios: " + error.status + " "+ error.message)
               }
    );  
  }//function

  loadResponsables(){    
    let data:Observable<any>;
    this.http.post(this.api_url+'/web-services/personas-list','')
    .subscribe(result => { 
                            this.rd_list_responsables = result;
               },
               error  => { 
                this.msgToastError("Error en loadInventarios: " + error.status + " "+ error.message)
               }
    );  
  }//function

  loadEspaciosFisicos(){
    let data:Observable<any>;
    this.http.post(this.api_url+'/web-services/espacio-fisicos-list','')
    .subscribe(result => { 
                            this.rd_list_espacios_fisicos = result;
               },
               error  => { 
                this.msgToastError("Error en loadInventarios: " + error.status + " "+ error.message)
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
     this.product_identificador_unico = this.qrData; */


     this.getDataProduct();
     this.ver_segmentos = "visualizar";


     this.loadPersonas();
     this.loadResponsables();
     this.loadUnidadAdministrativas();
     this.loadEspaciosFisicos();
     

  }//function


  /*
  Obtiene las propiedades del Producto publicado en el web service por medio del product_id
  @param send: product_id
  */
  async getDataProduct(){
    let loading = await this.loadingCtrl.create({message:'Espere..'});
    await loading.present();

      let identificador_unico = btoa(this.product_id); //encripta el id para mandarlo

      console.log(identificador_unico);

      let datosenviados = {
        identificador_unico   : identificador_unico,
        inventario_id         : ""
      };
  
    this.http.post(this.api_url+'/web-services/get-data-product', 
    JSON.stringify(datosenviados),{observe: 'response'}). 
    pipe( finalize( () => loading.dismiss() ) ).
    subscribe(dataRec => {

      console.log( dataRec );

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
        this.product_observaciones = this.dataProducto.observaciones;
        this.product_partida = this.dataProducto.clasificador_objeto_gasto.name;
        this.product_partida_concepto = this.dataProducto.clasificador_objeto_gasto.nombre;
        this.product_unidad_administrativa_id = this.dataProducto.unidad_administrativa.id;
        this.product_espacio_fisico_id = this.dataProducto.espacio_fisico.id;
        this.product_responsable_id  = this.dataProducto.Responsable.id;
        this.product_persona_id  = this.dataProducto.persona.id;


        }, 
        error => {
          this.msgToastError("Error: " + error.message);
       });   


       

  }//function



  
  updateProducto(){

    if(this.rd_uadministrativa_valued == false) {
      this.msgToast("Selecciona Unidad Administrativa");
      return;
    }


    let ident_unico = btoa(this.product_identificador_unico); //encripta el id para mandarlo

    let datosenviados = {
      identificador_unico    : ident_unico,
      observaciones          : this.product_observaciones,
      unidad_administrativa_id : this.rd_uadministrativa_selected,
      espacio_fisico_id      : this.rd_espaciofisico_selected,
      responsable_id         : this.rd_responsable_selected,
      persona_id             : this.rd_personas_selected //resguardante
    };

  this.http.post(this.api_url+'/web-services/update-resguardo', 
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





}//function

