import List from './index'
import { GET } from 'libs/fetch'
import useSWR from 'swr'
import { useLocation } from 'components/router'

import { useMemo } from 'react'


const map = item => ({ ...item, icon: item.avatar, title: item.surname + " " + item.name, sub: item.email })

export default function CommitsList (){

	const { get, push } = useLocation()
	const commitGroup = get(1)
	const selected = parseInt(get(2))

	const url = '/api/progress/'+commitGroup+'/'

	const { data } = useSWR(url, GET)
	const mapData = useMemo(() => data? data.map(map): [], [ data ])

	const onSelectItem = (item) => {
		push(item.id, 2)
	}
	
	return (
		<List
			keyProp="id"
			onSelect={onSelectItem} 
			selected={selected}
			title="Список группы" 
			items={mapData} 
		/>
	)
}