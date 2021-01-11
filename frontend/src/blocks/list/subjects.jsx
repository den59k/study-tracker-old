import React, { useMemo } from 'react'
import List from './index'
import { openModal, openModalConfirm } from 'components/modal-window'
import { GET, toREST } from 'libs/fetch'
import useSWR, { mutate } from 'swr'
import { useLocation } from 'components/router'

import { IoMdCreate, IoMdTrash } from 'react-icons/io'
import { num } from 'libs/rus'


const modalSubjects = {
	title: { type: "text", label: "Название", placeholder: "Дисциплина" },
	description: { type: "textarea", rows: 5, placeholder: "Краткое описание", checkNull: true }
}

const map = item => ({ ...item, sub: num(item.count_works, "работа", "работы", "работ")})

export default function SubjectsList (){

	const { data } = useSWR('/api/subjects', GET)
	const mapData = useMemo(() => data? data.map(map): [], [ data ])

	const { get, push, replace } = useLocation()
	const selected = get(1)

	const onSelectItem = (item) => {
		push(item.url, 1)
	}
	
	const addSubject = () => {
		openModal("Добавление дисциплины", modalSubjects, toREST('/api/subjects'))
	}


	const editSubject = (subject) => {
		const mutateSubject = (resp) => {
			if(subject.url === selected)
				replace(resp.url, 1)
			mutate('/api/subjects')
		}
		openModal("Редактирование дисциплины", modalSubjects, toREST('/api/subjects/'+subject.id, 'PUT', mutateSubject), subject)
	}

	const deleteSubject = (subject) => {
		openModalConfirm("Удалить дисциплину?", subject.title, toREST('/api/subjects/'+subject.id, 'DELETE', '/api/subjects'))
	}

	const menuItems = [
		{ title: "Редактировать дисциплину", icon: <IoMdCreate/>, onClick: editSubject },
		{ title: "Удалить дисциплину", icon: <IoMdTrash/>, onClick: deleteSubject }
	]
	
	return (
		<List 
			keyProp="url" 
			onSelect={onSelectItem} 
			selected={selected}
			title="Дисциплины" 
			items={mapData} 
			menuItems={menuItems} 
			onAdd={addSubject}
		/>
	)
}