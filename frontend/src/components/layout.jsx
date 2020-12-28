import "styles/layout.sass"
import React from 'react'

import { ModalWrapper } from 'components/modal-window'
import { Router, useLocation } from 'components/router'

export default function Layout ({children, tree}){

	return (
		<ModalWrapper className="main">
			<Router>
				<LayoutInner tree={tree}/>
				{children}
			</Router>
		</ModalWrapper>
	)
}

export function LayoutInner ({tree, level}){

	const { state, get } = useLocation()

	const key = get(level)

	const next = key? (tree[key] || tree._): null					//Вот здесь мы выбираем следующий компонент для рендера

	return (
		<>
			{ tree.component }
			{ next && <LayoutInner tree={next} level={level+1}/> }
		</>
	)
}

LayoutInner.defaultProps = {
	level: 0
}