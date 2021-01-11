import List from './index'
import { openModal, openModalConfirm } from 'components/modal-window'
import { GET, toREST } from 'libs/fetch'
import useSWR from 'swr'
import { useLocation } from 'components/router'
import { useMemo } from 'react'
import { num } from 'libs/rus'

const map = item => ({ 
	...item, 
	id: item.subject_id+'-'+item.group_id, 
	title: item.subject_title,
	sub: num(item.count, 'работа', 'работы', 'работ') + ' / ' + item.handed_count + ' сдано'
})

function mapObject (data) {

	if(!data) return { groups: {}, mapData: {}}

	const groups = {}
	const mapData = {}

	console.log(data)

	for(let item of data.groups){
		groups[item.url] = item.title
		mapData[item.url] = []
	}

	for(let subject of data.subjects)
		mapData[subject.group_url].push(map(subject))
	

	return { groups, mapData }
}


export default function ProgressList (){
	const { get, push } = useLocation()
	const selected = get(1)

	const url = '/api/progress'

	const { data } = useSWR(url, GET)
	const { groups, mapData } = useMemo(() => mapObject(data), [ data ])

	const onSelectItem = (item) => {
		push(item.subject_url, 1)
	}
	
	return (
		<List
			keyProp="subject_url"
			onSelect={onSelectItem} 
			selected={selected}
			groups={groups}
			title="Ваши дисциплины" 
			items={mapData} 
		/>
	)
}