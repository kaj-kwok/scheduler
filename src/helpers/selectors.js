//retrieve all appointments for a given day
export function getAppointmentsForDay(state, day) {
  let temp = [];
  const appointment = [];
  state.days.map((x) => {
    if(x.name === day){
      return temp = [...x.appointments];
    } else{
      return null;
    }
  });
  for (const ele of temp) {
    appointment.push(state.appointments[ele]);
  }
  return appointment;
};

//retrieve an interview object
export function getInterview(state, interview) {
  const obj = {};
  if(interview === null) {
    return null;
  } else {
    obj["student"] = interview.student;
    obj["interviewer"] = state.interviewers[interview.interviewer]
    return obj;
  };
};

//retrieve all interviewers for a day
export function getInterviewersForDay(state, day) {
  let temp = [];
  let interviewers = [];
  state.days.map((x) => {
    if(x.name === day) {
      return temp = [...x.interviewers];
    } else {
      return null;
    }
  });
  for (const ele of temp) {
    interviewers.push(state.interviewers[ele]);
  }
  return interviewers;
};