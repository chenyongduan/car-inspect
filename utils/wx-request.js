const { HOST } = require('../constants/index');
const { wxPromise } = require('./util.js');

const app = getApp();

function request(apiInfo, header) {
  const { endpoint, method, data } = apiInfo;
	return wxPromise(wx.request, {
		url: HOST + endpoint,
		method,
		data,
		header,
	}).then((res) => {
		const result = {};
		const { statusCode, data } = res;
		const { message, response, code } = data;
		if (code === 401) {
			wx.reLaunch({
				url: '/pages/authenticate/authenticate',
			});
		}
		if (statusCode === 200 || statusCode === 201) {
			if (message) {
				result.message = message;
			} else {
				result.response = response;
			}
		} else {
      result.message = `网络异常，错误代码${res.statusCode}`;
		}
		return Promise.resolve(result);
	}).catch((res) => {
		const result = {
      message: '未知服务器错误，请重试',
		};
		return Promise.resolve(result);
	});
}

function wxRequest(apiInfo) {
  const {
    endpoint,
    method,
    isRequireAuth,
    data,
  } = apiInfo;
  let isRequireAuthTmp = isRequireAuth;
  if (typeof isRequireAuthTmp === 'undefined') {
    isRequireAuthTmp = true;
  }
  const defaultHeaders = {
    Accept: 'application/json',
    'content-Type': 'application/json',
  };
  if (isRequireAuthTmp) {
    defaultHeaders.token = app.getToken();
  }
  return request(apiInfo, defaultHeaders);
}

module.exports = {
  wxRequest,
};
