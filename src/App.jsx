import React, { useState, useEffect, useRef, useCallback } from 'react';

const TimerApp = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [timingType, setTimingType] = useState("SESSION");
  const [play, setPlay] = useState(false);
  const audioRef = useRef();
  const [timeout, setTimeout] = useState(null);

  const handleBreakIncrease = useCallback(() => {
    if(breakLength < 60){
      setBreakLength(breakLength + 1)
    }
  }, [breakLength]);

  const handleBreakDecrease = useCallback(() => {
    if(breakLength > 1){
      setBreakLength(breakLength - 1)
    }
  }, [breakLength]);

  const handleSessionIncrease = useCallback(() => {
    if(sessionLength < 60){
      setSessionLength(sessionLength + 1)
      setTimeLeft(timeLeft + 60)
    }
  }, [sessionLength, timeLeft]);

  const handleSessionDecrease = useCallback(() => {
    if(sessionLength > 1){
      setSessionLength(sessionLength - 1)
      setTimeLeft(timeLeft - 60)
    }
  }, [sessionLength, timeLeft]);

  const handleReset = useCallback(() => {
    setPlay(false);
    setTimeLeft(1500);
    setBreakLength(5);
    setSessionLength(25);
    setTimingType("SESSION");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const handlePlay = useCallback(() => {
    setPlay(prevPlay => !prevPlay);
  }, []);

  const resetTimer = useCallback(() => {
    if(!timeLeft && timingType === "SESSION"){
      setTimeLeft(breakLength * 60)
      setTimingType("BREAK")
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
    if(!timeLeft && timingType === "BREAK"){
      setTimeLeft(sessionLength * 60)
      setTimingType("SESSION")
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [breakLength, sessionLength, timeLeft, timingType]);

  const clock = useCallback(() => {
    if(play){
      resetTimer();
    } else {
      clearTimeout(timeout);
    }
  }, [play, resetTimer]);

  useEffect(() => {
    clock();
  }, [clock]);

  useEffect(() => {
    let interval;
    if (play) {
      interval = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft => timeLeft - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [play, timeLeft]);

  const timeFormatter = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  }, [timeLeft]);

  const title = timingType === "SESSION" ? "Session" : "Break";

  return (
    <>
      <div className="wrapper">
        <div className="session-length">
          <h3 id="session-label">Session Length</h3>
          <div>
            <button className="btn" disabled={play} onClick={handleSessionDecrease} id="session-decrement">Decrease</button>
            <strong id="session-length">{sessionLength}</strong>
            <button className="btn" disabled={play} onClick={handleSessionIncrease} id="session-increment">Increase</button>
          </div>
        </div>

        <div className="break-session-length">
          <h3 id="break-label">Break Length</h3>
          <div>
            <button className="btn" disabled={play} onClick={handleBreakDecrease} id="break-decrement">Decrease</button>
            <strong id="break-length">{breakLength}</strong>
            <button className="btn" disabled={play} onClick={handleBreakIncrease} id="break-increment">Increase</button>
          </div>
        </div>
        
      </div>
      <div className="timer-wrapper">
        <div className="timer">
          <h2 id="timer-label">{title}</h2>
          <h3 id="time-left">{timeFormatter()}</h3>
        </div>

        <div className="controls">
          <button className="btn" onClick={handlePlay} id="start_stop">Start/Stop</button>
          <button className="btn" onClick={handleReset} id="reset">Reset</button>
        </div>
      </div>
    <audio
      ref={audioRef}
      id="beep" 
      preload="auto"
      src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" 
    />
  </>
);
}

export default TimerApp;