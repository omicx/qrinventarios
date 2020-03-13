import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLoggedIn = false;

  constructor( private router : Router,) { }

  /*
  registerUser(value){
    return new Promise<any>((resolve, reject ) =>{
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err))
    })
  }//function
  */

 registerUser(value){

  return new Promise ((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
    .then( 
        res => resolve(res)
    )
    .catch( 
        err => reject(err)
    )
  })
}


  loginUser(value){

    return new Promise((resolve, rejected) =>{
      firebase.auth().signInWithEmailAndPassword(value.email, value.password).then(user => {
        this.isLoggedIn = true;
        resolve(user);
      }).catch(err => rejected(err));
    });

   
  }

/*
  loginUser(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err))
    })
   }//function
   */

   /*
   logoutUser(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        firebase.auth().signOut()
        .then(() => {
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    })
  }//function
  */


 logoutUser(){
    firebase.auth().signOut().then(() => {
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    })
  }

 
  userDetails(){
    return firebase.auth().currentUser;
  }//function
  

}//class
