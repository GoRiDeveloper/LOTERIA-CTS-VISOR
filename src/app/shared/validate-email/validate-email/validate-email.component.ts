import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-validate-email',
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.sass']
})
export class ValidateEmailComponent implements OnInit {
  public codigo:string = '';
  public isInvalidCode:boolean = false;
  public isValidCode:boolean = false
  public isLoading:boolean = false;
  constructor(private _authService:AuthService, private _activateRoute: ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this._activateRoute.paramMap.subscribe(params => {
    this.codigo = params.get('codigo') || '';

    if (this.codigo == null || this.codigo == undefined || this.codigo =='') {
      this.router.navigateByUrl('/')
    }
    });
  }

  handleValidate(){
    this.isLoading = true
    this._authService.validateEmailCode(this.codigo).subscribe({
      next:response =>{

        this.isLoading = false
        if (response.success == 0) {
          this.isInvalidCode = true;
        }else if (response.success == 1) {
          this.isValidCode = true;
          setTimeout(() => {
            this.router.navigateByUrl('/')
          }, 2000);
        }
        
      },error:error =>{
        this.isLoading = false

      }
    })
  }

}
