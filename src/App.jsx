  import { useEffect, useState, useRef } from 'react'
  import {useNavigate} from 'react-router-dom';
  import './App.css'
  import mypongGif from './assets/mypong.gif';
  import mystartGif from './assets/Spacebar.gif';
  import myBall from './assets/FullA.png';
  import PunktyGracz1 from './assets/punktyPlayer1.png';
  import PunktyGracz2 from './assets/punktyPlayer2.png';
  import BitSong from './assets/gameSong.mp3';
  import ChillSong from './assets/ChillLofiSong.mp3';
  import RockSong from './assets/RockSong.mp3';
  import NataliaPartyka from './assets/NataliaPartyka.png';
  import AndrzejGrubba from './assets/AndrzejGrubba.jpg';
  import CurrentPlayer from './assets/userIconBlackBg2.png'
  import pingPongSound from './assets/pongSound.mp3';
  import { useLocation } from 'react-router-dom';
  import UserIcon from './assets/userIcon.png'
  import Icon from "@mdi/react";
  import Ai from "./assets/ComputerPlayer.png";
  import AtsLogo from './assets/atsAkanzaLogoBlue.png'
  import { mdiBagPersonalPlusOutline, mdiPause, mdiVolumeOff } from '@mdi/js';

  function App() {
    const navigate = useNavigate();

    function getSpeedFactor() {
    const baseWidth = 1920; 
    const baseHeight = 1080;

    const widthFactor = window.innerWidth / baseWidth;
    const heightFactor = window.innerHeight / baseHeight;

    
    return Math.min(widthFactor, heightFactor);
  }
    const speedFactor = getSpeedFactor();
    const MAX_BALL_SPEED = 40 * speedFactor; 

    const [aiPaddleHits, setAiPaddleHits] = useState(0);
    const [paddleY, setPaddleY] = useState(200)
    const [paddleY2, setPaddleY2] = useState(200)
    const [Player2Points, setPlayer2Points] = useState(0)
    const [Player1Points, setPlayer1Points] = useState(0)
    const [gameOver, setGameOver] = useState(false);
    const [isgameStarted, setisGameStarted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [gamePaused, setGamePaused] = useState(false);
    const [paddleDirection, setPaddleDirection] = useState(null); 
    const [ballRotation, setBallRotation] = useState(0);
    const [TotalHits, setTotalHits] = useState(0);
    


    

    const [ball, setBall] = useState({
      
      x: 0,
      y: 0,
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
  const pongContainerRef = useRef(null);
  const lastHitRef = useRef(null);


   const moveIntervalRef = useRef(null);

  function movePaddleUp() {
    setPaddleY2(prev => {
      const containerHeight = pongContainerRef.current?.getBoundingClientRect().height || 0;
      const paddleHeight = rightPaddleRef.current?.getBoundingClientRect().height || 0;
      return Math.max(prev - 5, 0);  // smaller step for smoothness
    });
  }

  function movePaddleDown() {
    setPaddleY2(prev => {
      const containerHeight = pongContainerRef.current?.getBoundingClientRect().height || 0;
      const paddleHeight = rightPaddleRef.current?.getBoundingClientRect().height || 0;
      const maxPos = containerHeight - paddleHeight - 5;
      return Math.min(prev + 5, maxPos);
    });
  }

  // Start moving up
  function handleMouseDownUp() {
    if (moveIntervalRef.current) return;  // prevent multiple intervals
    moveIntervalRef.current = setInterval(movePaddleUp, 16); // ~60fps
  }

  // Start moving down
  function handleMouseDownDown() {
    if (moveIntervalRef.current) return;
    moveIntervalRef.current = setInterval(movePaddleDown, 16);
  }

  // Stop moving
  function handleMouseUp() {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  }



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
    const {selectedPlayer, currentUserName} = location2.state || {};

    let playerImage = null;

    if(selectedPlayer === 'andrzejGrubba'){
      playerImage = AndrzejGrubba;
    }else if(selectedPlayer === 'nataliaPartyka'){
      playerImage = NataliaPartyka;
    }else if(selectedPlayer === 'currentUser'){
      playerImage = CurrentPlayer;
    }else{
      playerImage = null;
    }

    // const playerImage = selectedPlayer === 'nataliaPartyka'
    // ? NataliaPartyka
    // : selectedPlayer === 'andrzejGrubba'
    // ? AndrzejGrubba
    // : selectedPlayer === 'currentUser'
    // ?
    //   : null;

        function playPingSound() {
    if (!isMuted && selectedMusic === 'ping' && pingSoundRef.current) {
      pingSoundRef.current.pause();
      pingSoundRef.current.currentTime = 0;
      pingSoundRef.current.play().catch(err => console.log('Ping sound error:', err));
    }
  }
  function resetBall(direction = 1) {
  const container = pongContainerRef.current;
  if (!container) {
    return { x: 0, y: 0, vx: 0, vy: 0 };
  }
  const rect = container.getBoundingClientRect();
  const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6; // random angle
  const speed = 14 * speedFactor;

  return {
    x: rect.width / 2,
    y: rect.height / 2,
    vx: speed * direction * Math.cos(angle),
    vy: speed * Math.sin(angle),
  };
}





    useEffect(() => {

    




      gamePausedRef.current = gamePaused;
      const handleTouchMove = (e) => {
        e.preventDefault();
        setisGameStarted(true);

        
        const touchY = e.touches[0].clientY;
        const paddle = document.querySelector('.rightPaddle');
        const container = pongContainerRef.current;


        if(paddle && container) {
          const containerRect = container.getBoundingClientRect();
          const paddleHeight = paddle.offsetHeight;


          let newTop = touchY - containerRect.top - paddleHeight / 2;
          newTop = Math.max(0, Math.min(newTop, container.offsetHeight - paddleHeight - 5));

          setPaddleY2(newTop);  // update the state so it's reactive
      paddleY2Ref.current = newTop;  // keep ref updated for game loop

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
        const containerRect = pongContainerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

        setPaddleY(prev => {
    
    const paddleHeight = leftPaddleRef.current?.getBoundingClientRect().height || 150;
    const targetY = ballRef.current.y - paddleHeight / 2 + 15;
    const maxY = containerRect.height - paddleHeight - 4;


    const clampedTarget = Math.max(0, Math.min(targetY, maxY));
    const speed = 8.6 * speedFactor + 5;
    
      

    

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
            const maxTop = containerRect.height - paddleHeight - 5;
            newY2 = Math.min(prev + 15, maxTop);

            setPaddleDirection('down');
          }

          else if (keysPressed2.current['ArrowUp']) {
            
            newY2 = Math.max(prev - 15, 0);
            setPaddleDirection('up');
          } else{
            setPaddleDirection(null);
          }
          paddleY2Ref.current = newY2
          return newY2
        })
        function isColliding(rect1, rect2) {
          return !(
            rect1.right + 5 < rect2.left ||
            rect1.left -3 > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
          );
        }
        function getVelocityIncrement() {
          const baseIncrement = 2; 
          const speedFactor = getSpeedFactor();
          return baseIncrement * speedFactor;
        }
      
        

        
  setBall(prev => {
    let { x, y, vx, vy } = prev;

    // Update position
    x += vx;
    y += vy;


    const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed > MAX_BALL_SPEED) {
    const scale = MAX_BALL_SPEED / speed;
    vx *= scale;
    vy *= scale;
  }
  setBallRotation(prevRotation => prevRotation + (vx * 0.5));

    // Get container size
    const container = pongContainerRef.current;
    const ballElement = ballRefElement.current;
    const paddleLeftRect = leftPaddleRef.current?.getBoundingClientRect();
    const paddleRightRect = rightPaddleRef.current?.getBoundingClientRect();


    if (container && ballElement) {
      const containerRect = container.getBoundingClientRect();
      const ballRect = ballElement.getBoundingClientRect();

      // Bounce off top & bottom
      if (y <= 5 || y + ballRect.height >= containerRect.height - 15) {
        vy = -vy;
        playPingSound();
      }

      // Bounce off left & right
      if (x <= 0) {
  const newBall = resetBall(1); // send ball to the right
  setPlayer2Points(prev => prev + 1);
  ballRef.current = newBall;
  return newBall;
}

if (x + ballRect.width >= containerRect.width) {
  const newBall = resetBall(-1); // send ball to the left
  setPlayer1Points(prev => prev + 1);
  ballRef.current = newBall;
  return newBall;
}

      // Collision with left Paddle
  if (isColliding(ballRect, paddleLeftRect) && vx < 0) {
    vx = Math.abs(vx) + 1; // Reflect to the right
    // Slight push-out to avoid sticking
    playPingSound();
    setTotalHits(prev => prev + 1);
  }








  if (isColliding(ballRect, paddleRightRect) && vx > 0) {
  // Reflect ball horizontally
  vx = -Math.abs(vx) - 1;
  playPingSound();
  setTotalHits(prev => prev + 1);

  // Calculate paddle center and ball center Y positions
  const paddleCenterY = paddleRightRect.top + paddleRightRect.height / 2;
  const ballCenterY = ballRect.top + ballRect.height / 2;

  // Calculate how far from the center the ball hit the paddle (range approx -1 to 1)
  const relativeIntersectY = (ballCenterY - paddleCenterY) / (paddleRightRect.height / 2);

  // Max bounce angle in radians (about 60 degrees)
  const maxBounceAngle = (60 * Math.PI) / 180;

  // Calculate the bounce angle based on where it hit the paddle
  const bounceAngle = relativeIntersectY * maxBounceAngle;

  // Calculate new speeds using the angle and current speed magnitude
  const speed = Math.sqrt(vx * vx + vy * vy);

  vx = -Math.abs(speed * Math.cos(bounceAngle)); // always going left after hitting right paddle
  vy = speed * Math.sin(bounceAngle);

  // Optionally add some paddle direction spin effect if you want
  if (paddleDirection === 'down') {
    vy += 3 * speedFactor;
  } else if (paddleDirection === 'up') {
    vy -= 3 * speedFactor;
  }



 

  
}





    }

    ballRef.current = { x, y, vx, vy };
    return { x, y, vx, vy };
  });
  



      }, 16)

      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
        clearInterval(moveInterval)
      }
    }, [gameOver, isgameStarted, isMuted, gamePaused])

    useEffect(() => {
  if (Player1Points >= 1 || Player2Points >= 1) {
    setGameOver(true);
    
  }
}, [Player1Points, Player2Points]);

useEffect(() => {
  const container = pongContainerRef.current;
  if (container) {
    const rect = container.getBoundingClientRect();
    setBall(prev => ({
      ...prev,
      x: rect.width / 2,
      y: rect.height / 2,
    }));
    ballRef.current = {
      ...ballRef.current,
      x: rect.width / 2,
      y: rect.height / 2,
    };
  }
}, []); 


useEffect(() => {
  const container = pongContainerRef.current;
  if (container) {
    const containerHeight = container.getBoundingClientRect().height;
    const paddleHeight = leftPaddleRef.current?.offsetHeight || 150;

    const centerY = containerHeight / 2 - paddleHeight / 2;

    setPaddleY(centerY);
    setPaddleY2(centerY);

    paddleYRef.current = centerY;
    paddleY2Ref.current = centerY;
  }
}, []);


    
    
    
    
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


  const handleSaveGame = async () => {
  const score = TotalHits * 10;

  try {
    const response = await fetch('http://localhost:5000/api/gamescore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName: currentUserName,
        score: score,
        totalHits: TotalHits
      }),
    });
    
    const data = await response.json();
    console.log('Success:', data);
    alert('Wynik zapisany!');
    setTotalHits(0);
  } catch (error) {
    console.error('Error:', error);
    alert('Błąd podczas zapisu wyniku');
  }
};



    return (
      
      <div 
          className="gameContainer" 
          style={{ position: 'relative', height: '100vh'}}
          >
            <h1 className='pongByATS'>Pong by ATS</h1>
            <div className='muteButtonContainer'>
              <button className='muteButton' onClick={() => setIsMuted(prev => !prev)}/>
              <Icon path={mdiVolumeOff}  className='muteicon' />
            </div>

            <div className='pauseButtonContainer'>
              <button className='pauseButton' onClick={() => setGamePaused(prev => !prev)} />
              <Icon path={mdiPause} className='pauseicon' />

            </div>

                <div className='pongPlusPlayer'>
                  
                      <div className='PlayerVsPlayer'>
                        <div className='ComputerPlayer'>
                          <img src={Ai} className='ComputerImage'></img>
                        </div>
                        <div className='vsImage'></div>
                        <div className='HumanPlayer'
     style={{
       backgroundImage: playerImage ? `url(${playerImage})` : 'none',
       
     }}>
  {!playerImage && <img src={UserIcon} className="defaultUser" />}
   <h1>{selectedPlayer === 'currentUser' ? currentUserName : selectedPlayer}!</h1>
</div>

                      </div>

                
                    <div className='pongContainer' ref={pongContainerRef}>
                      {!isgameStarted && (
                      <div className='pressSpace'>
                        <img src= {mystartGif} alt="Press Space to Start" />
                      </div>
                                        )}

                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: '50%',
                          width: '2px',               // line thickness
                          marginLeft: '-1px',          // center the line exactly at 50%
                          borderLeft: '2px dashed white', // dashed white line
                          pointerEvents: 'none',       // makes sure clicks pass through the line
                          zIndex: 10,                  // above background but below paddles/ball
                        }}
                      />

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
                              
                              backgroundColor:'white'
                            }}
                          />
                            <div
                              className="ball"
                              ref={ballRefElement}
                              style={{
                                position: 'absolute',
                                top: ball.y + 'px',
                                left: ball.x + 'px',
                              }}
                            >
                              <img
                                src={myBall}
                                alt="Ball"
                                style={{
                                  width: '80%',
                                  height: '80%',
                                  position: 'absolute',
                                  left: '50%',
                                  top: '50%',
                                  transform: `translate(-50%, -50%) rotate(${ballRotation}deg)`,
                                  transition: 'transform 0.05s linear', // makes spin smooth
                                }}
                              />
                            </div>

                    </div>

                    <div className='bottomPoints'>
                      <div className='Player1points'><span className='player2pointstext'>{Player1Points}</span></div>
                      <div className='Player2points'><span className='player1pointstext'>{Player2Points}</span></div>
                    </div>
                </div>
            
            
            
            

            


            


            

          {gameOver && (
            <div className="winContainer">
              <div className='winnerText'>
              {Player1Points >= 2 ? 'Przegrana!' : 'Wygrana!!!'}
              </div>
              <button className='playAgain' onClick={() => navigate('/')}>Zagraj jeszcze raz!</button>
              <button className='zapiszWynik'  onClick={handleSaveGame}>Zapisz wynik!</button>
              <img src= {AtsLogo} alt = "AtsAkanzaLogo" className='winnerAts'></img>

            </div>
        )}
        <div className='moveButtonsMobile'>
          <button
  className='upButton'
  
  onTouchStart={handleMouseDownUp}
  onTouchEnd={handleMouseUp}
  onTouchCancel={handleMouseUp}
>
  <span className='arrowUp'>&uarr;</span>
</button>

<button
  className='downButton'
  
  onTouchStart={handleMouseDownDown}
  onTouchEnd={handleMouseUp}
  onTouchCancel={handleMouseUp}
>
  <span className='arrowUp'>&darr;</span>
</button>

        </div>
          
      </div>
    )
  }

  export default App
