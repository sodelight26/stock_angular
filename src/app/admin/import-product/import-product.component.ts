import { AfterViewInit, Component, ElementRef, ViewChild, OnInit, Inject } from '@angular/core';
import { ApiPdoService } from '../../_service/pdo-api.service';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-import-product',
  templateUrl: './import-product.component.html',
  styleUrls: ['./import-product.component.scss']
})
export class ImportProductComponent implements OnInit {
  dataview: any;
  data: any = {};
  // form_add: any = {};
  datatype: any;
  datasize: any;
  formedit: any = {};
  btnclick: any;
  h_name: any;
  e_name: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private apiService: ApiPdoService,
  ) { }

  
  ngOnInit(): void {
    this.gettype();
    this.getsize();
    this.displayData();
    this.getdata();
  }
  
  displayData() {
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


    saveprd(form: any) {
      console.log(form);
      console.log('this.btnclick');
      let sql = '';
      if (this.btnclick == 'create') {
        sql = 'STK_PRD_CREATE';
      } else {
        sql = 'STK_PRD_UPDATE';
      }
      console.log(sql);
      this.apiService.getdata('/STK/show_product.php', 'save', sql, form)
        .pipe(first())
        .subscribe(
          (data: any) => {
            console.log(data);
            if (data.status == 1) {
              this.dataview = this.getdata();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'สำเร็จ',
                showConfirmButton: false,
                timer: 1500
              })
            } else {
              this.dataview = null;
            }
  
          },
          (err: any) => {
            this.dataview = null;
            console.log('error!');
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'ไม่สำเร็จ',
              showConfirmButton: false,
              timer: 1500
            })
          });
  
    }

  gettype() {
    // let parm={'aa':''};
    this.apiService.getdata('/STK/show_type.php', 'view_type', '', '')
    .pipe(first())
    .subscribe(
      (data: any) => {
        console.log(data);
        if (data.status == '1') {
          this.datatype = data.data;
        } else {
          this.datatype= null;
        }
      },
      (err: any) => {
        console.log(err);
      });
}

  getsize() {
    // let parm={'aa':''};
    this.apiService.getdata('/STK/show_size.php', 'view_size', '', '')
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == '1') {
            this.datasize = data.data;
          } else {
            this.datasize= null;
          }
        },
        (err: any) => {
          console.log(err);
        });
  }


  changselecttype(item: Event) {
    const tt = (item.target as HTMLInputElement).value;
    console.log(tt);
  }
  changselectsize(item: Event) {
    const ss = (item.target as HTMLInputElement).value;
    console.log(ss);
  }

  openmodel_add(item: any) {
    console.log(item);
    this.btnclick = 'create';
    this.h_name = "เพิ่มสินค้า"
    this.e_name = "บันทึก"
  }

  editclick(edit: any) {
    console.log(edit);
    this.btnclick = 'edit';
    this.formedit = edit;
    this.h_name = "แก้ไขสินค้า"
    this.e_name = "แก้ไข"
  }

  search() {
    let parm = { 'search': this.formedit };
    console.log(this.formedit)
    this.apiService.getdata('/STK/show_product.php', 'search', 'STK_PRD', parm)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.data = data.data;
          } else {
            this.data = null;
          }
        },
        (err: any) => {
          this.data = null;
          console.log('error!');
        }
      );
  }

  delete(item: any) {
    this.formedit = item;
    console.log(item)
    let parm = { 'PRD_ID': item }
    this.apiService.getdata('/STK/show_product.php', 'delete', 'STK_PRD', parm)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.dataview = this.getdata();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500
            })
          } else {
            this.dataview = null;
          }

        },
        (err: any) => {
          this.dataview = null;
          console.log('error!');
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ลบข้อมูลไม่สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        });
  }
  

 
}