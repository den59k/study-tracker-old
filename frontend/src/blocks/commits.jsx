import { openModal } from 'components/modal-window'
import useSWR from 'swr'
import { GET, toREST } from 'libs/fetch'
import { useMemo } from 'react'
import { shorten, getTime } from 'libs/rus'
import { useLocation } from 'components/router'
import cn from 'classnames'

import { IoCreateOutline, IoAttach } from 'react-icons/io5'

const markComments = [
	'Без оценки, просто комментарий',
	'Неудволетворительно',
	'Удволетворительно',
	'Хорошо',
	'Отлично'
]

const modalCommit = {
	work: { type: "works" },
	selectedWork: { type: "label-mutable", label: "Выбранная работа: ", defaultValue: "Не выбрано" },
	mark: { type: "segment-2", options: [ 'Без оценки', 2, 3, 4, 5 ] },
	selectedMark: { type: "label-mutable", label: "Оценка: ", defaultValue: markComments[0] },
	text: { type: "textarea", rows: 5, placeholder: "Комментарий по данной работе..." },
	files: { type: "file", label: "Прикрепленный файл" },
}

function mapWorks(works){
	const obj = {}
	if(!works) return obj

	for(let item of works)
		obj[item.id] = shorten(item.title)

	return obj
}

export default function Commits (){
	
	const { get } = useLocation()
	const commitGroup = get(1)
	const student_id = get(2)

	const url = '/api/progress/'+commitGroup+'/'+student_id+'/'

	const { data } = useSWR(url, GET)

	console.log(data)

	modalCommit.work.items = useMemo(() => mapWorks(data && data.works), [ data ])
	modalCommit.work.onChange = (val, form) => {
		form.onChange({ selectedWork: data.works.find(item => item.id === val)?.title })
	}

	modalCommit.mark.onChange = (val, form) => {
		form.onChange({ selectedMark: markComments[val] })
	}
	
	const openCommitModal = () => {
		openModal("Оценить работу", modalCommit, toREST(url, 'POST'), { mark: 0 })
	}

	if(!data || data.error) return <div className="list commits"></div>

	return (
		<div className="list commits">
			<div className="list-header">
				<h3>{data.student.surname + ' '+ data.student.name}</h3>
			</div>
			<button className="button-filled" onClick={openCommitModal}><IoCreateOutline/>Оценить работу</button>
			<ul>
			{ data && data.commits && data.commits.map(commit => <Commit key={commit.id} {...commit}/>) }
			</ul>
		</div>
	)
}

function Commit ({ title, name, surname, avatar, files, text, timestep, mark }){

	const fullTitle = mark? (title + '. Оценка: '+mark) : title

	return (
		<li className="commit">
			<div className="commit-time">{ getTime(timestep) }</div>
			<div className={cn("commit-title", mark && "primary")}>{ fullTitle }</div>
			{text && <div className="commit-text">{ text }</div>}
			{ files && files.map(file => (
				<a className="file-link" key={file} href={file.src} download={file.name}><IoAttach/>{file.name}</a>
			))}
			<div className="commit-profile">
				<div>{name + ' ' + surname}</div>
			</div>
		</li>
	)
}