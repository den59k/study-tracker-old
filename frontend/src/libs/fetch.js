import { mutate } from 'swr'
import { closeModal } from 'components/modal-window'

export const GET = async(url) => {

	const response = await fetch(url);

	const json = await response.json();

	return json;
}

export const REST = async (url, body, method) => {

	const response = await fetch(url, {
		method: method || 'POST',
		body: JSON.stringify(body),
		headers: {
		 'Content-Type': 'application/json;charset=utf-8',
		}
	});

	const json = await response.json();

	return json;

}

//Функция, которая получает данные с модалки, закрывает ее и мутирует URL
export const toREST = (url, method, mutateUrl) => {
	return async (values) => {
		console.log(values)
		const resp = await REST(url, values || {}, method || 'POST')
		if(resp.error) return 
		closeModal()
		mutate(mutateUrl || url)
	}
}
