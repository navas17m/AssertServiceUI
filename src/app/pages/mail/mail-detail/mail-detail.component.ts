import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Mail, MailService }  from '../mail.service';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'az-mail-detail',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mail-detail.component.html'
})
export class MailDetailComponent implements OnInit {
    public mail: Mail;

    @Output() replyMessage = new EventEmitter();

    constructor(private service: MailService,
                private route: ActivatedRoute,
                private router: Router){     
    } 

    ngOnInit() {
        this.route.params.pipe(
        switchMap((params: Params) => this.service.getMail(+params['id'])))
        .subscribe((mail: Mail) => this.mail = mail);
    }

    goToReply(mail): void {
        this.replyMessage.emit(mail);
    }

    trash(id) {
        this.service.getMail(id).then((mail) => {
            mail.trash = true;
            mail.sent = false;
            mail.draft = false; 
            mail.starred = false;           
        });        
        this.router.navigate(['pages/mail/mail-list/inbox']);
    }    

}