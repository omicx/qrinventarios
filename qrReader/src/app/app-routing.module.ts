import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { NoLoginGuard } from './guard/no-login.guard';


/*
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
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
];
*/

const routes: Routes = [
  {
    path: '', redirectTo: 'login',pathMatch: 'full'},
  
  //{ path: '', loadChildren: './login/login.module#LoginPageModule' },

  //{ path: 'landing', loadChildren: './pages/landing/landing.module#LandingPageModule' },  
  //{ path: 'login', loadChildren: './pages/auth/login/login.module#LoginPageModule' },
  //{ path: 'register', loadChildren: './pages/auth/register/register.module#RegisterPageModule' },
  
  //{ path: 'dashboard', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule', canActivate: [AuthGuard] },
  //{ path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard] },
  {path: 'login',  loadChildren:  './login/login.module#LoginPageModule' },
  {path: 'home',   loadChildren:  './home/home.module#HomePageModule' },
  {path: 'register',loadChildren: './register/register.module#RegisterPageModule' },
  {path: 'dashboard',loadChildren:'./dashboard/dashboard.module#DashboardPageModule' },
  {
    path: 'producto-update',
    loadChildren: () => import('./producto-update/producto-update.module').then( m => m.ProductoUpdatePageModule)
  },
  
  
];




@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
