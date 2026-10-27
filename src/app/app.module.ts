import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomesComponent } from './homes/homes.component';
import { HomeTypeFilterComponent } from './home-type-filter/home-type-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeSearchComponent } from './home-search/home-search.component';

@NgModule({ declarations: [
        AppComponent,
        HomesComponent,
        HomeTypeFilterComponent,
        HomeSearchComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
