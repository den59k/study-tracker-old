import React from 'react'
import { useLocation } from 'components/router'

import Layout from 'components/layout'
import { IoIosList, IoMdSchool, IoMdPeople } from 'react-icons/io'
import LeftMenu from "blocks/left-menu"

import SubjectsList from 'blocks/list/subjects'
import LabsList from 'blocks/list/labs'

const menu = [
	{ title: "Успеваемость", to: "progress", icon: <IoIosList/> },
	{ title: "Дисциплины", to: "subjects", icon: <IoMdSchool/> },
	{ title: "Группы", to: "groups", icon: <IoMdPeople/> }
]

const { pathname } = window.location;

export default function MainPage ({user}){
	
	//Ключи - это роуты, _ - это дефолтный роут
	const tree = {
		component: <LeftMenu user={user} menu={menu}/>,
		progress: {
			component: <SubjectsList/>,
		},
		subjects: {
			component: <SubjectsList/>,
			_: {
				component: <LabsList/>
			}
		},
		groups: {

		}
	}


	return (
		<Layout tree={tree}>
			
		</Layout>
	)
}