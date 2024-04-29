import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ApiPdoService } from 'src/app/_service/pdo-api.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-import-type',
  templateUrl: './import-type.component.html',
  styleUrls: ['./import-type.component.scss']
})
export class ImportTypeComponent {
  dataview:any;
  dataview2:any;
  totalItems:any;
  form_add:any={};

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private apiService: ApiPdoService,

  ) { }

  ngOnInit(): void {
    this.displayData();
    this.getdata();
  }

  
  displayData(): void {
    this.dtOptions = { pagingType: 'full_numbers', pageLength: 10 };
    this.apiService.getdata('/STK/show_type.php', 'view_type', 'STK_TYPE', '')
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
  getdata(){
    this.apiService.getdata('/STK/show_type.php', 'view_type', 'STK_TYPE', '')
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
  save(item: any) {
    //console.log(item);
    this.apiService.getdata('/STK/show_type.php', 'save', 'STK_TYPE', item)
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

  update(item:any){
    this.form_add = item;
  }

  getDataUpdte(item: any) {
    console.log(item);
     this.apiService.getdata('/STK/show_type.php', 'update', '', item)
       .pipe(first())
       .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.dataview = this.getdata();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'แก้ไขข้อมูลสำเร็จ',
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
            title: 'ก้ไขข้อมูลสำเร็จไม่สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        });
  }

  delete(item: any) {
    this.form_add = item;
    console.log(item);
    let parm={'TYPE_ID':item}
    this.apiService.getdata('/STK/show_type.php', 'delete', 'STK_TYPE', parm)
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
            title: 'ลบข้อมูลสำเร็จไม่สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        });

  }

}
