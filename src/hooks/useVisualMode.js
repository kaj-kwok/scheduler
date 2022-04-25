import {useState} from 'react'

export default function useVisualMode(initial, nextMode) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(nextMode, option = false) {
    setMode(nextMode);
    if(option === true) {
      setHistory((prev) => [...prev.slice(0, -1), nextMode]);
    } else {
      setHistory((prev) => [...prev, nextMode])
    } 
  }

  function back() {
    let prev = []
    if(history.length > 1){
      prev = [...history].slice(0, -1)
    } else {
      prev = [...history]
    }
    setHistory(prev)
    // setHistory((prev) => [...prev.slice(0, -1)]);
    setMode(prev[prev.length-1])
  }
  
  return {mode, transition, back}
}
