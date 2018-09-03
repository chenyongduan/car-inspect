const moment = require('../../../libs/moment.js');
const _ = require('../../../libs/lodash.js');
const {
  HOST
} = require('../../../constants/index.js');

module.exports = {
  getImage: function(images) {
    const defalutImg = '/images/car.jpg';
    if (!images || !images[0]) return defalutImg;
    return `${HOST}/${images[0]}`;
  },
  dealCar: function(carInfo) {
    const newCarInfo = {};
    const checkMoment = moment.unix(carInfo.checkAt);
    newCarInfo.checkAt = checkMoment.format('YYYY-MM-DD');
    const surplusDay = checkMoment.diff(moment(), 'days');
    newCarInfo.surplusDay = surplusDay;
    newCarInfo.surplusColor = surplusDay <= 15 ? '#FF0000' : '#4A4A4A';
    newCarInfo.imagePreview = this.getImage(carInfo.images);
    return newCarInfo;
  },
  addCar: function(carInfo) {
    let { carList } = this.data;
    let newCarInfo = this.dealCar(carInfo);
    newCarInfo = Object.assign(carInfo, newCarInfo);
    carList = _.concat([], newCarInfo, carList);
    this.setData({ carList });
  },
  updateCar: function(newCarInfo) {
    const { id } = newCarInfo;
    const { carList } = this.data;
    const carIndex = _.findIndex(carList, { id });
    if (carIndex < 0) return null;
    const dealCarInfo = this.dealCar(newCarInfo);
    const curCarInfo = Object.assign(carList[carIndex], newCarInfo, dealCarInfo);
    carList[carIndex] = curCarInfo;
    this.setData({ carList });
  },
  updateCarImages: function(refreshInfo) {
    const { id, images } = refreshInfo;
    const { carList } = this.data;
    const carIndex = _.findIndex(carList, { id });
    if (carIndex < 0) return null;
    carList[carIndex].images = images;
    carList[carIndex].imagePreview = this.getImage(images);
    this.setData({ carList });
  },
}