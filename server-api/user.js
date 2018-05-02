
function login(adminName, password) {
	return {
		endpoint: '/users/login',
		method: 'POST',
		data: {
			adminName,
			password,
		}
	};
}

module.exports = {
	login,
};
