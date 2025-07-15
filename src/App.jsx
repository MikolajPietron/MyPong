import { useEffect, useState, useRef } from 'react'
import './App.css'
import mypongGif from './assets/mypong.gif';
import mystartGif from './assets/spacestart.gif';
import myBall from './assets/ball.png';
import PunktyGracz1 from './assets/punktyPlayer1.png';
import PunktyGracz2 from './assets/punktyPlayer2.png';

function App() {
  const [paddleY, setPaddleY] = useState(350)
  const [paddleY2, setPaddleY2] = useState(350)
  const [Player2Points, setPlayer2Points] = useState(0)
  const [Player1Points, setPlayer1Points] = useState(0)
  const [gameOver, setGameOver] = useState(false);
  const [isgameStarted, setisGameStarted] = useState(false);
  

  const [ball, setBall] = useState({
    x: 965,
    y: 105,
    vx: 10,
    vy: 10,
  })
  const aiPaddleHitCount = useRef(0);

  const ballRef = useRef(ball);
  const keysPressed2 = useRef({})
  const paddleYRef = useRef(paddleY)
  const paddleY2Ref = useRef(paddleY2)

  useEffect(() => {
    function handleKeyDown(e) {
      if(e.code === 'Space' && !isgameStarted) {
        setisGameStarted(true);
        
      }
      keysPressed2.current[e.key] = true
      
    }
    function handleKeyUp(e) {
      
      keysPressed2.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const moveInterval = setInterval(() => {
      if (gameOver || !isgameStarted) return;
      
      setPaddleY(prev => {
  
  const paddleHeight = 200;
  const targetY = ballRef.current.y - paddleHeight / 2 + 15;
  const maxY = window.innerHeight - paddleHeight;

  const clampedTarget = Math.max(0, Math.min(targetY, maxY));
  const speed = aiPaddleHitCount.current < 2 ? 11 : 1;
  
    

  

  let newY = prev;

  if (clampedTarget > prev + speed) {
    newY = prev + speed;
  } else if (clampedTarget < prev - speed) {
    newY = prev - speed;
  } else {
    newY = clampedTarget;
  }

  paddleYRef.current = newY;
  return newY;
});


      
      setPaddleY2(prev => {
        let newY2 = prev
        if (keysPressed2.current['ArrowUp']) {
          newY2 = Math.max(prev - 15, 0)
        }
        if (keysPressed2.current['ArrowDown']) {
          newY2 = Math.min(prev + 15, window.innerHeight - 200)
        }
        paddleY2Ref.current = newY2
        return newY2
      })

      // Move ball
      setBall(prev => {
        let newX = prev.x + prev.vx
        let newY = prev.y + prev.vy
        let newVx = prev.vx
        let newVy = prev.vy

        // Bounce top/bottom
        if (newY <= 0 || newY >= window.innerHeight - 30) {
          newVy = -newVy
          aiPaddleHitCount.current = 0; 
        }

        // Left paddle collision
        if (
          newX <= 80 &&
          newY + 30 >= paddleYRef.current &&
          newY <= paddleYRef.current + 200
        ) {
          newX = 80
          newVx = Math.abs(newVx)+ 2
          aiPaddleHitCount.current += 1;
        }

        // Right paddle collision middle
        if (
          newX >= window.innerWidth - 130 && //naprawia overflow
          newY + 30 >= paddleY2Ref.current &&
          newY <= paddleY2Ref.current + 190
        ) {
          newX = window.innerWidth - 130
          newVx = -Math.abs(newVx) - 2
        }
        //Right paddle collision top

        // Reset if out of bounds
        if (newX <= 0) {
          newX = window.innerWidth / 2
          newY = window.innerHeight / 2
          newVx = 10 * (Math.random() > 0.5 ? 1 : -1)
          newVy = 10 * (Math.random() > 0.5 ? 1 : -1)
          setPlayer2Points(prevPoints => {
              const updated = prevPoints + 1;
              if (updated >= 10) setGameOver(true);
              return updated;
          })
        }
        if (newX >= innerWidth) {
          newX = window.innerWidth / 2
          newY = window.innerHeight / 2
          newVx = 10 * (Math.random() > 0.5 ? 1 : -1)
          newVy = 10 * (Math.random() > 0.5 ? 1 : -1)
          setPlayer1Points(prevPoints =>{
              const updated = prevPoints + 1;
              if (updated >= 10) setGameOver(true);
              return updated;
          })
        }

        const updatedBall =  { x: newX, y: newY, vx: newVx, vy: newVy }
        ballRef.current = updatedBall;
        return updatedBall;
      })
    }, 16)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      clearInterval(moveInterval)
    }
  }, [gameOver, isgameStarted])

  return (
    
    <div 
        className="gameContainer" 
        style={{ position: 'relative', height: '100vh' }}
        >
          <div
            className="leftPaddle"
            style={{
              position: 'absolute',
              top: paddleY + 'px',
              left: 50,
            }}
          />
          <div
            className="rightPaddle"
            style={{
              position: 'absolute',
              right: 50,
              top: paddleY2 + 'px',
            }}
          />
          <div className='myPongNapis'>
            <img src={mypongGif}></img>
          </div>
          

          


          <div className='rightText'><img src={PunktyGracz2} alt="Punkty Gracz 2" /> {Player2Points}</div>
          <div className='leftText'> <img src={PunktyGracz1} alt="Punkty Gracz 1" /> {Player1Points}</div>


          <div
            className="ball"
            style={{
              position: 'absolute',
              top: ball.y + 'px',
              left: ball.x + 'px',
              width: '30px',
              height: '30px',
              backgroundColor: 'red',
              borderRadius: '50%',
            }}
          >
            <img src = {myBall} alt="Ball" style={{ width: '100%', height: '100%' }} />
          </div>

        {gameOver && (
          <div className="winnerText">
            {Player1Points >= 10 ? 'Gracz 1 wygrał!' : 'Gracz 2 wygrał!'}
          </div>
      )}
        {!isgameStarted && (
          <div className='pressSpace'>
            <img src= {mystartGif} alt="Press Space to Start" />
          </div>
        )}
    </div>
  )
}

export default App
