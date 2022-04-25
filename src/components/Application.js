import React, {useState, useEffect} from "react";
import DayList from "./DayList";
import Appointment from "./Appointment";
import axios from "axios";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

import "components/Application.scss";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ])
    .then(all => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    }) 
  }, [])

  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const availableInterviewers = getInterviewersForDay(state, state.day)

  const array = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
     return <Appointment 
      key={appointment.id} 
      {...appointment}
      interview={interview}
      interviewers={availableInterviewers}
      bookInterview={bookInterview}
    />
  })

  function bookInterview(id, interview) {
    console.log("id is", id, "interview object is ", interview)
    return new Promise((resolve, reject) => {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
     axios.put(
        `http://localhost:8001/api/appointments/${id}`,
        {interview}
      )
      .then(res => {
        setState({...state, appointments});
        resolve()
      })
      .catch(res => {console.log(res);
        reject()
      }); 
    })
  }

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={state.days}
          value={state.day}
          onChange={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {array}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
