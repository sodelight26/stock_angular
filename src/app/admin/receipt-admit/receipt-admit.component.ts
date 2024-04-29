import { Component } from '@angular/core';
import { ApiPdoService } from 'src/app/_service/pdo-api.service';
import { first } from 'rxjs/operators';
import { AfterViewInit, ElementRef, ViewChild, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from "jspdf";
import { TokenStorageService } from '../../_service/token-storage.service';

@Component({
  selector: 'app-receipt-admit',
  templateUrl: './receipt-admit.component.html',
  styleUrls: ['./receipt-admit.component.scss']
})

export class ReceiptAdmitComponent {
  formaddp: any = {};
  dataview: any;
  searchTerm = '';
  results: any =  [];

  item: any;
  datavar:any[]=[];
  sum: any;
  el: any;

  user: any;

  //datatable
  dtOptions: DataTables.Settings = {};

posts: any;
  constructor(
    private apiService: ApiPdoService,
    private tokenStorage: TokenStorageService,
    ) {}
  
  ngOnInit(): void {
    this.getdata();
    this.getDataPrd();
    //datatable
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true, };
      this.user = this.tokenStorage.getUser();
      console.log(this.user);
       

 }

 getDataPrd() {
  this.apiService.getdata('/STK/show_product.php', 'view_prdss', 'STK_PRD', '')
    .subscribe(
      (data: any) => {
        if (data.status === 1) {
          this.results = null;
        } else {
          this.results = [];
        }
      },
      (error: any) => {
        this.results = [];
        console.error(error);
      }
    );
}

getdata(){
  this.apiService.getdata('/STK/show_addp.php', 'view_addp', 'STK_ADDP', '')
  .pipe(first())
  .subscribe(
    (data: any) => {
    console.log(data);
    console.log("getdata");
      if (data.status==1) {
        this.dataview = null;
      }else{
        this.dataview = null;
      }
    },
    (err:any) =>{
      this.dataview = null;
    });

}

save(item: any) {
  console.log('save');
  console.log(item);
  item.USER_ID = this.user.USER_ID;
  this.apiService.getdata('/STK/show_addp.php', 'save', 'STK_ADDP', item)
    .pipe(first())
    .subscribe(
      (data: any) => {
        console.log(data);
        if (data.status == 1) {
          this.dataview = this.getdata();
          alert("ข้อมูลสำเร็จ");
        } else {
          this.dataview = null;
        }
       
      },
      (err: any) => {
        this.dataview = null;
        console.log(err);
        // this.toastr.error("ไม่สามารถติดต่อฐานข้อมูลได้","แจ้งเตือน");
        alert("เพิ่มข้อมูลไม่สำเร็จ");
      });
}  




search() {
  if (this.searchTerm.length > 0) {
    this.apiService.getdata('/STK/show_product.php', 'view_prdss', 'STK_PRD', { opt: 'search', searchTerm: this.searchTerm})
      .subscribe(
        (data: any) => {
          if (data.status === 1) {
            this.results = data.data.filter((item: { PRD_NAME: string | string[]; PRD_ID: string | string[]; TYPE_NAME: string | string[]; SIZE_NAME: string | string[]; }) => 
            item.PRD_NAME.includes(this.searchTerm) || item.PRD_ID.includes(this.searchTerm) || item.TYPE_NAME.includes(this.searchTerm) || item.SIZE_NAME.includes(this.searchTerm));             
          } else {
            this.results = [];
          }
        },
        (error: any) => {
          this.results = [];
          console.error(error);
        
        }
      );
  } else {
    this.results = [];
  }
}

 selectitem(item: any) {
  this.datavar.push({'PRD_ID': item.PRD_ID, 'PRD_NAME': item.PRD_NAME, 'TYPE_NAME': item.TYPE_NAME, 'SIZE_NAME': item.SIZE_NAME, 'ADDPD_NUM': item.ADDPD_NUM, 'ADDPD_PRICE': item.ADDPD_PRICE});
  this.sum += item.ADDPD_NUM * item.ADDPD_PRICE;
  this.formaddp.datavar = this.datavar;
  this.formaddp.ADDP_SUMP = this.calculateSum();
  // this.dataview = this.getdata();
}

calculateSum(): number {
  if (!this.formaddp || !this.formaddp.datavar) {
    return 0;
  }
  return this.formaddp.datavar.reduce((acc: number, item: { ADDPD_NUM: number; ADDPD_PRICE: number; }) => acc + (item.ADDPD_NUM * item.ADDPD_PRICE), 0 );
}

// selectitem(item:any){
//    this.datavar.push({'PRD_ID':item.PRD_ID, 'PRD_NAME':item.PRD_NAME, 'TYPE_NAME':item.TYPE_NAME, 'SIZE_NAME':item.SIZE_NAME, 'PRD_NUMB':item.PRD_NUMB, 'PRD_PRICE':item.PRD_PRICE});
//    this.sum = item.PRD_NUMB * item.PRD_PRICE;
//    this.formord.datavar=this.datavar;
//    console.log(this.datavar);
// }

selectitemDELETE(item: any) {
  this.datavar.splice(this.datavar.indexOf(item), 1);
  this.sum -= item.ADDPD_NUM * item.ADDPD_PRICE;
  this.formaddp.ADDP_SUMP = this.calculateSum();
  this.formaddp.datavar = this.datavar;
}

 downloadPDF(){
  const doc = new jsPDF();
  doc.html(this.el.nativeElement, {
    callback: (doc)=>{
      doc.text("Hello world!", 10, 10);
      doc.save("a4.pdf");
    }
  })
}



}


