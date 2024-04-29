import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ApiPdoService } from 'src/app/_service/pdo-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  dataview: any;
  datatype: any;
  datasize: any;
  colr_name: any;
  colr_name2: any;
  products: any[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private apiService: ApiPdoService,
  ) { }


  ngOnInit(): void {
    this.gettype();
    this.getsize();
    this.getdata();
    this.displayData();
    
  }

 
  displayData() {
    console.log('datatable')
    this.dtOptions = { pagingType: 'full_numbers', pageLength: 10 };
    this.apiService.getdata('/STK/show_product.php', 'view_prd', 'STK_PRD', '')
    .subscribe(
      (data: any) => {
        if (data.status == '1') {
          this.dataview = data.data;
          this.dtTrigger.next(true);
        } else {
          console.log(data.message);
        }
      },
      error => {
        console.log(error);
      }
    );
      }
      
      getdata() {
        console.log('dataget')
        this.apiService.getdata('/STK/show_product.php', 'view_prd', 'STK_PRD', '')
          .pipe(first())
          .subscribe(
            (data: any) => {
              console.log(data);
              if (data.status == '1') {
                this.dataview = data.data;
                this.dtTrigger.next(true);
              } else {
                this.dataview = null;
              }
            },
            (err: any) => {
              console.log(err);
            });
      }
     

      gettype() {
        // let parm={'aa':''};
        this.apiService.getdata('/STK/show_type.php', 'view_type', '', '')
          .pipe(first())
          .subscribe(
            (data: any) => {
              console.log("gettype");
              console.log(data);
              if (data.status == '1') {
                this.datatype = data.data;
              } else {
                this.datatype = null;
              }
            },
            (err: any) => {
              this.datatype = null;
              //this.toastr.error("ไม่สามารถติดต่อฐานข้อมูลได้","แจ้งเตือน");
            });
      }
    
      getsize() {
        // let parm={'aa':''};
        this.apiService.getdata('/STK/show_size.php', 'view_size', '', '')
          .pipe(first())
          .subscribe(
            (data: any) => {
              console.log("getsize");
              console.log(data);
              if (data.status == '1') {
                this.datasize = data.data;
              } else {
                this.datasize = null;
              }
            },
            (err: any) => {
              this.datasize = null;
              //this.toastr.error("ไม่สามารถติดต่อฐานข้อมูลได้","แจ้งเตือน");
            });
      }

      checkProductStatus(item: any): string {
        if (item.PRD_NUMB <= 50) {
          this.colr_name = 'warning';
          return ` ไม่เพียงพอ`;
        }else if (item.PRD_NUMB > 51){
          this.colr_name = 'success';
          return ` เพียงพอ`;
        } 
        return '';
      }
     
}
