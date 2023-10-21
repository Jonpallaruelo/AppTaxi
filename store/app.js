// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    showNotification: false,
    adressData: {
      latitudeOrigin: 0,
      longitudeOrigin: 0,
      descriptionOrigin: '',
      latitudeDestiny: 0,
      longitudeDestiny:0,
      descriptionDestiny: '',
    },
    mapMode: false,
    isActiveBtnMapOrigin: false,
    isActiveBtnMapDestiny: false,
    changeMouseIcon : false,
  }),

  actions: {
    onOrOffNotification() {
      this.showNotification = !this.showNotification
    },
    setNewOriginAdressData (value) {

      this.adressData.latitudeOrigin = value.latitudeOrigin
      this.adressData.longitudeOrigin = value.longitudeOrigin
      this.adressData.descriptionOrigin = value.descriptionOrigin
    },
    setNewDestinyAdressData (value) {
      this.adressData.latitudeDestiny = value.latitudeDestiny
      this.adressData.longitudeDestiny = value.longitudeDestiny
      this.adressData.descriptionDestiny = value.descriptionDestiny
    },
    clearOriginAdressData () {

      this.adressData.latitudeOrigin = 0
      this.adressData.longitudeOrigin = 0
      this.adressData.descriptionOrigin = ""
    },
    clearDestinyAdressData () {
      this.adressData.latitudeDestiny = 0
      this.adressData.longitudeDestiny = 0
      this.adressData.descriptionDestiny = ""
    },
    desactiveBtnsMap (label) {
      label == "Origen" ? this.isActiveBtnMapOrigin = false : this.isActiveBtnMapDestiny = false;
      this.changeMouseIcon = false
    },
    activeBtnsMap (label) {
      //label == "Origen" ? this.isActiveBtnMapOrigin = true : this.isActiveBtnMapDestiny = true;
      if (label == "Origen") {
        this.isActiveBtnMapOrigin = true
        this.isActiveBtnMapDestiny = false
      } else {
        this.isActiveBtnMapOrigin = false
        this.isActiveBtnMapDestiny = true
      }
      this.changeMouseIcon = true
    },
  }
})
