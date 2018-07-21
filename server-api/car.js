// 获取车检信息列表
function fetchCars(adminName, password) {
	return {
		endpoint: '/cars',
		method: 'GET',
	};
}

function addCar(userName, carNumber, phone, checkAt, checkPrice) {
	return {
		endpoint: '/car',
		method: 'POST',
		data: {
			userName,
			carNumber,
			phone,
			checkAt,
      checkPrice,
		},
	};
}

function searchCar(searchValue) {
  console.warn('searchValue', searchValue)
  return {
    endpoint: '/searchCar',
    method: 'POST',
    data: {
      searchValue,
    },
  };
}

module.exports = {
	fetchCars,
	addCar,
  searchCar,
};