import { Component, OnInit } from '@angular/core';
import { Value } from '../models/value';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController } from '@ionic/angular';
import { CrudPage } from '../crud/crud.page';
import { FilterValuesPipe } from '../pipes/filter-values.pipe';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  value = new Value();
  values = [];

  constructor(
    public storage: Storage,
    public modalController: ModalController,
    public filterValues: FilterValuesPipe,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.storage.get('values').then((res) => {
      if (res) {
        this.values = res;
        console.log(this.values);
      } else {
        console.log('No Values yet');
      }
    });

    console.log('entered')
  }

  async crudValues(type: string, value?) {

    const modal = await this.modalController.create({
      component: CrudPage,
      componentProps: {
        type: type,
        oldValue: value,
      }
    });

    modal.onDidDismiss().then((res) => {

      if (res.data) {
        if (res.data.action) {
          if (res.data.action == 'save') {
            this.values.push(res.data.value);
            this.setStorage();
          }
          if (res.data.action == 'update') {

            let updatedItems = this.values.map(val => val.id === res.data.id ? res.data : val);

            this.values = updatedItems;
            this.storage.set('values', this.values);

          }
          if (res.data.action == 'delete') {
            this.delValue(res.data.value);
          }
        }
      }
    })

    return await modal.present();
  }

  setStorage() {
    this.storage.set('values', this.values);
  }

  calcAdd() {
    let add = this.filterValues.transform(this.values, 'Add');
    return add;
  }

  calcSub() {
    let sub = this.filterValues.transform(this.values, 'Sub');
    return sub;
  }

  calcTotal() {
    let total = this.calcAdd() - this.calcSub();
    return total;
  }

  updateVal(value) {
    console.log('value to update', value)
  }

  async delAlert(value) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Atention',
      message: `Are you sure you want to delete the entry of value R$${value.value}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.delValue(value);
          }
        }
      ]
    });

    await alert.present();
  }

  delValue(value) {
    console.log('to delete', value, value.id, value.value, value['id']);
    let newValues = this.values.filter((v) => {
      return value.id != v.id;
    })
    console.log('new values without the deleted one', newValues);
    this.values = newValues;
    this.storage.set('values', this.values);
  }

}
