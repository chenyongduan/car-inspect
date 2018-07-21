// 注册和登录
function login(adminName, password) {
	return {
		endpoint: '/users/login',
		method: 'POST',
    isRequireAuth: false,
		data: {
			adminName,
			password,
		}
	};
}

module.exports = {
	login,
};
