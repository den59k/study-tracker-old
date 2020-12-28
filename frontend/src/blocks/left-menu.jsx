import "styles/layout.sass"
import React from 'react'
import cn from 'classnames'

import { Link, useLocation } from 'components/router'

import { IoIosArrowForward } from 'react-icons/io'


export default function LeftMenu ({user, menu}){

	const { get } = useLocation()
	const key = get(0)

	return(
	<div className="left-menu">
		<button className="user-button">
			<img src={user.avatar || "/images/icon.svg"} alt="Аватар пользователя"/>
			<div>
				<div className="name">{user.name} {user.surname}</div>
				<div className="sub">Настройки профиля</div>
			</div>
			<IoIosArrowForward/>
		</button>
		<nav>
		{menu.map((item, index) => (
			<Link to={item.to} key={index} level={0} className={cn({"active": key === item.to})}>
				{item.icon}{item.title}
			</Link>
		))}
		</nav>
	</div>
	)
}