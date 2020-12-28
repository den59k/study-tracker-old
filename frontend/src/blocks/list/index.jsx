import React, { useEffect, useState, useMemo } from 'react'
import cn from 'classnames'

import { useForm, Input } from 'controls'
import { IoIosAdd, IoIosSearch, IoMdMore } from 'react-icons/io'

function find(items, _search){
	if(!_search) return items;

	const search = _search.toLowerCase();

	return items.filter(item => item.title.toLowerCase().startsWith(search));
}

export default function List ({keyProp, title, items, onAdd, menuItems, onSelect, selected}){

	const form = useForm()
	const [ menu, setMenu ] = useState(null)

	const search = form.get("search")

	const data = useMemo(() => find(items, search), [items, search])

	useEffect(() => {
		if(menu !== null){
			const _menu = menu
			const close = (e) => setMenu((lastMenu) => lastMenu === _menu? null: lastMenu)
			document.addEventListener('click', close)

			return () => document.removeEventListener('click', close)
		}
	}, [menu])

	const openMenu = (e, item) => {
		const top = e.currentTarget.parentElement.offsetTop;

		setMenu({top, item})
	}

	return (
		<div className="list">
			<div className="list-header">
				<h3>{title}</h3>
				{onAdd && <button className="button-filled" onClick={onAdd}><IoIosAdd/>Создать</button>}
			</div>
			<div className="search-container">
				<Input name="search" type="text" placeholder="Поиск" className="filled search" form={form} icon={<IoIosSearch/>} />
			</div>
			
			<ul>
				{menuItems && menu && (
					<div className="list-menu" style={{top: menu.top}}>
						{menuItems.map((item, index) => (
							<button key={index} onMouseDown={item.onClick? (() => item.onClick(menu.item)): null}>{item.title}{item.icon}</button>
						))}
					</div>
				)}

				{data && data.map((item) => (
					<li key={item[keyProp]} className={cn({"active": selected === item[keyProp]})}>
						<button onClick={() => onSelect(item)}>
							<div className="title">{item.title}</div>
							{item.sub && <div className="sub">{item.sub}</div>}
						</button>
						<button className="more" onClick={(e) => openMenu(e, item)}>
							<IoMdMore/>
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

List.defaultProps = {
	keyProp: "id"
}