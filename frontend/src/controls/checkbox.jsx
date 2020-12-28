import React from 'react'
import cn from 'classnames'

import { IoIosCheckmark, IoIosInformationCircle } from 'react-icons/io'

export default function Input ({form, name, label, type, className, placeholder, rows}){

	const value = form.values.get(name) || false;

	const onChange = (e) => {
		form.onChange({[name]: !value});
	}

	return (
		<div className={cn("checkbox", className, form.errors.get(name) && "errored", value && "active")}>
			{label && (<label onClick={onChange}>{label}</label>)}
			<button className="check" onClick={onChange}>
				<IoIosCheckmark/>
			</button>
			<div className="error">
				<IoIosInformationCircle/>
				<div >{form.errors.get(name)}</div>
			</div>
		</div>
	);
}