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
	{ title: "Редактировать дисциплину", icon: <IoMdCreate/>, onClick: editSubject },
	{ title: "Удалить дисциплину", icon: <IoMdTrash/>, onClick: deleteSubject }
]

export default function SubjectsList (){

	const { data } = useSWR('/api/subjects', GET)
	const { get, push } = useLocation()

	const onSelectItem = (item) => {
		push(item.url, 1)
	}

	const selected = get(1)

	return (
		<List 
			keyProp="url" 
			onSelect={onSelectItem} 
			selected={selected}
			title="Дисциплины" 
			items={data} 
			menuItems={menuItems} 
			onAdd={addSubject}
		/>
	)
}