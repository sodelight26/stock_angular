import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportProductComponent } from './admin/import-product/import-product.component';
import { ImportSizeComponent } from './admin/import-size/import-size.component';
import { ImportTypeComponent } from './admin/import-type/import-type.component';
import { ProductComponent } from './admin/product/product.component';
import { ReportComponent } from './admin/report/report.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { ReceiptAdmitComponent } from './admin/receipt-admit/receipt-admit.component';
import { BasketComponent } from './basket/basket.component';
import { LoginComponent } from './login/login.component';
import { ShowProductComponent } from './show-product/show-product.component';
import { FollowComponent } from './user/follow/follow.component';
import { ReceiptOrderComponent } from './admin/receipt-order/receipt-order.component';
import { AuthGuard } from './_service/auth.guard';
import { PaymentComponent } from './admin/payment/payment.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'login', component:LoginComponent},
  // {path: 'test', component:TestComponent, canActivate: [AuthGuard] },
  {path: 'product', component:ProductComponent,canActivate: [AuthGuard]},
  {path: 'report', component:ReportComponent,canActivate: [AuthGuard]},
  {path: 'login', component:LoginComponent,canActivate: [AuthGuard]},
  {path: 'sidebar', component:SidebarComponent,canActivate: [AuthGuard]},
  {path: 'basket', component:BasketComponent,canActivate: [AuthGuard]},
  {path: 'receipt-admit', component:ReceiptAdmitComponent,canActivate: [AuthGuard]},
  {path: 'receipt-order', component:ReceiptOrderComponent,canActivate: [AuthGuard]},
  {path: 'import-produt', component:ImportProductComponent,canActivate: [AuthGuard]},
  {path: 'import-size', component:ImportSizeComponent,canActivate: [AuthGuard]},
  {path: 'import-type', component:ImportTypeComponent,canActivate: [AuthGuard]},
  {path: 'payment', component:PaymentComponent,canActivate: [AuthGuard]},
  {path: 'show-product', component:ShowProductComponent,canActivate: [AuthGuard]},
 {path: 'follow', component:FollowComponent},
  { path: '**', component: LoginComponent }






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
