// 获取车检信息列表
function fetchCars(adminName, password) {
	return {
		endpoint: '/cars',
		method: 'GET',
	};
}

module.exports = {
	fetchCars,
};