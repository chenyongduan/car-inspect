// 获取车检信息列表
function fetchCars(adminName, password) {
	return {
		endpoint: '/cars',
		method: 'GET',
	};
}

function addCar(userName, carNumber, phone, checkAt) {
	return {
		endpoint: '/car',
		method: 'POST',
		data: {
			userName,
			carNumber,
			phone,
			checkAt,
		},
	};
}

module.exports = {
	fetchCars,
	addCar,
};