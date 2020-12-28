import React, { useState, useEffect, useRef } from 'react'
import cn from 'classnames'

export default function Segment ({className, options, form, name, style }) {

	const [ cursorStyle, setCursorStyle ] = useState(null);
	const ref = useRef(null);

	const value = form.values.get(name);

	useEffect(() => {														//Не то, чтобы это было прям изящно, но, думаю, пойдет
		if(ref.current){
			const rect = ref.current.getBoundingClientRect();
			const offset = ref.current.offsetLeft;

			setCursorStyle({ left: offset });
		}
	}, [ value ]);


	const button = (item, index) => (						//С помощью этой функции сделаем полиморфизм

		<button key={index} className={ cn({ "active": value === index }) }  ref={value === index? ref: null } onClick={(e) => {
			e.preventDefault();
			form.onChange( { [name]: index } );
		}}>{item}</button>
	);

	return (
		<div className={cn(className, 'segment')} style={style}>
			{ Array.isArray(options)? options.map(button) : Object.keys(options).map(key => button(options[key], key)) }
			{cursorStyle && (<div className="cursor"  style={cursorStyle}></div>)}
		</div>
	);
}