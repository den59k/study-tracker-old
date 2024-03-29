import List from './index'
import { GET } from 'libs/fetch'
import useSWR from 'swr'
import { useLocation } from 'components/router'
import { useMemo } from 'react'


const map = item => ({ 
	...item, 
	id: item.subject_id+'-'+item.group_id, 
	title: item.group_title, 
	sub: item.subject_title,
	url: item.group_url + '_'+item.subject_url
})

function mapObject (data) {

	if(!data) return { groups: {}, mapData: {}}

	const groups = {}
	const mapData = {}

	for(let item of data.titles){
		groups[item.url] = item.title
		mapData[item.url] = []
	}

	for(let subject of data.subjects)
		mapData[subject.subject_url].push(map(subject))
	

	return { groups, mapData }
}


export default function CommitGroupList (){

	const { get, push } = useLocation()
	const selected = get(1)

	const url = '/api/progress'

	const { data } = useSWR(url, GET)
	const { groups, mapData } = useMemo(() => mapObject(data), [ data ])

	const onSelectItem = (item) => {
		push(item.url, 1)
	}
	
	return (
		<List
			keyProp="url"
			onSelect={onSelectItem} 
			selected={selected}
			title="Успеваемость" 
			items={mapData} 
			groups={groups}
		/>
	)
}