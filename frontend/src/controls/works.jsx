import cn from 'classnames'

export default function Works ({className, items, form, name, style }){

	const select = (key) => {
		const val = parseInt(key)
		form.onChange({[name]: isNaN(val)? null: val })
	}

	const value = form.get(name)

	return (
		<div className="works-control">
			{Object.keys(items).map(key => (
				<button key={key} className={cn(value == key && "active")} onClick={() => select(key)}>{items[key]}</button>
			))}
		</div>
	)

}