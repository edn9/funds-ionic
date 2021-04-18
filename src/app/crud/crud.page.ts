import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Value } from '../models/value';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {
  oldValue;
  value = new Value();
  type;

  types = [{ value: 'money', name: 'Money' },
  { value: 'credit', name: 'Credit' },
  { value: 'debit', name: 'Debit' },
  { value: 'transaction', name: 'Transaction' },
  { value: 'pix', name: 'Pix' },
  { value: 'paypal', name: 'Paypal' },
  { value: 'picpay', name: 'PicPay' },
  { value: 'other', name: 'Other' },];

  constructor(
    public modal: ModalController,
    public datePipe: DatePipe,
    public alertController: AlertController,
  ) {
  }

  ngOnInit() {
    console.log('Type - ', this.type, 'Value - ', this.oldValue);

    if (this.oldValue) {
      this.value = this.oldValue;
    } else {
      this.value.type = this.type;
      this.value.value = 0;
      this.value.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.value.time = this.datePipe.transform(new Date(), 'HH:mm');
      this.value.category = '';
      this.value.description = '';
    }
    console.log('CURRENT ', this.value);
  }

  close() {
    this.modal.dismiss();
  }

  save() {
    console.log('Save - ', this.value);
    this.value.id = uuidv4();
    let data = { action: 'save', value: this.value };
    this.modal.dismiss(data);
  }

  update() {
    console.log('Update - ', this.value);
    let data = { action: 'update', value: this.value };
    this.modal.dismiss(data);
  }


  async delAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Atention',
      message: `Are you sure you want to delete this entry?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.delete();
          }
        }
      ]
    });

    await alert.present();
  }


  delete() {
    console.log('Delete - ', this.value);
    let data = { action: 'delete', value: this.value };
    this.modal.dismiss(data);
  }

  logIt(ev) {
    console.log(ev);
  }

}
