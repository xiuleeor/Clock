import React, { useState, useEffect, useRef } from 'react';
import "../Styles/clock.css";
import sun from '../Styles/sun.png';
import moon from "../Styles/moon.png"
import { BsArrowDownCircle, BsArrowUpCircle, BsFillReplyFill, BsPlayCircle, BsPauseCircle, BsFillBrightnessHighFill, BsFillMoonStarsFill } from "react-icons/bs";

function Clock() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const audioRef = useRef(null);
  const [day, setDay] = useState(true);

  useEffect(() => {
    if (timeLeft === 0) {
      audioRef.current.play();
      if (timerLabel === 'Session') {
        setTimeout(() => {
          setTimerLabel('Break');
          setTimeLeft(breakLength * 60);
        }, 1000);
      } else {
        setTimeout(() => {
          setTimerLabel('Session');
          setTimeLeft(sessionLength * 60);
        }, 1000);
      }
    }
  }, [timeLeft, timerLabel, breakLength, sessionLength]);
  
  function handleBreakDecrement() {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  }

  function handleBreakIncrement() {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  }

  function handleSessionDecrement() {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  }

  function handleSessionIncrement() {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  }

  function handleStartStop() {
    if (isRunning) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsRunning(false);
    } else {
      const id = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft > 0 && prevTimeLeft - 1);
      }, 1000);
      setIntervalId(id);
      setIsRunning(true);
    }
  }

  function handleReset() {
    clearInterval(intervalId);
    setIntervalId(null);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    setIsRunning(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  return (
    <div className={`container ${day ? "day" : "night"}`}>      
      <img src={day ? sun : moon} alt="sun" className='sun'/>
      <div className='header'>
        {!day ? <BsFillBrightnessHighFill onClick={()=>setDay(true)} className="iconday yellow"/> : <BsFillMoonStarsFill onClick={()=>setDay(false)} className='iconday'/>}
        <h1 className='title'>Clock</h1>
      </div>
      <div className='lengths'>
        <div className='length'>
          <div id="break-label" className='label'>Break Length</div>
          <button className="btn" id="break-decrement" onClick={handleBreakDecrement}>
          <BsArrowDownCircle className={`icon ${day ? "dark" : "ligth"}`}/>
          </button>
          <div id="break-length" className='length_text'>{breakLength}</div>
          <button className="btn" id="break-increment" onClick={handleBreakIncrement}>
            <BsArrowUpCircle className={`icon ${day ? "dark" : "ligth"}`}/>
          </button>
        </div>
        <div className='length'>
          <div id="session-label" className='label'>Session Length</div>
          <button className="btn" id="session-decrement" onClick={handleSessionDecrement}>
          <BsArrowDownCircle className={`icon ${day ? "dark" : "ligth"}`}/>
          </button>
          <div id="session-length" className='length_text'>{sessionLength}</div>
          <button className="btn" id="session-increment" onClick={handleSessionIncrement}>
            <BsArrowUpCircle className={`icon ${day ? "dark" : "ligth"}`}/>
          </button>
        </div>
      </div>
      <div className='clock'>
      <div className='timer'>
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>
      <div className='stop_reset'>
      <button id="start_stop" className="btn" onClick={handleStartStop}>
        {isRunning ? <BsPauseCircle className={`icon ${day ? "dark" : "ligth"}`}/> : <BsPlayCircle className={`icon ${day ? "dark" : "ligth"}`}/>}
      </button>
      <button className="btn" id="reset" onClick={handleReset}>
        <BsFillReplyFill className={`icon ${day ? "dark" : "ligth"}`}/>
      </button>
      </div>
      </div>
      
      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
}

export default Clock;
