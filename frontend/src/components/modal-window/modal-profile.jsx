import { REST, toREST } from "libs/fetch"
import { mutate } from 'swr'

import { modal, ModalForm } from "components/modal-window"


const modalProfile = {
	name: { type: "text", label: "Имя", placeholder: "Ваше имя" },
	surname: { type: "text", label: "Фамилия", placeholder: "Ваша фамилия" },
	avatar_full: { type: "image", label: "Изображение профиля" },
}

export function ModalProfile ({user}){
	
	const logout = async () => {
		const resp = await REST('/api/login', {}, 'DELETE')
		if(resp.success) mutate('/api')
	}

	return (
		<ModalForm title="Данные профиля" controls={modalProfile} onSubmit={toREST('/api', 'PUT')} defaultValues={user}>
			<div className="buttons" style={{justifyContent: "center", paddingTop: 0}}>
				<button className="button red" onClick={logout}>Выйти из аккаунта</button>
			</div>
		</ModalForm>
	)
}

export function openModalProfile (user) {
	modal.open(<ModalProfile user={user}/>)
}
