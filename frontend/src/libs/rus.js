export function numeral(count, one, two, five){
	if(!count) count = 0;
	//десять-девятнадцать
	if(count%100/10>>0 === 1)
		return five;
	//ноль, пять-девять
	if(count%10 >= 5 || count%10===0)
		return five;
	//один
	if(count%10 === 1)
		return one;

	//две-четыре
	return two;
}

export function num(count, one, two, five){
	return count + " " + numeral(count, one, two, five)
}

export function _lang(item, lang){
	if(typeof(item) === 'object')
		return item[lang] || item.ru
	
	return item
}

export function getLang(item, lang){
	const newItem = {}
	for(const key in item)
		if(typeof item[key] === 'object' && (item[key][lang] || item[key]['ru']))
			newItem[key] = item[key][lang] || item[key]['ru']
		else
			newItem[key] = item[key]
			
	return newItem
}

//Сделаем замену длинных слов на их короткие аналоги
export function shorten(str){
	return str.toLowerCase()
	.replace(' работа', '')
	.replace('лабораторная', 'лаб.')
	.replace('самостоятельная', 'сам.')
	.replace('практическая', 'практ.')
}

const months = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря',
]

function _ (i){
	if(i < 10) return '0'+i
	return i
}

//Функция для получения времени
export function getTime(time){

	const delta = Math.floor((Date.now() - time) / 60 / 1000)

	if(delta <= 0)
		return "только что"
	if(delta === 1)
		return "минуту назад"
	if(delta < 30)
		return num(delta, 'минуту', 'минуты', 'минут') + ' назад'
	
	const date = new Date(time)
	const nowDate = new Date()


	if(delta < 24 * 60 && date.getDate() === nowDate.getDate())
		return 'сегодня в ' + date.getHours() + ':' + _(date.getMinutes())

	if(delta < 24 * 2 * 60 && date.getDate() - nowDate.getDate() === 1)
		return 'вчера в ' + date.getHours() + ':' +  _(date.getMinutes())

	return date.getDate() + ' ' + months[date.getMonth()] + ' в ' + date.getHours() + ':' +  _(date.getMinutes())
}