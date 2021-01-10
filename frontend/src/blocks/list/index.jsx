import React, { Fragment, useEffect, useState, useMemo } from 'react'
import cn from 'classnames'

import { useForm, Input } from 'controls'
import { IoIosAdd, IoIosSearch, IoMdMore } from 'react-icons/io'

function find(items, _search){
	if(!_search) return items;

	const search = _search.toLowerCase();

	if(Array.isArray(items))
		return items.filter(item => item.title.toLowerCase().startsWith(search))

	const obj = {}
	for(const key in items)
		obj[key] = items[key].filter(item => item.title.toLowerCase().startsWith(search))

	return obj
}

export default function List ({keyProp, title, items, onAdd, menuItems, onSelect, selected, addTitle, groups}){

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

	const openMenu = (e, item, group) => {
		const top = e.currentTarget.parentElement.offsetTop;

		setMenu({top, item, group})
	}

	//Отрисовка элемента списка
	const mapItem = (item, group) => (
		<li key={item[keyProp]} className={cn({"active": selected === item[keyProp]})}>
			<button onClick={() => onSelect(item)} className={cn("icon" in item && "with-icon")}>
				{"icon" in item && <img src={item.icon || "/images/icon.svg"} alt={item.title}/>}
				<div className="title">{item.title}</div>
				{item.sub && <div className="sub">{item.sub}</div>}
			</button>
			{menuItems && (
				<button className="more" onClick={(e) => openMenu(e, item, group)}>
					<IoMdMore/>
				</button>
			)}
		</li>
	)
	
	const mapGroup = key => {
		if(!data || !data[key] || data[key].length === 0) return null

		return (
			<Fragment key={key}>
				<li className="title-group">{groups[key]}</li>
				{data && data[key] && data[key].map(item => mapItem(item, key))}
			</Fragment>
		)
	}


	return (
		<div className="list">
			<div className="list-header">
				<h3>{title}</h3>
				{onAdd && <button className="button-filled" onClick={onAdd}><IoIosAdd/>{addTitle || "Создать"}</button>}
			</div>
			<div className="search-container">
				<Input name="search" type="text" placeholder="Поиск" className="filled search" form={form} icon={<IoIosSearch/>} />
			</div>
			
			<ul>
				{menuItems && menu && (
					<div className="list-menu" style={{top: menu.top}}>
						{ (menu.group? menuItems[menu.group]: menuItems).map((item, index) => (
							<button key={index} onMouseDown={item.onClick? (() => item.onClick(menu.item)): null}>{item.title}{item.icon}</button>
						))}
					</div>
				)}

				{!groups? data.map(item => mapItem(item)): Object.keys(groups).map(mapGroup)}

			</ul>
		</div>
	)
}

List.defaultProps = {
	keyProp: "id"
}