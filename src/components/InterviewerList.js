import React from 'react'
import "components/InterviewerList.scss"
import InterviewerListItem from './InterviewerListItem'

export default function InterviewerList(props) {
  const array = props.interviewers.map((interviewer) => {
    return <InterviewerListItem key={interviewer.id} name={interviewer.name} avatar={interviewer.avatar} setInterviewer={() => props.onChange(interviewer.id)} selected={interviewer.id === props.value} />
  })

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {array}
      </ul>
    </section>
  )
}
