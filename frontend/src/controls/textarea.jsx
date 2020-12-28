import React from 'react'
import cn from 'classnames'

import { MdErrorOutline } from 'react-icons/md'

export default function Input ({form, name, label, type, className, placeholder, rows}){

	const onChange = (e) => {
		let value = e.target.value;
		if(type === 'number' && value !== ""){
			value = parseInt(value);
			if(isNaN(value)) return;
		}

		form.onChange({[name]: value});
	}

	return (
		<div className={cn("textarea", className, form.errors.get(name) && "errored")}>
			{label && (<label>{label}</label>)}
			<textarea name={name} placeholder={placeholder} value={form.values.get(name) || ""} rows={rows} onChange={onChange}/>
			<div className="error">
				<MdErrorOutline/>
				<div >{form.errors.get(name)}</div>
			</div>
		</div>
	);
}