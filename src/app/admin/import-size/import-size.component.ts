import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ApiPdoService } from 'src/app/_service/pdo-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-import-size',
  templateUrl: './import-size.component.html',
  styleUrls: ['./import-size.component.scss']
})

export class ImportSizeComponent implements OnInit {
  dataview: any;
  dataview2: any;
  totalItems: any;
  form_add: any = {};
data: any = {};

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private apiService: ApiPdoService,) { }

  ngOnInit(): void {
    this.getdata();
    this.displayData();
  }


  // getdata() {
  //   this.apiService.getdata('/STK/show_size.php', 'view_size', 'STK_SIZE', '')
  //     .pipe(first())
  //     .subscribe(
  //       (data: any) => {
  //         console.log(data);
  //         if (data.status == 1) {
  //           this.dataview = data.data.map((d: any) => {
  //             return {
  //               SIZE_ID: d.SIZE_ID,
  //               SIZE_NAME: d.SIZE_NAME
  //             };
  //           });
  //         } else {
  //           this.dataview = null;
  //         }
  //       },
  //       (err: any) => {
  //         this.dataview = null;
  //       });
  // }

  getdata() {
    this.apiService.getdata('/STK/show_size.php', 'view_size', 'STK_SIZE', '')
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

  

  displayData() {
    this.dtOptions = { pagingType: 'full_numbers', pageLength: 10 };
    this.apiService.getdata('/STK/show_size.php', 'view_size', 'STK_SIZE', '')
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


 
  // save(item:any){
  //   console.log(item);
  //   this.apiService.getdata('/STK/show_size.php', 'save', 'STK_SIZE', '')
  //   .pipe(first())
  //   .subscribe(
  //     (data: any) => {
  //     console.log(data);
  //       if (data.status==1) {
  //         this.dataview = data.data;
  //       }else{
  //         this.dataview = null;
  //       }
  //     },
  //     (err:any) =>{
  //       this.dataview = null;
  //       // this.toastr.error("ไม่สามารถติดต่อฐานข้อมูลได้","แจ้งเตือน");
  //     });

  // }

  save(item: any) {
    //console.log(item);
    this.apiService.getdata('/STK/show_size.php', 'save', 'STK_SIZE', item)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.dataview = this.getdata();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'เพิ่มข้อมูลไซส์สำเร็จ',
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
            title: 'เพิ่มข้อมูลไซส์ไม่สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        });

  }

  update(item: any) {
    this.form_add = item;
  }

  getDataUpdte(item: any) {
    console.log(item);
    this.apiService.getdata('/STK/show_size.php', 'update', '', item)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.dataview = this.getdata();
          } else {
            this.dataview = null;
          }

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'แก้ไขข้อมูลไซส์สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        },
        (err: any) => {
          this.dataview = null;
          // console.log('error!');
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'แก้ไขข้อมูลไซส์ไม่สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
      
          // this.toastr.error("ไม่สามารถติดต่อฐานข้อมูลได้","แจ้งเตือน");
        }
      );
  }

  delete(item: any) {
    this.form_add = item;
    console.log(item);
    let parm = { 'SIZE_ID': item }
    this.apiService.getdata('/STK/show_size.php', 'delete', 'STK_SIZE', parm)
      .pipe(first())
      .subscribe(
      (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.dataview = this.getdata();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'เพิ่มข้อมูลไซส์สำเร็จ',
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
            title: 'เพิ่มข้อมูลไซส์ไม่สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        });
  }

  search() {
    let parm = { 'search': this.form_add };
    this.apiService.getdata('/STK/show_product.php', 'search', 'STK_PRD', parm)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.dataview = data.data;
          } else {
            this.dataview = null;
          }
        },
        (err: any) => {
          this.dataview = null;
          console.log('error!');
        }
      );
  }


}