export const sendFile = (file, url, filename) => new Promise((res, rej) => {
	const reader = new FileReader();				//Мы еще должны превратить наше изображение в массив и сразу отправить на сервер
	reader.onload = async () => {
		const array = reader.result;

		const headers = { 'Content-Type': file.type };
		if(filename)
			headers.filename = filename

		console.log(array)

		const json = await fetch(url, { method: 'POST', headers, body: array } )
		const resp = await json.json()

		if(resp.error) rej(resp)

		res(resp)
	}

	reader.readAsArrayBuffer(file)
})
