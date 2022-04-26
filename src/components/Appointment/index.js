import React from 'react';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Status from './Status';
import Confirm from './Confirm';
import "./styles.scss";
import useVisualMode from 'hooks/useVisualMode';
import Form from './Form';
import Error from './Error';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(res => {
      transition(SHOW);
    })
    .catch(res => transition(ERROR_SAVE, true));
  }

  function showConfirm() {
    transition(CONFIRM)
  }
  
  function onConfirm(id) {
    deleteInterview(id)
  }

  function onCancel(){
    back(SHOW);
  }

  function deleteInterview(id) {
    transition(DELETING, true);
    props.cancelInterview(id)
    .then(() => transition(EMPTY))
    .catch(() => transition(ERROR_DELETE, true))
  }

  function onEdit() {
    transition(EDIT)
  }

  function onClose() {
    back()
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => {transition(CREATE)}}/>}
        {mode === SHOW && <Show id={props.id} student={props.interview.student} interviewer={props.interview.interviewer} showConfirm={showConfirm} onEdit={onEdit} />}
        {mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => {back(EMPTY)}} onSave={save} />}
        {mode === SAVING && <Status message={"Saving"} />}
        {mode === DELETING && <Status message={"Deleting"} />}
        {mode === CONFIRM && <Confirm id={props.id} onConfirm={onConfirm} onCancel={onCancel} />}
        {mode === EDIT && <Form student={props.interview.student} interviewer={props.interview.interviewer} interviewers={props.interviewers} onCancel={() => {back(EMPTY)}} onSave={save} />}
        {mode === ERROR_DELETE && <Error message={"delete"} onClose={onClose} />}
        {mode === ERROR_SAVE && <Error  message={"save"} onClose={onClose} />}
        {/* {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty />} */}
    </article>
  )
}
