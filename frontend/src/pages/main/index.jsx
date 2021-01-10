import React from 'react'
import { useLocation } from 'components/router'

import Layout from 'components/layout'
import { IoIosList, IoMdSchool, IoMdPeople } from 'react-icons/io'
import LeftMenu from "blocks/left-menu"

import SubjectsList from 'blocks/list/subjects'
import LabsList from 'blocks/list/labs'
import GroupsList from 'blocks/list/groups'
import StudentsList from 'blocks/list/students'
import CommitGroupList from 'blocks/list/commit-groups'
import CommitsList from 'blocks/list/commits'

const menu = [
	{ title: "Успеваемость", to: "progress", icon: <IoIosList/> },
	{ title: "Дисциплины", to: "subjects", icon: <IoMdSchool/> },
	{ title: "Группы", to: "groups", icon: <IoMdPeople/> }
]

const { pathname } = window.location;

export default function MainPage ({user}){
	
	/*Ключи - это роуты
	_ - это дефолтный роут
	component - отображаемый компонент
	остальные ключи - это прочие роуты
	*/
	const tree = {
		component: <LeftMenu user={user} menu={menu}/>,
		progress: {
			component: <CommitGroupList/>,
			_: {
				component: <CommitsList/>
			}
		},
		subjects: {
			component: <SubjectsList/>,
			_: {
				component: <LabsList/>
			}
		},
		
		groups: {
			component: <GroupsList/>,
			_: {
				component: <StudentsList/>
			}
		},
	}


	return (
		<Layout tree={tree}>
			
		</Layout>
	)
}