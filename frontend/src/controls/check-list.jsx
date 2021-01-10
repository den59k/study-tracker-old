import React from 'react'
import cn from 'classnames'

import { IoIosCheckmark, IoIosInformationCircle } from 'react-icons/io'
import { Set } from 'immutable'

export default function Input ({form, name, label, type, className, items}){
	
	const values = Set.isSet(form.values.get(name))? form.get(name): new Set(form.values.get(name))

	const onChange = (id) => {
		if(values.has(id))
			form.onChange({ [name]: values.delete(id) })
		else
			form.onChange({ [name]: values.add(id) })
	}

	return (
		<div className={cn("check-list", className, form.errors.get(name) && "errored")}>
			{label && (<label>{label}</label>)}
			<div className="check-list_list">
				{items && items.map(item => (
					<button className={cn("item", values.has(item.id) && "active")} key={item.id} onClick={() => onChange(item.id)}>
						<div className="check">
							<IoIosCheckmark/>
						</div>
						{item.title}
					</button>
				))}
			</div>
			
			<div className="error">
				<IoIosInformationCircle/>
				<div >{form.errors.get(name)}</div>
			</div>
		</div>
	);
}