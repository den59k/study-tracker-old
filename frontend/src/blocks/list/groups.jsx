import List from './index'
import { openModal, openModalConfirm } from 'components/modal-window'
import { GET, toREST } from 'libs/fetch'
import useSWR, { mutate } from 'swr'
import { useLocation } from 'components/router'
import { workTypes } from 'libs/constants'

import { IoMdCreate, IoMdTrash, IoIosClose } from 'react-icons/io'
import { useMemo } from 'react'
import { num } from 'libs/rus'

const tabs = {
	own: "Создать новую",
	other: "Добавить через старосту"
}

const tabsStudents = {
	own: "Создать свою",
	other: "Добавиться в уже созданную"
}


const modalGroups = {
	tab: { type: "segment", options: tabs, style: { fontSize: "0.95em" } },
	title: { type: "text", label: "Название группы", placeholder: "Группа 21-1б", visible: form => form.get('tab') === 'own' },
	email: { type: "text", label: "Email старосты", placeholder: "Email старосты", visible: form => form.get('tab') === 'other' },
	emailLabel: { 
		type: "label", 
		label: "Старосте группы придет уведомление с предложением записать группу на ваш курс",
		visible: form => form.get('tab') === 'other'
	},
	subjects: { items: [], type: "check-list", label: "Дисциплины" }
}


const modalGroupsStudent = {
	tab: { type: "segment", options: tabsStudents, style: { fontSize: "0.95em" } },
	title: { type: "text", label: "Название группы", placeholder: "Группа 21-1б", visible: form => form.get('tab') === 'own' },
	email: { type: "text", label: "Email старосты", placeholder: "Email старосты", visible: form => form.get('tab') === 'other' },
	emailLabel: { 
		type: "label", 
		label: "Старосте группы придет уведомление с предложением записать вас в свою группу",
		visible: form => form.get('tab') === 'other'
	}
}

const modalOwnGroups = {
	title: { type: "text", label: "Название группы", placeholder: "Группа 21-1б" },
	subjects: { items: [], type: "check-list", label: "Дисциплины" }
}

const modalOwnGroupsStudent = {
	title: { type: "text", label: "Название группы", placeholder: "Группа 21-1б" }
}

const modalOtherGroups = {
	subjects: { items: [], type: "check-list", label: "Дисциплины" }
}

const groupGroups = {
	own: "Созданные вами группы",
	other: "Добавленные группы",
	my: "Группы, в которых вы состоите",
	requests: "Ожидается подтверждение"
}

const map = item => ({ 
	...item, 
	sub: 'Изучает ' + num(item.subjects? item.subjects.length: 0, "ваш предмет", "ваших предмета", "ваших предметов") })

const mapStudent = item => ({ 
	...item, 
	sub: num(item.count? item.count: 0, "студент", "студента", "студентов") })

const mapObject = (data, callback) => {
	const newObj = {}
	for(let key in data)
		newObj[key] = data[key].map(callback)

	return newObj
}

export default function GroupsList ({ isStudent }){

	const { get, push, replace } = useLocation()
	const selected = get(1)

	const url = '/api/groups/'

	const { data: subjects } = useSWR('/api/subjects', GET)

	if(subjects){
		modalGroups.subjects.items = subjects
		modalOwnGroups.subjects.items = subjects
		modalOtherGroups.subjects.items = subjects
	}
	
	const { data } = useSWR(url, GET)
	const mapData = useMemo(() => data? mapObject(data, isStudent? mapStudent: map): {}, [ data ])

	const addWork = () => {
		openModal("Добавление группы", isStudent? modalGroupsStudent: modalGroups, values => {
			let _url
			if(values.tab === 'own')	_url = '/api/groups/own'
			if(values.tab === 'other')	_url = '/api/groups/other'

			if(url)	toREST(_url, 'POST', url)(values)

		}, { tab: "own" })
	}

	const editOwnGroup = (group) => {
		const mutateGroup = (resp) => {
			if(group.url === selected)
				replace(resp.url, 1)
			mutate(url)
		}
		openModal("Изменение группы", isStudent? modalOwnGroupsStudent: modalOwnGroups, toREST(url+group.url, 'PUT', mutateGroup), group)
	}
	
	const editOtherGroup = (group) => {
		openModal("Изменение дисциплин", modalOtherGroups, toREST(url+group.url, 'PUT', url), group)
	}
	
	const deleteGroup = (group) => {
		openModalConfirm("Удалить группу из списка?", group.title, toREST(url+group.url, 'DELETE', url))
	}

	const deleteRequest = (group) => {
		openModalConfirm("Отозвать заявку?", group.title, toREST(url+group.url, 'DELETE', url))
	}

	const exitGroup = (group) => {
		openModalConfirm("Выйти из группы?", group.title, toREST(url+group.url, 'DELETE', url))
	}
	
	const menuItems = {
		own: [
			{ title: "Редактировать группу", icon: <IoMdCreate/>, onClick: editOwnGroup },
			{ title: "Удалить группу", icon: <IoMdTrash/>, onClick: deleteGroup }
		],
		other: [
			{ title: "Изменить дисциплины", icon: <IoMdCreate/>, onClick: editOtherGroup },
			{ title: "Убрать группу", icon: <IoMdTrash/>, onClick: deleteGroup }
		],
		requests: [
			{ title: "Отозвать заявку", icon: <IoMdTrash/>, onClick: deleteRequest }
		],
		my: [
			{ title: "Уйти из группы", icon: <IoIosClose/>, onClick: exitGroup }
		]
	}
	
	const onSelectItem = (item) => {
		push(item.url, 1)
	}
	

	return (
		<List
			keyProp="url"
			onSelect={onSelectItem} 
			selected={selected}
			title="Группы" 
			items={mapData} 
			menuItems={menuItems} 
			onAdd={subjects && addWork}
			addTitle="Добавить"
			groups={groupGroups}
		/>
	)
}