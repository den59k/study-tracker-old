import { useState, useCallback } from 'react'
import { Map } from 'immutable'

import 'styles/controls.sass'

import Input from './input'
import Segment from './segment'
import TextArea from './textarea'
import CheckBox from './checkbox'
import Gallery from './gallery'
import Image from './image'


function getControl(name, control, form){
	if(control.type === "text" || control.type === "number")
		return <Input {...control} name={name} form={form}/>
	
	if(control.type === 'textarea')
		return <TextArea {...control} name={name} form={form}/>
	
	if(control.type === 'checkbox')
		return <CheckBox {...control} name={name} form={form}/>

	if(control.type === 'gallery')
		return <Gallery {...control} name={name} form={form}/>

	if(control.type === 'image')
		return <Image {...control} name={name} form={form}/>
}

///Данный хук используется, когда нам нужно обозначить несколько полей, у которых также могут появляться ошибки
function useForm (defaultValues){

	const [ values, setValues ] = useState(new Map(defaultValues));
	const [ changed, setChanged ] = useState(false);
	const [ errors, setErrors ] = useState(new Map());

	const onChange = (obj) => {

		let err = errors;
		Object.keys(obj).forEach(key => {				
			if(err.has(key))
				err = err.delete(key);							//Здесь мы затираем ошибки, когда начинаем вводить значение
		});

		if(err !== errors)
			setErrors(err);
		setChanged(true);
		setValues(values.merge(obj));						//А здесь мы присваиваем новые значения
	}

	const _setErrors = useCallback((err) => setErrors(new Map(err)), []);

	const get = (name) => values.get(name)

	return{ values, onChange, errors, setErrors: _setErrors, get, changed, setChanged };
}


export { Input, Segment, CheckBox, TextArea, useForm, getControl };