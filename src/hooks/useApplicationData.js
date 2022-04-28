import {useEffect, useReducer} from "react";
import axios from "axios";

export default function useApplicationData() {

  //constants for reducer function
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  //reducer object
  const [state, dispatch] = useReducer(reducer, {
      day: "Monday",
      days: [],
      appointments: {},
      interviewers: {}
    })

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.day}
      case SET_APPLICATION_DATA:
        return {...state, days:action.days, appointments: action.appointments, interviewers: action.interviewers }
      case SET_INTERVIEW: {
        let appointment = {
          ...state.appointments[action.id],
          interview: { ...action.interview}
        };
        // if interview is null
        if(action.interview === null) {
          appointment = {
            ...state.appointments[action.id],
            interview: null
          };
        }
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        };
        const days = calculateSpots(action.id, state.days, appointments)
        return {...state, appointments: appointments, days: days}
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const setDay = day => dispatch({ type: SET_DAY, day});
  
  //get requests for days/appointments/interviewers, setState to update object
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then(all => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    }) 
  }, [])

  //websocket connection
  useEffect(() => {

    //create websocket object
    const ws = new WebSocket(
      process.env.REACT_APP_WEBSOCKET_URL
    )

    //open connection 
    ws.onopen = () =>{
      console.log("opened connection");
      ws.send("ping");
    };
    
    //set to listen mode
    ws.onmessage = function (event) {
      let data = JSON.parse(event.data);
      if (data.type === "SET_INTERVIEW") {
        console.log("data is ", data);
        dispatch({type: data.type, id:data.id, interview:data.interview});
      } else{
        console.log("Message Received: ", event.data);
      }
    };
  }, []);
  
  function bookInterview(id, interview) {
    return new Promise((resolve, reject) => {
     axios.put(
        `http://localhost:8001/api/appointments/${id}`,
        {interview}
      )
      .then(res => {
        dispatch({ type: SET_INTERVIEW, id, interview });
        resolve();
      })
      .catch(res => {
        console.log(res);
        reject();
      }); 
    });
  };

  //function to cancel appointment
  function cancelInterview(id) {
    return new Promise((resolve, reject) => {
      axios.delete(
        `http://localhost:8001/api/appointments/${id}`
      )
      .then((res) => {
        dispatch({ type: SET_INTERVIEW, id, interview: null });
        resolve()
      })
      .catch(err => reject(err))
    })
  }

  //function to calculate spots remaining
  function calculateSpots(id, days, appointments) {
    const copyOfDays = [...days];
    const day = days.filter(key => key.appointments.includes(id));
    const spots = day[0].appointments.reduce((initial, appointment) => {
      if(appointments[appointment].interview === null) {
        initial++;
      }
      return initial;
    }, 0);
    //return new days array
    const newDaysArray = updateObjectInArray(copyOfDays, day[0].id, spots);
    return newDaysArray;
  }

  //function to spread array of days and update spot value
  function updateObjectInArray(array, id, spots) {
    return array.map((item) => {
      if (item.id !== id) {
        // This isn't the item we care about - keep it as-is
        return item
      }
      // Otherwise, this is the one we want - return an updated value
      return {
        ...item,
        spots
      }
    });
  };

  return { state, setDay, bookInterview, cancelInterview}
}
