import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule} from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { ImportProductComponent } from './admin/import-product/import-product.component';
import { ImportSizeComponent } from './admin/import-size/import-size.component';
import { ImportTypeComponent } from './admin/import-type/import-type.component';
import { ProductComponent } from './admin/product/product.component';
import { ReportComponent } from './admin/report/report.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { ReceiptAdmitComponent } from './admin/receipt-admit/receipt-admit.component';
import { BasketComponent } from './basket/basket.component';
import { ShowProductComponent } from './show-product/show-product.component';
import { FollowComponent } from './user/follow/follow.component';
import { ReceiptOrderComponent } from './admin/receipt-order/receipt-order.component';
import { AuthGuard } from './_service/auth.guard';
import { PaymentComponent } from './admin/payment/payment.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TestComponent } from './admin/test-angular/test.component';


// import { AddTassComponent } from './Components/TASS/add-tass/add-tass.component';
// import { UpdateTassComponent } from './Components/TASS/update-tass/update-tass.component';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ImportProductComponent,
        ImportSizeComponent,
        ImportTypeComponent,
        ProductComponent,
        ReportComponent,
        SidebarComponent,
        ReceiptAdmitComponent,
        BasketComponent,
        ShowProductComponent,
        FollowComponent,
        ReceiptOrderComponent,
        PaymentComponent,
        TestComponent,
       
  ],
    // AddTassComponent,
    // UpdateTassComponent,
  
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    DataTablesModule,
    NgxDatatableModule,
    SweetAlert2Module,
    NgxPaginationModule,
    MatInputModule,
    MatDatepickerModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }