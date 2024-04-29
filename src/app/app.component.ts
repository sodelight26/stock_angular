import { Component ,OnInit} from '@angular/core';
import { TokenStorageService } from './_service/token-storage.service';
import { AuthService } from './_service/auth.service';
import { first } from 'rxjs/operators';

import { ApiPdoService } from 'src/app/_service/pdo-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'stock-ruts';
  isLoggedIn = false;
  username?: string;
  isLoginFailed:any;
  dataview : any;
  user : any;

  constructor(
    private tokenStorageService: TokenStorageService,
    public authService: AuthService,
    private tokenStorage : TokenStorageService,
    private apiService: ApiPdoService,

  ) {}

  ngOnInit(): void {
    this.user= this.tokenStorage.getUser();
    this.getdata();
  if (this.isLoggedIn) {
    const user = this.tokenStorageService.getUser();
    this.username = user.username;
    //console.log(user);
  }

}

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  getdata(){
    this.apiService.getdata('/STK/show_user.php', 'view_user', 'STK_USER', this.user)
    .pipe(first())
    .subscribe(
      (data: any) => {
      console.log(data);
      console.log("getdata");
        if (data.status==1) {
          this.dataview = data.data[0].USER_NAME;
        }else{
          this.dataview = null;
        }
      },
      (err:any) =>{
        this.dataview = null;
      });

  }
}



