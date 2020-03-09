import axios from '../utils/handleAxios';

export const Adminlogin = ({ email, password }) => {
	return axios.post(`/login`, {
		email,
		password
	});
};

export const dashBoard = () => {
	return axios.get(`/dashboard`);
};
export const users = (page = 1, limit = 10, q = undefined) => {
	return axios.get(`/users/${page}/${limit}?q=${q}`);
};
export const gifs = (page = 1, limit = 10, q = undefined) => {
	return axios.get(`/gifs/${page}/${limit}?q=${q}`);
};
export const posts = (page = 1, limit = 10, q = undefined) => {
	return axios.get(`/posts/${page}/${limit}?q=${q}`);
};
export const products = (page = 1, limit = 10, shop_id, q = undefined) => {
	return axios.get(`/products/${page}/${limit}?q=${q}&shop_id=${shop_id}`);
};
export const orders = (page = 1, limit = 10, q = undefined) => {
	return axios.get(`/orders/${page}/${limit}?q=${q}`);
};
export const sendPush = (data) => {
	return axios.post(`/send-push`, data);
};
export const appInfo = () => {
	return axios.get(`/appInfo`);
};
export const updateAppInfo = (data) => {
	return axios.put(`/appInfo`, data);
};
export const addUser = (data) => {
	const form = new FormData();
	form.append('first_name', data.first_name);
	form.append('last_name', data.last_name);
	form.append('email', data.email);
	form.append('password', data.password);
	form.append('phone', data.phone);
	form.append('profile', data.profile);
	form.append('status', 1);
	return axios.post(`/users`, form);
};

export const addGif = (data) => {
	const form = new FormData();
	form.append('title', data.title);
	form.append('image', data.image);
	form.append('status', 1);
	return axios.post(`/gifs`, form);
};

export const updateProfile = (data) => {
	const form = new FormData();
	form.append('first_name', data.first_name);
	form.append('last_name', data.last_name);
	form.append('password', data.password);
	form.append('email', data.email);
	form.append('token', data.token);
	form.append('profile', data.image);
	form.append('id', data.id);
	return axios.post(`/admin-profile`, form);
};

export const updateUser = (data) => {
	return axios.put(`/users?`, {
		table: data.table,
		id: data.id,
		status: data.status
	});
};

export const deleteUser = (data) => {
	return axios.delete(
		`/users`,
		{ data },
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	);
};