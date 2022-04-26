import {useEffect, useReducer} from "react";
import axios from "axios";

export default function useApplicationData() {
  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });

  //constants for reducer function
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const UPDATE_SPOTS = "UPDATE_SPOTS"

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
        return {...state, appointments: appointments}
      }
      case UPDATE_SPOTS: {
        const days = calculateSpots(action.id, state.days, state.appointments)
        return {...state, days: days}
      };
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
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ])
    .then(all => {
      // setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    }) 
  }, [])
  
  function bookInterview(id, interview) {
    return new Promise((resolve, reject) => {
      // const appointment = {
      //   ...state.appointments[id],
      //   interview: { ...interview }
      // };
      // const appointments = {
      //   ...state.appointments,
      //   [id]: appointment
      // };
     axios.put(
        `http://localhost:8001/api/appointments/${id}`,
        {interview}
      )
      .then(res => {
        // let newStateObj = {...state, appointments}
        // setState(newStateObj)
        dispatch({ type: SET_INTERVIEW, id, interview });
        resolve()
        // const days = calculateSpots(id, state.days, appointments)
        // let updatedObj = {...newStateObj}
        // updatedObj.days = days
        // setState(updatedObj)
        dispatch({ type: UPDATE_SPOTS, id});
      })
      .catch(res => {
        console.log(res);
        reject()
      }); 
    })
  }

  //function to cancel appointment
  function cancelInterview(id) {
    return new Promise((resolve, reject) => {
      // const appointment = {
      //   ...state.appointments[id], interview: null
      // }
      // const appointments = {
      //   ...state.appointments,
      //   [id]: appointment
      // };
      axios.delete(
        `http://localhost:8001/api/appointments/${id}`
      )
      .then((res) => {
        // let newStateObj = {...state, appointments}
        dispatch({ type: SET_INTERVIEW, id, interview: null });
        // setState(newStateObj);
        resolve()
        // const days = calculateSpots(id, state.days, appointments)
        // let updatedObj = {...newStateObj}
        // updatedObj.days = days
        // setState(updatedObj)
        dispatch({ type: UPDATE_SPOTS, id});
      })
      .catch(err => reject(err))
    })
  }

  //function to calculate spots remaining
  function calculateSpots(id, days, appointments) {
    const copyOfDays = [...days]
    const day = days.filter(key => key.appointments.includes(id))
    const spots = day[0].appointments.reduce((initial, appointment) => {
      if(appointments[appointment].interview === null) {
        initial++
      }
      return initial;
    }, 0)
    const array = updateObjectInArray(copyOfDays, id, spots)
    // console.log("array is ", array)
    return array;
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
    })
  }

  return { state, setDay, bookInterview, cancelInterview}
}
