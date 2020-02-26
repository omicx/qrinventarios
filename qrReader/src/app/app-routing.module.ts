import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  //{ path: '', loadChildren:'./tabs/tabs.module#TabsPageModule' },
  //{ path: '', redirectTo: 'tabs', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'inventarios',
    loadChildren: () => import('./inventarios/inventarios.module').then( m => m.InventariosPageModule)
  },
  {
    path: 'resguardos',
    loadChildren: () => import('./resguardos/resguardos.module').then( m => m.ResguardosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
