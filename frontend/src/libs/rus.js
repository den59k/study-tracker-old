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
