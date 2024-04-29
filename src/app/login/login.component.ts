import { Component, OnInit } from '@angular/core';
import { ApiPdoService } from '../_service/pdo-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../_service/auth.service';
import { TokenStorageService } from '../_service/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading:any;
  key:any = {};
  form:any = {username: null,password: null};
  isLoggedIn = false;
  isLoginFailed = false;
  constructor(
    private apisrv: ApiPdoService,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.key = this.tokenStorage.getVersion();
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate(['/product'])
    }
  }

  onSubmit(): void {
    this.loading = true;
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe(
      data => {
        console.log(data.accessToken);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        const ss = this.tokenStorage.getUser();
        console.log(ss);
        //console.log(this.tokenStorage.getToken);
        //console.log(data.jwt);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
       // this.roles = this.tokenStorage.getUser().permission;
        this.reloadPage();
      },
      err => {
        //this.errorMessage = data;
       // this.toastr.warning('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง','แจ้งเตือน');
        this.isLoginFailed = true;
        this.loading = false;
      }
    );
  }
  reloadPage(): void {
    window.location.reload();
    
  }


}
