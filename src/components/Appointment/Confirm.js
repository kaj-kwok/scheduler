import React from 'react'
import Button from "../Button"

export default function Confirm(props) {
  return (
    <main className="appointment__card appointment__card--confirm">
      <h1 className="text--semi-bold">Delete the appointment?</h1>
      <section className="appointment__actions">
        <Button danger onClick={() => props.onCancel(props.id)}>Cancel</Button>
        <Button danger onClick={() => props.onConfirm(props.id)}>Confirm</Button>
      </section>
    </main>
  );
}
