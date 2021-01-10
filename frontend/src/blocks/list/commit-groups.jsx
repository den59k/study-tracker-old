import List from './index'
import { openModal, openModalConfirm } from 'components/modal-window'
import { GET, toREST } from 'libs/fetch'
import useSWR, { mutate } from 'swr'
import { useLocation } from 'components/router'
import { workTypes } from 'libs/constants'

import { IoMdCreate, IoMdTrash } from 'react-icons/io'
import { useMemo } from 'react'


const modalSubjects = {
	type: { type: "segment", options: workTypes, style: { fontSize: "0.95em" } },
	title: { type: "text", label: "Название работы", placeholder: "Работа по дисциплине" },
	theme: { type: "text", label: "Тема работы", placeholder: "Тема" },
	description: { type: "textarea", rows: 5, placeholder: "Краткое описание" }
}

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