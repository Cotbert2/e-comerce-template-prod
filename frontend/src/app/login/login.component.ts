import { Component, Input, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    PanelModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    FormsModule

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  logedUserData : any = {};

  ngOnInit(): void {
    //get logged user from local storage
    this.logedUserData = JSON.parse(localStorage.getItem('loggedUser') || '{}');
  }

  @Input() isLogin : boolean = false;
  @Input() isLogged : boolean = false;


  email : string = ""
  password : string = ""
  confirmPassword : string = ""
  name : string = ""
  phone : string = ""

  constructor(
    private messageService : MessageService,
    private authService : AuthService
  ) { }


  switchToSignUp() : void {
    this.isLogin = !this.isLogin;
  }

  handleSignUp() : void {

    //valdiations
    if(this.email == "" || this.password == "" || this.confirmPassword == "" || this.name == "" || this.phone == ""){
      this.messageService.add({severity:'error', summary:'Error', detail:'All fields are required'});
      return;
    }

    //validate email

    if(!this.email.includes('@')){
      this.messageService.add({severity:'error', summary:'Error', detail:'Invalid email'});
      return;
    }

    //validate password
    if(this.password.length < 6){
      this.messageService.add({severity:'error', summary:'Error', detail:'Password must be at least 6 characters'});
      return;
    }

    //validate password confirmatino

    if(this.password != this.confirmPassword){
      this.messageService.add({severity:'error', summary:'Error', detail:'Passwords do not match'});
      return;
    }

    const dataToSend = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      role: 'common-user'
    };

    this.authService.singup(dataToSend).subscribe
    (
      (response) => {
        this.messageService.add({severity:'success', summary:'Success', detail:'Account created successfully'});
        console.log(response);
        this.isLogin = true;
      },
      (error) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'An error occurred while creating account'});
        console.log(error);
      }
    )

    this.messageService.add({severity:'success', summary:'Success', detail:'Account created successfully'});

  }



  handleLogIn() : void {
    //valiudations for email @ password
    if(this.email == "" || this.password == ""){
      this.messageService.add({severity:'error', summary:'Error', detail:'All fields are required'});
      return;
    }

    const dataToSend = {
      email: this.email,
      password: this.password
    }

    this.authService.login(dataToSend).subscribe
    (
      (response : any) => {
        if (response.data.login.id){
          this.messageService.add({severity:'success', summary:'Success', detail:'Login successfull'});
          console.log(response);
          //save response as logged user in the local storage

          localStorage.setItem('loggedUser', JSON.stringify(response.data.login));
          this.logedUserData = JSON.parse(localStorage.getItem('loggedUser') || '{}');
        }else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Invalid email or password'});
          console.log(response);
        }
      },
      (error) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'An error occurred while logging in'});
        console.log(error);
      }
    )
    


  }


  handleLogOut() : void {
    localStorage.removeItem('loggedUser');
    this.isLogged = false;
    this.ngOnInit();
  }






}
