import { Injectable } from "@angular/core";
@Injectable({

providedIn:'root'
})
export class Apiservice{

    constructor(){}

public canActivate():boolean{
let token = localStorage.getItem('Captcha')
console.log(token);
if (token!="undefined") {
    return true  
}else{

    return false
}
    
}

}

