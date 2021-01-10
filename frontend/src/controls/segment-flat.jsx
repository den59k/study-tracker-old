import React from 'react'
import cn from 'classnames'

export default function SegmentFlat ({name, className, style, options, form}){

	const value = form.values.get(name);

	const button = (item, index) => (						//С помощью этой функции сделаем полиморфизм

		<button key={index} className={ cn({ "active": value === index }) }  onClick={(e) => {
			e.preventDefault();
			form.onChange( { [name]: index } );
		}}>{item}</button>
	);

	return (
		<div className={cn('segment-flat', className)} style={style}>
				{ Array.isArray(options)? options.map(button) : Object.keys(options).map(key => button(options[key], key)) }
		</div>
	)
}