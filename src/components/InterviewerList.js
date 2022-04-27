import React from 'react'
import "components/InterviewerList.scss"
import InterviewerListItem from './InterviewerListItem';
import PropTypes from 'prop-types';

function InterviewerList(props) {

  const array = props.interviewers.map((interviewer) => {
    return <InterviewerListItem key={interviewer.id} name={interviewer.name} avatar={interviewer.avatar} setInterviewer={() => props.onChange(interviewer)} selected={interviewer === props.value} />
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

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;