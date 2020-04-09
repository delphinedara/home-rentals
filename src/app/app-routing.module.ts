import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomesComponent } from './homes/homes.component';


const routes: Routes = [
  {
    path: 'homes',
    component: HomesComponent
  },
  {
    //Redirect path to the homes route
    path: '',
    redirectTo: 'homes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
