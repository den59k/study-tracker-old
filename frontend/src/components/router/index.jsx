import React, { useState, useContext, createContext, useEffect } from "react";
import { List } from 'immutable'

const RouterContext = createContext();

const getParsed = () => {
	const parsed = window.location.pathname.slice(1).split('/').filter(item => !!item)
	return new List(parsed)
}

const getUrl = (state) => state.reduce((str, item) => str += '/'+item, '')

const initial = getParsed()

export function Router ({children}){

	const [ state, setState ] = useState(initial)

	useEffect(() => {
		window.onpopstate = () => setState(getParsed())
	}, [])


	const push = (to, level) => {
		const newState = state.slice(0, level).push(to)
		setState(newState)
		window.history.pushState({}, '', getUrl(newState))
	}

	const replace = (to, level) => {
		const newState = state.set(level, to)
		setState(newState)
		window.history.replaceState({}, '', getUrl(newState))
	}
	
	//Получает роут на заданном уровне вложенности
	const get = (level) => {
		return state.get(level)
	}

	return (
		<RouterContext.Provider value={{state, push, get, replace}}>
			{children}
		</RouterContext.Provider>
	)
}

export function useLocation (){
	const location = useContext(RouterContext)
	return location
}

export function Link (props){

	const { to, level, children, ...otherProps } = props

	const { push } = useLocation()

	const onClick = (e) => {
		e.preventDefault()
		push(to, level)
	}

	return (
		<a href={to} onClick={onClick} {...otherProps}>
			{children}
		</a>
	)
}