import React, {useState} from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  function reset() {
    setStudent("");
    setInterviewer(null);
    setError("")
  }

  function cancel() {
    props.onCancel();
    reset();
  }

  function validate(student, interviewer) {
    if (student === "") {
      setError("Student name cannot be blank");
      return;
    }
    else if (interviewer === null) {
      setError("Please select an interviewer");
      return
    }
    setError("")
    props.onSave(student, interviewer)
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            data-testid="student-name-input"
            onChange={(e) => setStudent(e.target.value)}
            value={student}
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          value={interviewer}
          onChange={setInterviewer}
          interviewers={props.interviewers}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={() => cancel()}>Cancel</Button>
          <Button confirm onClick={() => validate(student, interviewer)}>Save</Button>
        </section>
      </section>
    </main>
  )
}
