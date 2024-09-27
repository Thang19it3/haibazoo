import React, { useState, useEffect, useRef  } from 'react';
import './App.css';

function App() {
  const [points, setPoints] = useState('10')
  const [numbers, setNumbers] = useState([])
  const [message, setMessage] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [time, setTime] = useState(0)
  const [btnGame, setBtnGame] = useState(false);
  const intervalRef = useRef(null);

  const handlePlay = () => {
    let newNumber = Array.from({ length: points }, (_, i) => ({
      num: i + 1,
      hidden: false,
      position: ramdomPositionBtn(),
    }));
    newNumber = newNumber.sort(() => Math.random() - 0.5)
    setNumbers(newNumber);
    setMessage('')
    setGameOver(false)
    setTime(0)
    setBtnGame(true);

    if (intervalRef.current){
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setTime(prevTime => (Number(prevTime) + 0.1).toFixed(1))
    },100)
  };

  const numberSortMin = () => {
    const numberSort = numbers.filter(numberObj => !numberObj.hidden);
    return Math.min(...numberSort.map(numObj => numObj.num))
  }

  const ramdomPositionBtn = () => {
    const divSize = 500;
    const btnSize = 20;
    const maxX = divSize - btnSize;
    const maxY = divSize - btnSize;
    const top = Math.random() * maxY;
    const left = Math.random() * maxX;
    return { top, left };
  }

  const handleClickBtn = (index) => {
    if (gameOver) return;

    const numberClick = numbers[index].num
    const minNumber = numberSortMin();

    if (numberClick === minNumber)
    {
      setTimeout(() => {
        setNumbers(prevNumbers => prevNumbers.map((numObj, i) => i === index ? {...numObj, hidden: true} : numObj))
      })
    } else {
      if (intervalRef.current){
        clearInterval(intervalRef.current)
      }
      setTimeout(() => {
        setNumbers(prevNumbers => prevNumbers.map((numObj, i) => i === index ? {...numObj, hidden: true} : numObj))
      })
      setMessage('GAME OVER')
      setGameOver(true)
    }
  }

  useEffect(() => {
    if(numbers.length > 0 && numbers.every(numObj => numObj.hidden)){
      setMessage("ALL CLEARED")
      if (intervalRef.current){
        clearInterval(intervalRef.current)
      }
    }
  },[numbers])

  const messStyle = {
    color: message === 'ALL CLEARED' ? '#00FF00' : message === 'GAME OVER' ? 'red' : 'black',
  };

  return (
    <div className='App'>
      <h3 style={messStyle}>{message ? message : "LET'S PLAY"}</h3>
      <div className='app-header'>
        <h5>Points:</h5>
        <input 
          type="text" 
          value={points} 
          onChange={(e) => setPoints(e.target.value)}
          placeholder="Nhập số n"
        />
        <h5>Time:</h5>
        <span>{time} s</span>
      </div>
      <button onClick={handlePlay}>{btnGame ? 'Reset' : 'Play'}</button>
      <div className='center-game'>
        {numbers.length > 0 && (
          <div className='btn-container'>
            {numbers.map(({num, hidden, position}, index) => (
                !hidden && (
                  <button 
                    key={index} 
                    className='number-btn'
                    onClick={() => handleClickBtn(index)}
                    style={{
                      top: `${position.top}px`,
                          left: `${position.left}px`,
                          zIndex: numbers.length - num + 1,
                    }}
                  >
                    {num}
                  </button>
                )
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
