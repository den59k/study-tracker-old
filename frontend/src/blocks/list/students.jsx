import List from './index'
import { openModal, openModalConfirm } from 'components/modal-window'
import { GET, toREST } from 'libs/fetch'
import useSWR, { mutate } from 'swr'
import { useLocation } from 'components/router'
import { workTypes } from 'libs/constants'

import { IoMdCreate, IoMdTrash } from 'react-icons/io'
import { useMemo } from 'react'


const modalStudent = {
	surname: { type: "text", label: "Фамилия", placeholder: "Фамилия студента" },
	name: { type: "text", label: "Имя", placeholder: "Имя студента" },
	email: { type: "email", label: "Email (необязательно)", placeholder: "Email студента" },
	emailLabel: { type: "label", label: "Студенту придет письмо на почту со ссылкой для регистрации аккаунта" }
}

const map = item => ({ ...item, title: item.surname + " " + item.name, sub: item.email })

export default function LabsList (){

	const { get, push, replace } = useLocation()
	const group = get(1)
	const selected = get(2)

	const url = '/api/groups/'+group+'/'

	const { data } = useSWR(url, GET)
	const mapData = useMemo(() => data? data.map(map): [], [ data ])

	const addWork = () => {
		openModal("Добавление студента", modalStudent, toREST(url), { type: "other" })
	}
	
	const editWork = (work) => {
		const mutateWork = (resp) => {
			if(work.url === selected)
				replace(resp.url, 2)
			mutate(url)
		}
		openModal("Редактирование студента", modalStudent, toREST(url+work.url, 'PUT', mutateWork), work)
	}
	
	const deleteWork = (student) => {
		openModalConfirm("Удалить студента из группы?", student.title, toREST(url+student.id, 'DELETE', url))
	}
	
	
	const menuItems = [
		{ title: "Изменить данные", icon: <IoMdCreate/>, onClick: editWork },
		{ title: "Удалить из группы", icon: <IoMdTrash/>, onClick: deleteWork }
	]
	
	const onSelectItem = (item) => {
		push(item.id, 2)
	}
	
	return (
		<List
			keyProp="id"
			onSelect={onSelectItem} 
			selected={selected}
			title="Студенты" 
			items={mapData} 
			menuItems={menuItems} 
			addTitle="Добавить"
			onAdd={addWork}
		/>
	)
}