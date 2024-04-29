import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TokenStorageService } from '../../_service/token-storage.service';
import { ApiPdoService } from 'src/app/_service/pdo-api.service';
import { first, Subject } from 'rxjs';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas';
import { TextOptions } from 'jspdf';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() paymentData: any;
  @Output() paymentDataUpdated = new EventEmitter<void>();
  dataview: any;
  dataview2: any;
  dataview3: any;
  datapay: any[] = [];
  formdd: any = {};
  colr_name: any;
  item: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  el: any;


  constructor(
    private apiService: ApiPdoService,
  ) { }

  ngOnInit(): void {
    // this.getdatadd() ;
    // this.displayData();
    this.getdata();
    // this.getpaydd();
    this.paymentDataUpdated.emit();

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['paymentData']) {
      this['paymentData'] = changes['paymentData'].currentValue;
    }
  }




  changselecttypesell(item: Event) {
    const nt = (item.target as HTMLInputElement).value;
    console.log(nt);
  }

  // downloadPDF(): void {
  //   const doc = new jsPDF();

  //   // Add the HTML content to the PDF
  //   doc.html(document.getElementById('content'), {
  //     callback: function () {
  //       // Save the PDF
  //       doc.save('document.pdf');
  //     }
  //   });
  // }


  downloadPDF(): void {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Set document properties
    doc.setProperties({
      title: 'Receipt',
      author: 'Your Name',
      subject: 'Receipt document',
      keywords: 'receipt, pdf, jsPDF',
      creator: 'jsPDF'
    });
    // Add border
    doc.addFont('../assets/fonts/THSarabunNew.ttf', 'THSarabunNew', 'normal');
    doc.setFont('THSarabunNew');
    doc.setFontSize(16);
    
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, 10, 190, 277);

    // Add header text
    doc.text(this.formdd.TYPE_ORDNAME, 120, 20, { align: 'right' });

    // Add order ID
    doc.text('เลขที่ใบสั่งซื้อ:', 150, 30, { align: 'right' });
    doc.text(this.formdd.ORD_ID, 180, 30, { align: 'right' });

    // Add order date
    doc.text('วันที่สั่งซื้อ:', 150, 40, { align: 'right' });
    doc.text(this.formdd.ORD_DAT, 190, 40, { align: 'right' });

    // Add line separator
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    // Add customer name and address
    doc.text('ชื่อลูกค้า:', 20, 55);
    doc.text(this.formdd.CUS_NAME, 45, 55);
    doc.text('ที่อยู่:', 20, 65);
    doc.text(this.formdd.CUS_ADR, 45, 65);

    // Add payment and status information
    doc.text('ช่องทางชำระ:', 20, 75);
    doc.text(this.formdd.STUS_TYPE, 45, 75);
    doc.text('สถานะชำระ:', 105, 75);
    doc.text(this.formdd.STUS_NAME, 130, 75);
    doc.text('ชื่อผู้รับเงิน:', 150, 140);
    doc.text(this.formdd.USER_NAME, 170, 140);

    // Add table headers and data
    
    const tableHeaders = ['รหัสสินค้า', 'ชื่อสินค้า', 'ประเภท', 'ไซส์', 'จำนวน', 'ราคาขาย', 'ราคารวม'];
    const tableData = [];

    this.formdd.datapay.forEach((item: { PRD_ID: any; PRD_NAME: any; TYPE_NAME: any; SIZE_NAME: any; ORDD_NUM: number; ORDD_PRICE: number; }) => {
      tableData.push([item.PRD_ID, item.PRD_NAME, item.TYPE_NAME, item.SIZE_NAME, item.ORDD_NUM, item.ORDD_PRICE, item.ORDD_PRICE * item.ORDD_NUM,]);
    });

    tableData.push(['', '', '', '', '', 'รวมทั้งสิ้น', this.calculateSum(),]);

    autoTable(doc, {
      startY: 90,
      head: [tableHeaders],
      body: tableData,
      margin: { top: 50},
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 36 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 },
      },
      headStyles: {
        font: 'THSarabunNew',
        fontStyle: 'normal',
        fontSize: 14
      },
      bodyStyles: {
        font: 'THSarabunNew',
        fontStyle: 'normal',
        fontSize: 12,
        minCellHeight: 10,
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },

      tableLineColor: [0, 0, 0],
   
      
    });

    // Save the document
    doc.save('receipt.pdf');
  }

  getdata() {
    this.apiService.getdata('/STK/show_payment.php', 'view_pay', 'STK_ORD', '')
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          console.log("getdata");
          if (data.status == 1) {
            this.dtTrigger.next(true);
            this.dataview = data.data;
          } else {
            this.dataview = null;
          }
          // Call updd() with the first item in dataview as parameter
          if (this.dataview && this.dataview.length > 0) {
            this.updd(this.dataview[0]);
          }
        },
        (err: any) => {
          this.dataview = null;
        });
  }

  checkProductStatus(item: any): string {
    if (item.STUS_NAME == 'รอดำเนินการ') {
      this.colr_name = 'primary';
      return ` รอดำเนินการ`;
    } else if (item.STUS_NAME == 'ชำระแล้ว') {
      this.colr_name = 'success';
      return ` ชำระแล้ว`;
    } else if (item.STUS_NAME == 'ยังไม่ชำระ') {
      this.colr_name = 'warning';
      return ` ยังไม่ชำระ`;
    }
    return '';
  }

  updd(item: any) {
    console.log("getupdd")
    this.formdd = item;
    console.log(this.formdd);
    console.log(this.datapay);
    this.apiService.getdata('/STK/show_payment.php', 'view_paydd', 'STK_ORDD', { ORD_ID: this.formdd.ORD_ID })
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            // Assign the data to the datapay property of formdd
            this.formdd.datapay = data.data;

          } else {
            this.formdd.datapay = null;
          }
          
        },
        (err: any) => {
          this.formdd.datapay = null;
        });
  }



  calculateSum(): number {
    if (!this.formdd || !this.formdd.datapay) {
      return 0;
    }
    return this.formdd.datapay.reduce((acc: number, item: { ORDD_NUM: number; ORDD_PRICE: number; }) => acc + (item.ORDD_NUM * item.ORDD_PRICE), 0);
  }

  updatastus(item: any) {
    console.log(item)
    let prm = { ORD_ID: this.formdd.ORD_ID };
    console.log(prm);
    this.apiService.getdata('/STK/show_payment.php', 'payupdate', 'STK_ORD', item)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(this.datapay);
          if (data.status == 1) {
            // Assign the data to the datapay property of formdd
            this.dataview = this.getdata();
           
          } else {
            this.dataview = null;
          }
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'ยืนยันการชำระสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        },
        (err: any) => {
          this.dataview = null;
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ยืนยันการชำระไม่สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        });
  }

  updatastus1(item: any) {
    console.log(item)
    let prm = { ORD_ID: this.formdd.ORD_ID };
    console.log(prm);
    this.apiService.getdata('/STK/show_payment.php', 'payupdate11', 'STK_ORD', item)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(this.datapay);
          if (data.status == 1) {
            // Assign the data to the datapay property of formdd
            this.dataview = this.getdata();
           
          } else {
            this.dataview = null;
          }
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'ยืนยันการสั่งซื้อสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        },
        (err: any) => {
          this.dataview = null;
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ยืนยันการสั่งซื้อไม่สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        });
  }

  updatastus2(item: any) {
    console.log(item)
    let prm = { ORD_ID: this.formdd.ORD_ID };
    console.log(prm);
    this.apiService.getdata('/STK/show_payment.php', 'payupdate22', 'STK_ORD', item)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(this.datapay);
          if (data.status == 1) {
            // Assign the data to the datapay property of formdd
            this.dataview = this.getdata();
          } else {
            this.dataview = null;
          }
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'ยืนยันการชำระสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        },
        (err: any) => {
          this.dataview = null;
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ยืนยันการชำระไม่สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        });
  }

  // getpaydd() {
  //   this.apiService.getdata('/STK/show_payment.php', 'view_paydd', 'STK_ORDD', '')
  //     .pipe(first())
  //     .subscribe(
  //       (data: any) => {
  //         console.log(data);
  //         console.log("getpaydd");
  //         if (data.status == 1) {
  //           this.datapay = data.data;
  //         } else {
  //           this.datapay = null;
  //         }
  //       },
  //       (err: any) => {
  //         this.datapay = null;
  //       });
  // }



}



