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

const map = item => ({ ...item, icon: item.avatar, title: item.surname + " " + item.name, sub: item.email })

export default function CommitsList (){

	const { get, push, replace } = useLocation()
	const commitGroups = get(1)
	const selected = get(2)

	const url = '/api/progress/'+commitGroups+'/'

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