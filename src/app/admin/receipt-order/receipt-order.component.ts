import { Component } from '@angular/core';
import { ApiPdoService } from 'src/app/_service/pdo-api.service';
import { first } from 'rxjs/operators';
import { AfterViewInit, ElementRef, ViewChild, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from "jspdf";
import { TokenStorageService } from '../../_service/token-storage.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-receipt-order',
  templateUrl: './receipt-order.component.html',
  styleUrls: ['./receipt-order.component.scss']
})


export class ReceiptOrderComponent implements OnInit {
  @Output() paymentDataUpdated: EventEmitter<void> = new EventEmitter<void>();
  
  formord: any = {};
  dataview: any;
  searchTerm = '';
  results: any = [];
  item: any;
  datavar: any[] = [];
  sum: any;
  user: any;
  colr_name : any;
  paymentData: any;
 
  datapay:any []=[];
  @ViewChild('receipt', { static: false }) el!: ElementRef




  constructor(
    private apiService: ApiPdoService,
    private tokenStorage: TokenStorageService,
  ) { }

  ngOnInit(): void {
    this.getDataPrd();
    this.user = this.tokenStorage.getUser();
    console.log(this.user);
    this.getdata();
  }

  downloadPDF() {
    
  }


  selectitem(item: any) {
    // Check if the item is already in datavar
    const index = this.datavar.findIndex((x) => x.PRD_ID === item.PRD_ID);
  
    if (index !== -1) {
      // If the item is already in datavar, update the PRD_NUMB property
      this.datavar[index].PRD_NUMB += item.PRD_NUMB;
    } else {
      // If the item is not in datavar, push a new object to the array
      this.datavar.push({
        'PRD_ID': item.PRD_ID,
        'PRD_NAME': item.PRD_NAME,
        'TYPE_NAME': item.TYPE_NAME,
        'SIZE_NAME': item.SIZE_NAME,
        'PRD_NUMB': item.PRD_NUMB,
        'ORDD_PRICE': item.ORDD_PRICE
      });
    }
  
    // Update the formord object
    this.formord.datavar = this.datavar;
    this.formord.ORD_SUMP = this.calculateSum();
  }
  
  // selectitem(item: any) {
  //   this.datavar.push({ 'PRD_ID': item.PRD_ID, 'PRD_NAME': item.PRD_NAME, 'TYPE_NAME': item.TYPE_NAME, 'SIZE_NAME': item.SIZE_NAME, 'PRD_NUMB': item.PRD_NUMB, 'ORDD_PRICE': item.ORDD_PRICE });
  //   this.formord.datavar = this.datavar;
  //   this.formord.ORD_SUMP = this.calculateSum();
  // }

  calculateSum(): number {
    if (!this.formord || !this.formord.datavar) {
      return 0;
    }
    return this.formord.datavar.reduce((acc: number, item: { PRD_NUMB: number; ORDD_PRICE: number; }) => acc + (item.PRD_NUMB * item.ORDD_PRICE), 0);
  }

  // calculateSum(): number {
  //   if (!this.formord || !this.formord.datavar) {
  //     return 0;
  //   }
  //   return this.formord.datavar.reduce((acc: number, item: { PRD_NUMB: number; ORDD_PRICE: number; }) => acc + (item.PRD_NUMB * item.ORDD_PRICE), 0);
  // }

  selectitemDELETE(item: any) {
    this.datavar.splice(this.datavar.indexOf(item), 1);
    this.sum -= item.PRD_NUMB * item.ORDD_PRICE;
    this.formord.ORD_SUMP = this.calculateSum();
    this.formord.datavar = this.datavar;
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
        (error) => {
          this.results = [];
          console.error(error);
        }
      );
  }

  search() {
    if (this.searchTerm.length > 0) {
      this.apiService.getdata('/STK/show_product.php', 'view_prdss', 'STK_PRD', { opt: 'search', searchTerm: this.searchTerm })
        .subscribe(
          (data: any) => {
            if (data.status === 1) {
              this.results = data.data.filter((item: any) =>
                item.PRD_NAME && item.PRD_NAME.includes(this.searchTerm) ||
                item.PRD_ID && item.PRD_ID.includes(this.searchTerm) ||
                item.TYPE_NAME && item.TYPE_NAME.includes(this.searchTerm) ||
                item.SIZE_NAME && item.SIZE_NAME.includes(this.searchTerm)
              );
            } else {
              this.results = [];
            }
          },
          (error) => {
            this.results = [];
            console.error(error);

          }
        );
    } else {
      this.results = [];
    }
  }



  getdata() {
    this.apiService.getdata('/STK/show_ord.php', 'view_ord', 'STK_ORD', '')
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          console.log("getdata");
          if (data.status == 1) {
            this.dataview = null;
          } else {
            this.dataview = null;
          }
        },
        (err: any) => {
          this.dataview = null;
        });

  }

  changselecttypesell(item: Event) {
    const tt = (item.target as HTMLInputElement).value;
    console.log(tt);
  }

  
  checkProductStatus(item: any): string {
    if (item.STUS_NAME == 'รอดำเนินการ') {
      this.colr_name = 'primary';
      return ` รอดำเนินการ`;
    }else if (item.STUS_NAME == 'ชำระแล้ว'){
      this.colr_name = 'success';
      return ` ชำระแล้ว`;
    } else if (item.STUS_NAME == 'ยังไม่ชำระ'){
      this.colr_name = 'warning';
      return ` ยังไม่ชำระ`;
    }
    return '';
  }

  // save1(item:any){
  //   item.USER_ID = this.user.USER_ID;
  //   console.log('save');
  //   item.ORD_TYPESELL == 1 ? item.ORD_STUS = 0 : '';
  //   item.ORD_TYPESELL == 2 ? item.ORD_STUS = 0 : '';
  //   this.apiService.getdata('/STK/show_ord.php', 'save', 'STK_ORD', item)
  //   .pipe(first())
  //     .subscribe(
  //       (data: any) => {
  //         console.log(this.datavar);
  //         if (data.status == 1) {
  //           // Assign the data to the datapay property of formdd
  //           this.dataview = data.data;
  //           this.dataview = this.getdata();
  //         } else {
  //           this.dataview = null;
  //         }
  //       },
  //       (err: any) => {
  //         this.dataview = null;
  //       });
  // }

  save(item: any) {
    item.USER_ID = this.user.USER_ID;
    console.log('save');
    item.ORD_TYPESELL == 1 ? item.ORD_STUS = 0 : '';
    item.ORD_TYPESELL == 2 ? item.ORD_STUS = 0 : '';
    this.apiService.getdata('/STK/show_ord.php', 'save', 'STK_ORD', item)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.dataview = this.getdata();
            this.paymentDataUpdated.emit();
            
          } else {
            this.dataview = null;
          }
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'สร้างรายการมูลสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        },
        (err: any) => {
          console.log(err);
          // this.toastr.error("ไม่สามารถติดต่อฐานข้อมูลได้","แจ้งเตือน");
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'สร้างรายการไม่มูลสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
          this.getdata();
        });
  }  

 
  
  refreshPayment() {
    // ทำการรีเฟรชข้อมูล paymentData ที่ส่งเข้าไปยังคอมโพเนนต์ app-payment
    this.paymentData = null; // อาจเปลี่ยนเป็นค่า default หรือค่าที่ต้องการ
  }

  refreshPaymentData() {
    // ทำการรีเฟรชข้อมูล paymentData ที่มีการแก้ไข
    // สามารถเพิ่มโค้ดเพื่อรีเฟรชข้อมูลต่างๆ ที่ต้องการได้
    this.paymentData = null; // อาจเปลี่ยนเป็นค่า default หรือค่าที่ต้องการ
  }
  
  // save(item: any) {
  //   item.USER_ID = this.user.USER_ID;
  //   console.log('save');
  //   item.ORD_TYPESELL == 1 ? item.ORD_STUS = 0 : '';
  //   item.ORD_TYPESELL == 2 ? item.ORD_STUS = 0 : '';

  //   console.log(item);
  //   this.apiService.getdata('/STK/show_ord.php', 'save', 'STK_ORD', item)
  //     .pipe(first())
  //     .subscribe(
  //       (data: any) => {
  //         console.log(data);
  //         if (data.status == 1) {
  //           this.apiService.getdata('/STK/show_ord.php', 'view_ORD', 'STK_ORD', { ORD_ID: data.ORD_ID })
  //             .pipe(first())
  //             .subscribe(
  //               (savedData: any) => {
  //                 console.log(savedData);
  //                 this.dataview = savedData.data;
  //                 alert("ข้อมูลสำเร็จ");
  //               },
  //               (err: any) => {
  //                 console.log(err);
  //                 alert("ไม่สามารถดึงข้อมูลล่าสุดได้");
  //               });
  //         } else {
  //           this.dataview = null;
  //           alert("เพิ่มข้อมูลไม่สำเร็จ");
  //         }
  //       },
  //       (err: any) => {
  //         this.dataview = null;
  //         console.log(err);
  //         alert("ไม่สามารถติดต่อฐานข้อมูลได้");
  //       });
  // }
 

  

  updatastus(item:any){
    console.log(item)
    let prm={ ORD_ID: this.formord.ORD_ID };
    console.log(prm);
    this.apiService.getdata('/STK/show_payment.php', 'payupdate', 'STK_ORD',item )
    .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(this.datapay);
          if (data.status == 1) {
            // Assign the data to the datapay property of formdd
            this.dataview = data.data;
            this.dataview = this.getdata();
          } else {
            this.dataview = null;
          }
        },
        (err: any) => {
          this.dataview = null;
        });
  }

  updatastus1(item:any){
    console.log(item)
    let prm={ ORD_ID: this.formord.ORD_ID };
    console.log(prm);
    this.apiService.getdata('/STK/show_payment.php', 'payupdate11', 'STK_ORD',item )
    .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(this.datapay);
          if (data.status == 1) {
            // Assign the data to the datapay property of formdd
            this.dataview = data.data;
            this.dataview = this.getdata();
          } else {
            this.dataview = null;
          }
        },
        (err: any) => {
          this.dataview = null;
        });
  }

  updatastus2(item:any){
    console.log(item)
    let prm={ ORD_ID: this.formord.ORD_ID };
    console.log(prm);
    this.apiService.getdata('/STK/show_payment.php', 'payupdate22', 'STK_ORD',item )
    .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(this.datapay);
          if (data.status == 1) {
            // Assign the data to the datapay property of formdd
            this.dataview = data.data;
            this.dataview = this.getdata();
          } else {
            this.dataview = null;
          }
        },
        (err: any) => {
          this.dataview = null;
        });
  }
  
  yespay(item:any) {
    item.USER_ID = this.user.USER_ID;
    this.formord = item;
    console.log(this.formord);
    this.apiService.getdata('/STK/show_payment.php', 'view_paydd', 'STK_ORDD', { ORD_ID: this.formord.ORD_ID })
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log("getdyespay");
          if (data.status == 1) {
            this.dataview =  data.data;
          } else {
            this.dataview = null;
          }
        },
        (err: any) => {
          this.dataview = null;
        });

  }
  

}

