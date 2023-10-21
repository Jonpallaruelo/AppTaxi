export default class ManagerApp {

  constructor() {
    if (ManagerApp.instance) {
      return ManagerApp.instance;
    }

    this.central = '';
    this.provinceCode = '';
    this.provinceName = '';
    this.restrictionsAndExtrasList = [
      {
        extraValue: "",
        description: "",
        restrictionValue: "",
        active: false,
      },
    ];
    this.defaultLatitude = 41.639167;
    this.defaultLongitude = -0.871044;

    ManagerApp.instance = this;
  }

}
