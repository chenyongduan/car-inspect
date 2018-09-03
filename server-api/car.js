// 获取车检信息列表
function fetchCars(page = 1, pageSize = 5) {
	return {
    endpoint: `/cars?page=${page}&pageSize=${pageSize}`,
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

function updateCar(carId, userName, carNumber, phone, checkAt, checkPrice) {
  return {
    endpoint: `/updateCar/${carId}`,
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
  updateCar,
  searchCar,
};