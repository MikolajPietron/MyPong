import { useEffect, useState, useRef } from 'react'
import './App.css'
import mypongGif from './assets/mypong.gif';
import mystartGif from './assets/spacestart.gif';
import myBall from './assets/ball.png';
import PunktyGracz1 from './assets/punktyPlayer1.png';
import PunktyGracz2 from './assets/punktyPlayer2.png';
import BitSong from './assets/gameSong.mp3';
import ChillSong from './assets/ChillLofiSong.mp3';
import RockSong from './assets/RockSong.mp3';
import NataliaPartyka from './assets/nataliaPartyka.png';
import AndrzejGrubba from './assets/andrzejGrubba.jpg';
import pingPongSound from './assets/pingPongSound.mp3';
import { useLocation } from 'react-router-dom';
import Icon from "@mdi/react";
import { mdiBagPersonalPlusOutline, mdiPause, mdiVolumeOff } from '@mdi/js';

function App() {


  function getSpeedFactor() {
  const baseWidth = 1920; 
  const baseHeight = 1080;

  const widthFactor = window.innerWidth / baseWidth;
  const heightFactor = window.innerHeight / baseHeight;

  
  return Math.min(widthFactor, heightFactor);
}
  const speedFactor = getSpeedFactor();

  const [aiPaddleHits, setAiPaddleHits] = useState(0);
  const [paddleY, setPaddleY] = useState(350)
  const [paddleY2, setPaddleY2] = useState(350)
  const [Player2Points, setPlayer2Points] = useState(0)
  const [Player1Points, setPlayer1Points] = useState(0)
  const [gameOver, setGameOver] = useState(false);
  const [isgameStarted, setisGameStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  

  const [ball, setBall] = useState({
    
    x: 965,
    y: 105,
    vx: 10 * speedFactor * (Math.random() > 0.5 ? 1 : -1),
    vy: 10 * speedFactor * (Math.random() > 0.5 ? 1 : -1),
  })
  // const aiPaddleHitCount = useRef(0);

  const ballRef = useRef(ball);
  const keysPressed2 = useRef({})
  const escPressed = useRef({});
  const paddleYRef = useRef(paddleY)
  const paddleY2Ref = useRef(paddleY2)
  const leftPaddleRef = useRef(null);
  const rightPaddleRef = useRef(null);
  const ballRefElement = useRef(null);
 const pingSoundRef = useRef(null);
const audioRefs = useRef({});
const gamePausedRef = useRef(gamePaused)

useEffect(() => {
  pingSoundRef.current = new Audio(pingPongSound);

  audioRefs.current['8bit'] = new Audio(BitSong);
  audioRefs.current['chill'] = new Audio(ChillSong);
  audioRefs.current['rock'] = new Audio(RockSong);

  Object.values(audioRefs.current).forEach(audio => {
    audio.loop = true;
  });

  return () => {
    if (pingSoundRef.current) {
      pingSoundRef.current.pause();
      pingSoundRef.current.src = '';
    }
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.src = '';
    });
  };
}, []);


  
  
  const location = useLocation();
      const selectedMusic = location.state?.selectedMusic || null;
  const location2 = useLocation();
  const {selectedPlayer} = location2.state || {};


  const playerImage = selectedPlayer === 'nataliaPartyka'
  ? NataliaPartyka
  : selectedPlayer === 'andrzejGrubba'
    ? AndrzejGrubba
    : null;

      function playPingSound() {
  if (!isMuted && selectedMusic === 'ping' && pingSoundRef.current) {
    pingSoundRef.current.pause();
    pingSoundRef.current.currentTime = 0;
    pingSoundRef.current.play().catch(err => console.log('Ping sound error:', err));
  }
}




  useEffect(() => {
    gamePausedRef.current = gamePaused;
    const handleTouchMove = (e) => {
      e.preventDefault();
      setisGameStarted(true);
      const touchY = e.touches[0].clientY;
      const paddle = document.querySelector('.rightPaddle');
      const container = document.querySelector('.gameContainer');

      if(paddle && container) {
        const containerRect = container.getBoundingClientRect();
        const paddleHeight = paddle.offsetHeight;


        let newTop = touchY - containerRect.top - paddleHeight / 2;
        newTop = Math.max(0, Math.min(newTop, container.offsetHeight - paddleHeight));

        paddle.style.top = `${newTop}px`;
      }
    };

    

    
      
    

    function handleKeyDown(e) {
      if(e.code === 'Space' && !isgameStarted) {
        setisGameStarted(true);
        
      }
      if (e.key === 'Escape') {
        setGamePaused(prev => !prev);
      }
      keysPressed2.current[e.key] = true
      
    }
    
    function handleKeyUp(e) {
      
      keysPressed2.current[e.key] = false
    }
    window.addEventListener('touchmove', handleTouchMove, {passive: false});
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const moveInterval = setInterval(() => {
      if (gameOver || !isgameStarted || gamePausedRef.current) return;
      
      setPaddleY(prev => {
  
  const paddleHeight = leftPaddleRef.current?.getBoundingClientRect().height || 200;
  const targetY = ballRef.current.y - paddleHeight / 2 + 15;
  const maxY = window.innerHeight - paddleHeight;

  const clampedTarget = Math.max(0, Math.min(targetY, maxY));
  const speed = 8.6 * speedFactor + 10;
  
    

  

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
        if (keysPressed2.current['ArrowDown']) {
          const paddleHeight = rightPaddleRef.current?.getBoundingClientRect().height || 200;
          newY2 = Math.min(prev + 15, window.innerHeight - paddleHeight);
        }

        if (keysPressed2.current['ArrowUp']) {
          
          newY2 = Math.max(prev - 15, 0);
        }
        paddleY2Ref.current = newY2
        return newY2
      })
      function isColliding(rect1, rect2) {
        return !(
          rect1.right < rect2.left ||
           rect1.left > rect2.right ||
          rect1.bottom < rect2.top ||
          rect1.top > rect2.bottom
        );
      }
      function getVelocityIncrement() {
        const baseIncrement = 2; 
        const speedFactor = getSpeedFactor();
        return baseIncrement * speedFactor;
      }
     
      

      // Move ball
      setBall(prev => {
        const velocityIncrement = getVelocityIncrement();
        let newX = prev.x + prev.vx
        let newY = prev.y + prev.vy
        let newVx = prev.vx
        let newVy = prev.vy

        const ballRect = ballRefElement.current?.getBoundingClientRect();
        const leftPaddleRect = leftPaddleRef.current?.getBoundingClientRect();
        const rightPaddleRect = rightPaddleRef.current?.getBoundingClientRect();

        // Bounce top/bottom
        if (newY <= 0 || newY + ballRect.height >= window.innerHeight) {
          newVy = -newVy
          
        }

        // Left paddle collision
        if (
          ballRect && leftPaddleRect && isColliding(ballRect, leftPaddleRect)
        ) {
          newX = leftPaddleRect.right + 1
          if(newVx < 0) {
          newVx = Math.abs(newVx)+ velocityIncrement;
          setAiPaddleHits(h => h + 1);
          playPingSound();
        }
      }

        // Right paddle collision middle
        if (
          ballRect && rightPaddleRect && isColliding(ballRect, rightPaddleRect)
          
        ) {
          newX = rightPaddleRect.left - ballRect.width - 1
          if(newVx > 0) {
          newVx = -Math.abs(newVx);
          playPingSound();
        }
      }
        //Right paddle collision top

        // Reset if out of bounds
        if (newX <= 0) {
          setAiPaddleHits(0);
          newX = window.innerWidth / 2
          newY = window.innerHeight / 2
          const speedFactor = getSpeedFactor();
          newVx = 10 * speedFactor * (Math.random() > 0.5 ? 1 : -1);
          newVy = 10 * speedFactor * (Math.random() > 0.5 ? 1 : -1);

          setPlayer2Points(prevPoints => {
              const updated = prevPoints + 1;
              if (updated >= 10) setGameOver(true);
              return updated;
          })
        }
        if (newX >= innerWidth) {
          setAiPaddleHits(0);
          newX = window.innerWidth / 2
          newY = window.innerHeight / 2
          const speedFactor = getSpeedFactor();
          newVx = 10 * speedFactor * (Math.random() > 0.5 ? 1 : -1);
          newVy = 10 * speedFactor * (Math.random() > 0.5 ? 1 : -1);

          setPlayer1Points(prevPoints =>{
              const updated = prevPoints + 1;
              if (updated >= 10) setGameOver(true);
              return updated;
          })
        }

        // Left paddle jezeli uzezamy koncami
        if (isColliding(ballRect, leftPaddleRect)) {
          const paddleCenter = leftPaddleRect.top + leftPaddleRect.height / 2;
          const offset = (ballRect.top + ballRect.height / 2) - paddleCenter;
          newVy += offset * 0.1; 
        }
        if (isColliding(ballRect, rightPaddleRect)) {
          const paddleCenter = rightPaddleRect.top + rightPaddleRect.height / 2;
          const offset = (ballRect.top + ballRect.height / 2) - paddleCenter;
          newVy += offset * 0.1; 
        }


        const updatedBall =  { x: newX, y: newY, vx: newVx, vy: newVy }
        ballRef.current = updatedBall;
        return updatedBall;
      })
    }, 16)

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      clearInterval(moveInterval)
    }
  }, [gameOver, isgameStarted, isMuted, gamePaused])
  
  
  
  
  useEffect(() => {
      
     if (selectedMusic === 'pingpong') return;


  const audio = audioRefs.current[selectedMusic];
  if (audio) {
    audio.loop = true; // Make sure it loops
    audio.muted = isMuted;

    // Only play if not muted
    if ( !gamePaused && !isMuted) {
      audio.play().catch(err => {
        console.log('Could not play audio:', err);
      });
    } else {
      audio.pause();
      audio.currentTime = 0; // Reset to start
    }
  }

  return () => {
    if (audio) {
      audio.pause();
    }
  };
}, [selectedMusic, isMuted, gamePaused]);


  return (
    
    <div 
        className="gameContainer" 
        style={{ position: 'relative', height: '100vh' }}
        >
          
          <div className='muteButtonContainer'>
            <button className='muteButton' onClick={() => setIsMuted(prev => !prev)}/>
            <Icon path={mdiVolumeOff}  className='muteicon' />
          </div>

          <div className='pauseButtonContainer'>
            <button className='pauseButton' onClick={() => setGamePaused(prev => !prev)} />
            <Icon path={mdiPause} className='pauseicon' />

          </div>
          <div
            className="leftPaddle"
            ref = {leftPaddleRef}
            style={{
              position: 'absolute',
              top: paddleY + 'px',
              
            }}
          />
          <div
            className="rightPaddle"
            ref={rightPaddleRef}
            style={{
              position: 'absolute',
              top: paddleY2 + 'px',
              backgroundImage: playerImage ? `url(${playerImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: '60% center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: playerImage ? 'transparent' : '#ffffff',
            }}
          />
          <div className='myPongNapis'>
            <img src={mypongGif}></img>
          </div>
          

          


          <div className='rightText'><img src={PunktyGracz2} alt="Punkty Gracz 2" /><span className='player2pointstext'>{Player2Points}</span> </div>
          <div className='leftText'> <img src={PunktyGracz1} alt="Punkty Gracz 1" /><span className='player1pointstext'>{Player1Points}</span></div>


          <div
            className="ball"
            ref={ballRefElement}
            style={{
              position: 'absolute',
              top: ball.y + 'px',
              left: ball.x + 'px',
              
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
