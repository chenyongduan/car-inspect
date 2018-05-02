const { HOST } = require('../constants/index');
const { wxPromise } = require('./util.js');

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
		const { message, response } = data;
		if (statusCode === 200 || statusCode === 201) {
			if (message) {
				result.errorMsg = message;
			} else {
				result.response = response;
			}
		} else {
			result.errorMsg = `网络异常，错误代码${res.statusCode}`;
		}
		return Promise.resolve(result);
	}).catch((res) => {
		const result = {
			errorMsg: '未知服务器错误，请重试',
		};
		return Promise.resolve(result);
	});
}

function wxRequest(apiInfo) {
  const {
    endpoint,
    method,
    data,
  } = apiInfo;
  const defaultHeaders = {
    Accept: 'application/json',
    'content-Type': 'application/json',
  };
  return request(apiInfo, defaultHeaders);
}

module.exports = {
  wxRequest,
};