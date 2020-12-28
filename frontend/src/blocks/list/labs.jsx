import List from './index'
import { openModal, openModalConfirm } from 'components/modal-window'
import { GET, toREST } from 'libs/fetch'
import useSWR from 'swr'
import { useLocation } from 'components/router'

import { IoMdCreate, IoMdTrash } from 'react-icons/io'


const modalSubjects = {
	title: { type: "text", label: "Название", placeholder: "Дисциплина" },
	description: { type: "textarea", rows: 5, placeholder: "Краткое описание" }
}

const addSubject = () => {
	openModal("Добавление дисциплины", modalSubjects, toREST('/api/subjects'))
}

const editSubject = (subject) => {
	openModal("Редактирование дисциплины", modalSubjects, toREST('/api/subjects/'+subject.id, 'PUT', '/api/subjects'), subject)
}

const deleteSubject = (subject) => {
	openModalConfirm("Удалить дисциплину?", subject.title, toREST('/api/subjects/'+subject.id, 'DELETE', '/api/subjects'))
}


const menuItems = [
	{ title: "Редактировать работу", icon: <IoMdCreate/>, onClick: editSubject },
	{ title: "Удалить работу", icon: <IoMdTrash/>, onClick: deleteSubject }
]

export default function LabsList (){

	const data = [
		{ id: 1, title: "Лабораторная работа 1" },
		{ id: 2, title: "Лабораторная работа 1" },
		{ id: 3, title: "Лабораторная работа 1" },
	]
	const { get, push } = useLocation()

	const onSelectItem = (item) => {
		push(item.url, 2)
	}

	const selected = get(2)

	return (
		<List
			onSelect={onSelectItem} 
			selected={selected}
			title="Работы" 
			items={data} 
			menuItems={menuItems} 
			onAdd={addSubject}
		/>
	)
}