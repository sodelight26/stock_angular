import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ApiPdoService } from 'src/app/_service/pdo-api.service';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'jspdf-font';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})

export class ReportComponent {
  dataview: any;
  sum: any;
  salesAmounts: any;
  item: any = {};
  
  startDate: Date | undefined;
  endDate: Date | undefined;
  constructor(
    private apiService: ApiPdoService,
  ) { }


  ngOnInit(): void {
    this.getdata();
    

  }

  


  exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.  dataview);
    const workbook = XLSX.utils.book_new();

    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');
  }

  getdata() {
    console.log('dataprd')
    this.apiService.getdata('/STK/report.php', 'view_rep_prd', 'STK_PRD', '')
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == '1') {
            this.dataview = data.data;
          } else {
            this.dataview = null;
          }

        },
        (err: any) => {
          this.dataview = null;
        });
  }

  getDataDate() {
    console.log(this.item.startDate);
    console.log(this.item.endDate);
    const startDate = new Date(this.item.startDate).toISOString().slice(0, 10);
    const endDate = new Date(this.item.endDate).toISOString().slice(0, 10);
    this.apiService.getdata('/STK/report.php', 'view_rep_prd', 'STK_PRD', 'item').subscribe(
      (data) => {
        console.log(data);
        this.dataview = null;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  
  summary() {
    this.apiService.getdata('/STK/smonth.php', 'smonth_sum', 'STK_PRD', '')
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == '1') {
            this.dataview = data.data;
          } else {
            this.dataview = null;
          }

        },
        (err: any) => {
          this.dataview = null;
        });
  }

  sumSMONTH_NUM(SMONTH_NUM: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].SMONTH_NUM != null && this.dataview[i].SMONTH_NUM != undefined) {
        sum += parseInt(this.dataview[i].SMONTH_NUM);
      }
    }
    return sum;
  }
  sumPRD_PRICE(PRD_PRICE: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].PRD_PRICE != null && this.dataview[i].PRD_PRICE != undefined) {
        sum += parseInt(this.dataview[i].PRD_PRICE);
      }
    }
    return sum;
  }
  sumSOLD_AMOUNT_CASH(SOLD_AMOUNT_CASH: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].SOLD_AMOUNT_CASH != null && this.dataview[i].SOLD_AMOUNT_CASH != undefined) {
        sum += parseInt(this.dataview[i].SOLD_AMOUNT_CASH);
      }
    }
    return sum;
  }

  sumSOLD_AMOUNT_CREDIT(SOLD_AMOUNT_CREDIT: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].SOLD_AMOUNT_CREDIT != null && this.dataview[i].SOLD_AMOUNT_CREDIT != undefined) {
        sum += parseInt(this.dataview[i].SOLD_AMOUNT_CREDIT);
      }
    }
    return sum;
  }

  sumSOLD_AMOUNT_TOTAL(SOLD_AMOUNT_TOTAL: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].SOLD_AMOUNT_TOTAL != null && this.dataview[i].SOLD_AMOUNT_TOTAL != undefined) {
        sum += parseInt(this.dataview[i].SOLD_AMOUNT_TOTAL);
      }
    }
    return sum;
  }
  sumSOLD_PRD_NUMB(PRD_NUMB: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].PRD_NUMB != null && this.dataview[i].PRD_NUMB != undefined) {
        sum += parseInt(this.dataview[i].PRD_NUMB);
      }
    }
    return sum;
  }
  sumSOLD_PRICE_CASH(SOLD_PRICE_CASH: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].SOLD_PRICE_CASH != null && this.dataview[i].SOLD_PRICE_CASH != undefined) {
        sum += parseInt(this.dataview[i].SOLD_PRICE_CASH);
      }
    }
    return sum;
  }
  sumSOLD_PRICE_CREDIT(SOLD_PRICE_CREDIT: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].SOLD_PRICE_CREDIT != null && this.dataview[i].SOLD_PRICE_CREDIT != undefined) {
        sum += parseInt(this.dataview[i].SOLD_PRICE_CREDIT);
      }
    }
    return sum;
  }
  sumSOLD_PRICE_TOTAL(SOLD_PRICE_TOTAL: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].SOLD_PRICE_TOTAL != null && this.dataview[i].SOLD_PRICE_TOTAL != undefined) {
        sum += parseInt(this.dataview[i].SOLD_PRICE_TOTAL);
      }
    }
    return sum;
  }
  sumPRD_PCOST(PRD_PCOST: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].PRD_PCOST != null && this.dataview[i].PRD_PCOST != undefined) {
        sum += parseInt(this.dataview[i].PRD_PCOST);
      }
    }
    return sum;
  }
  sumTOTAL_COST(TOTAL_COST: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].TOTAL_COST != null && this.dataview[i].TOTAL_COST != undefined) {
        sum += parseInt(this.dataview[i].TOTAL_COST);
      }
    }
    return sum;
  }
  sumPROFIT(PROFIT: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      if (this.dataview[i].PROFIT != null && this.dataview[i].PROFIT != undefined) {
        sum += parseInt(this.dataview[i].PROFIT);
      }
    }
    return sum;
  }

  sumOfColumn(columnName: string) {
    let sum = 0;
    for (let i = 0; i < this.dataview.length; i++) {
      sum += parseInt(this.dataview[i][columnName]);
    }
    return sum;
  }
}

