import React from 'react'

export function Label({label, className}){
	
	return(
		<div className="control-label">
			{label}
		</div>
	)
}

export function LabelMutable ({label, className, form, name, defaultValue}){
	
	const value = form.get(name)	

	return (
		<div className="control-label-mutable">  
			<span>{ label }</span>{value || defaultValue}
		</div>
	)
}