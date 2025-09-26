  import { useEffect, useState, useRef } from 'react'
  import {useNavigate} from 'react-router-dom';
  import './App.css'
 
  import mystartGif from './assets/Spacebar.gif';
  import myBall from './assets/FullA.png';
  import Logo from './assets/AtsAkanzaLogo.png';
  import BitSong from './assets/gameSong.mp3';
  import ChillSong from './assets/ChillLofiSong.mp3';
  import RockSong from './assets/RockSong.mp3';
  import NataliaPartyka from './assets/NataliaPartyka.jpeg';
  import AndrzejGrubba from './assets/AndrzejGrubba.jpg';
  import CurrentPlayer from './assets/NowyZawodnik.svg'
  import pingPongSound from './assets/pongSound.mp3';
  import { useLocation } from 'react-router-dom';
  import UserIcon from './assets/userIcon.png'
  import Icon from "@mdi/react";
  import { BACKEND_BASE_URL } from './apiConfig.js'; 
  import Ai from "./assets/ComputerPlayer.png";
  import EasyAi from "./assets/EasyPlayer.png";
  import HardAi from "./assets/HardPlayer.png";
  import AtsLogo from './assets/atsAkanzaLogoBlue.png'
  import AtsLogoGame from "./assets/AtsAkanza.svg"
  import { mdiPlay, mdiPause, mdiVolumeOff } from '@mdi/js';
  import { mdiGuitarElectric, mdiNintendoGameBoy, mdiSofaSingle, mdiTennisBall } from "@mdi/js";

  function App() {
    const navigate = useNavigate();
    

    function getSpeedFactor() {
    const baseWidth = 1920; 
    const baseHeight = 1080;

    const widthFactor = window.innerWidth  / baseWidth;
    const heightFactor = window.innerHeight / baseHeight;

    
    return Math.min(widthFactor, heightFactor);
  }
    const speedFactor = getSpeedFactor();
    const ballSpeedAdjustment = Math.pow(1 / speedFactor, 0.40);
    const MAX_BALL_SPEED = 15 * speedFactor; 

    
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
      vx:  5 * speedFactor * ballSpeedAdjustment * (Math.random() > 0.5 ? 1 : -1),
      vy:  5  * speedFactor * ballSpeedAdjustment * (Math.random() > 0.5 ? 1 : -1),
    })
    // const aiPaddleHitCount = useRef(0);ss

    const ballRef = useRef(ball);
    const keysPressed2 = useRef({})
    
    const paddleYRef = useRef(paddleY)
    const paddleY2Ref = useRef(paddleY2)
    const leftPaddleRef = useRef(null);
    const rightPaddleRef = useRef(null);
    const ballRefElement = useRef(null);
  const pingSoundRef = useRef(null);
  const audioRefs = useRef({});
  const gamePausedRef = useRef(gamePaused)
  const pongContainerRef = useRef(null);
  const [pauseShown, setPauseShown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false); 

  


 

 



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
      const [selectedMusic, setSelectedMusic] = useState(location.state?.selectedMusic || 'pingpong');
    const location2 = useLocation();
    const {selectedPlayer, currentUserName, selectedDifficulty} = location2.state || {};

    let playerImage = null;

    if(selectedPlayer === 'Grubba'){
      playerImage = AndrzejGrubba;
    }else if(selectedPlayer === 'Partyka'){
      playerImage = NataliaPartyka;
    }else if(selectedPlayer === 'currentUser'){
      playerImage = CurrentPlayer;
    }else{
      playerImage = null;
    }

const defaultAiImageSrc = Ai;


    

        function playPingSound() {
    if (!isMuted && selectedMusic === 'pingpong' && pingSoundRef.current) {
      
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
  const speed = 7 * speedFactor *ballSpeedAdjustment;

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

          setPaddleY2(newTop);  
      paddleY2Ref.current = newTop;  

          paddle.style.top = `${newTop}px`;
        }
      };

      

      
        
      

      function handleKeyDown(e) {
        if(e.code === 'Space' && !isgameStarted) {
          setisGameStarted(true);
          
        }
        if (e.key === 'Escape') {
          setGamePaused(true);
          setPauseShown(true);
          
        }
        keysPressed2.current[e.key] = true
        
      }
      
      function handleKeyUp(e) {
        
        keysPressed2.current[e.key] = false
      }
      window.addEventListener('touchmove', handleTouchMove, {passive: false});
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)

      // GLOWNY INTERVAL GRY ----------------------  GLOWNY INTERVAL GRY ----------------------  GLOWNY INTERVAL GRY ----------------------  GLOWNY INTERVAL GRY ----------------------

      const moveInterval = setInterval(() => {
        if (gameOver || !isgameStarted || gamePausedRef.current) return;
        const containerRect = pongContainerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

        setPaddleY(prev => {
    
    const paddleHeight = leftPaddleRef.current?.getBoundingClientRect().height || 150;
    const targetY = ballRef.current.y - paddleHeight / 2 + 15;
    const maxY = containerRect.height - paddleHeight - 4;


    const clampedTarget = Math.max(0, Math.min(targetY, maxY));
    
    let aiSpeed = 7.0; 
    if (selectedDifficulty === 'easy') {
        aiSpeed = 3.5; 
    }
    if(selectedDifficulty === 'normal') {
      aiSpeed = 5.5;
    }

    const speed = aiSpeed * speedFactor;
    
      

    

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
            newY2 = Math.min(prev + 9, maxTop);

            setPaddleDirection('down');
          }

          else if (keysPressed2.current['ArrowUp']) {
            
            newY2 = Math.max(prev - 9, 0);
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
       
      
        

        
  setBall(prev => {
    let { x, y, vx, vy } = prev;

    
    x += vx;
    y += vy;


    const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed > MAX_BALL_SPEED) {
    const scale = MAX_BALL_SPEED / speed;
    vx *= scale;
    vy *= scale;
  }
  setBallRotation(prevRotation => prevRotation + (vx * 0.5));

   
    const container = pongContainerRef.current;
    const ballElement = ballRefElement.current;
    const paddleLeftRect = leftPaddleRef.current?.getBoundingClientRect();
    const paddleRightRect = rightPaddleRef.current?.getBoundingClientRect();


    if (container && ballElement) {
      const containerRect = container.getBoundingClientRect();
      const ballRect = ballElement.getBoundingClientRect();

      // Bounce off top & bottom
      // Bounce off top & bottom
if (y <= 5) {
  vy = -vy;
  y = 5; // <--- Add this line to snap the ball to the top border
  playPingSound();
} else if (y + ballRect.height >= containerRect.height - 15) {
  vy = -vy;
  y = containerRect.height - 15 - ballRect.height; // <--- Add this line to snap the ball to the bottom border
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
    vx = Math.abs(vx) + 1; 
    
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
  



      }, 8)

      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
        clearInterval(moveInterval)
      }
    }, [gameOver, isgameStarted, isMuted, gamePaused])

    useEffect(() => {
  if (Player1Points >= 10 || Player2Points >= 10) {
    setGameOver(true);
    
  }
}, [Player1Points, Player2Points]);

//USEFFECT DO USTAWIENIA PILKI NA SRODKU ZAWSZE ----------------------------------------------------------------------------- USEFFECT DO USTAWIENIA PILKI NA SRODKU ZAWSZE
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

//USEEFFECT DO USTAWIENIA PALETEK NA SRODKU OSI ZAWSZE ---------------------------------------------------------------------- USEEFFECT DO USTAWIENIA PALETEK NA SRODKU OSI ZAWSZE 
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


    
    
//USEEFFECT DO DZWIEKOW NIE RUSZAC BO CHUJ WI JAK TO DZIALA ------------------------------------------------ USEEFFECT DO DZWIEKOW NIE RUSZAC BO CHUJ WI JAK TO DZIALA
    
    useEffect(() => {
        
      if (selectedMusic === 'pingpong') return;


    const audio = audioRefs.current[selectedMusic];
    if (audio) {
      audio.loop = true; 
      audio.muted = isMuted;

      
      if ( !gamePaused && !isMuted) {
        audio.play().catch(err => {
          console.log('Could not play audio:', err);
        });
      } else {
        audio.pause();
        audio.currentTime = 0; 
      }
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [selectedMusic, isMuted, gamePaused]);

   function handleMusicChange(musicName) {
    setSelectedMusic(musicName);
     
  }

// ZAPIS DO BAZY DANYCH ----------------------------------------- ZAPIS DO BAZY DANYCH ----------------------------------------- ZAPIS DO BAZY DANYCH -----------------------------------------
  const handleSaveGame = async () => {
    const difficultyMultiplier = selectedDifficulty === 'easy' ? 1
                             : selectedDifficulty === 'normal' ? 2
                             : 3;

  const hitsFactor = TotalHits > 0 ? TotalHits : 1;
  const basePoints = 100;
  const score = Math.ceil(difficultyMultiplier * (basePoints / hitsFactor)) *10;
  
  let playerNameForDb;

   if (selectedPlayer === 'currentUser') {
      playerNameForDb = currentUserName || 'Nieznajomy';
    } else if (selectedPlayer === 'Partyka') {
      playerNameForDb = 'Natalia Partyka';
    } else if (selectedPlayer === 'Grubba') {
      playerNameForDb = 'Andrzej Grubba';
    } else {
      
      playerNameForDb = 'Nieznajomy';
    }
   

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/gamescore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName: playerNameForDb,
        score: score,
        totalHits: TotalHits,
        difficulty : selectedDifficulty,
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
const isMobile = window.innerWidth <= 550;
const handleUnpause = () => {
    // If a countdown is already running, do nothing
    if (countdown > 0) return;

    // 1. Initiate the visual countdown and transition state
    setCountdown(3);
    setIsCountingDown(true);

    // Ensure the pause menu stays visible (pauseShown = true) 
    // and the game logic remains frozen (gamePaused = true) initially.
    
    // Set up the countdown interval, ticking every 1000ms (1 second)
    const countdownInterval = setInterval(() => {
        setCountdown(prev => {
            if (prev === 1) {
                // When countdown hits 1, it's time to UNPAUSE everything
                clearInterval(countdownInterval);
                
                // 2. CLOSE THE MODAL and UNFREEZE THE GAME LOGIC
                setPauseShown(false); 
                setGamePaused(false);
                setIsCountingDown(false); // Countdown is over

                return 0;
            }
            return prev - 1;
        });
    }, 1000); // 1000ms = 1 second interval
};



    return (
      
      <div 
          className="gameContainer" 
          style={{ position: 'relative', height: '100vh'}}
          >
            {isCountingDown && (
        <div className='pauseCountdown'>
            {countdown > 0 ? countdown : ''}
        </div>
    )}
            <img src={Logo} alt='Akanza Logo' className='logoapp' onClick={() => navigate("/")}/>
            <button className='mobilePauseToggle' onClick={() => {setPauseShown(true); setGamePaused(true)}}>
              <Icon path={mdiPause} className='pauseiconmobile' />
            </button>
            <div className='pressPause'>
              <h1 className='pressPauseText'>PRESS ESC TO PAUSE</h1>
            </div>
            <div className={`pauseMenu ${pauseShown ? 'show' : ''}`} >
              <div className='gamePausedContainer'>
                <h1 className='gamePaused'>Game Paused</h1>
              </div>
              <div className='pauseButtonContainer'>
                

                <button className='muteButton' onClick={() => setIsMuted(prev => !prev)}><Icon path={mdiVolumeOff}  className='muteicon'/></button>

                
              <button className='pauseButton' onClick={() =>{
               setPauseShown(false); handleUnpause();
               
              } }
              disabled={countdown > 0}
              ><Icon path={mdiPlay} className='pauseicon' /></button>
              
              </div>
              <div className='zmienandsong'>

              <div className='zmienmuzyke'>
                <h1 className='zmienmuzykeh1'>Change Music</h1>
              </div>
              
              <div className='songButtons'>
                <div className='arcadebitContainer'>
                  <button className='arcadebitButton' onClick={() => handleMusicChange('8bit')}></button>
                  <Icon path={mdiNintendoGameBoy}  className='biticon' color={"black"}/>
                </div>
                <div className='chillContainer'>
                  <button className='chillButton' onClick={() => handleMusicChange('chill')}></button>
                  <Icon path={mdiSofaSingle} className='chillicon'color={'black'}/>
                </div>
                <div className='rockContainer'>
                  <button className='rockButton' onClick={() => handleMusicChange('rock') } ></button>
                  <Icon path={mdiGuitarElectric} className='rockicon'color={"black"}/>
                </div>
                <div className='pingContainer'>
                  <button className='pingButton' onClick={() => handleMusicChange('pingpong')}></button>
                  <Icon path={mdiTennisBall} className='pingicon' color={"black"}/>
                </div>
              </div>
              </div>
              
              
              <h1 className='nacisnij'>ESC aby wznowic</h1>
              

          
            </div>

            
            

                <div className='pongPlusPlayer'>
                  
                      <div className='PlayerVsPlayer' >
                        <div className='ComputerContainer' >

                          
                            <div className='ComputerPlayer'>
    {selectedDifficulty === 'hard' ? (
        <>
            <Icon path={mdiTennisBall} color="white" size={2} className='hardIcon' />
            <Icon path={mdiTennisBall} color="white" size={2} className='hardIcon' />
            <Icon path={mdiTennisBall} color="white" size={2} className='hardIcon' />
        </>
    ) : selectedDifficulty === 'normal' ? (
        <>
            <Icon path={mdiTennisBall} color="white" size={2} className='normalIcon' />
            <Icon path={mdiTennisBall} color="white" size={2} className='normalIcon' />
        </>
    ) :  selectedDifficulty === 'easy' ? (
        <Icon path={mdiTennisBall}  color="white" size={2} className='easyIcon' />
    ) : (
        <img src={Ai} className='KomputerImageGame'
          
        ></img>
    )}
</div>
                            <div className='ComputerText'>Komputer</div>
                        
                          
                        </div>
                        <div className='vsImage'></div>
                        <div className='humanPlayerContainer' >
                          
                          <div className='HumanPlayer'
                        
                              style={{
                                backgroundImage: playerImage ? `url(${playerImage})` : 'none',
                                justifyContent : "center",
                                placeItems : "center",
                                backgroundSize: isMobile ? "100%" : "100%",
                                backgroundPositionX : "50%",
                                backgroundPositionY : "30%"
                                
                                
                              }}
                              
                              >
                                
                            {!playerImage && <img src={UserIcon} className="defaultUser" />}
                          </div>
                          
                          
                          
                          
                                                  
                          <div className='playerName'>
  {selectedPlayer === 'currentUser'
    ? (currentUserName || 'Nieznajomy')
    : (selectedPlayer || 'Nieznajomy')} 
</div>
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
                                  width: '65%',
                                  height: '65%',
                                  position: 'absolute',
                                  left: '50%',
                                  top: '50%',
                                  transform: `translate(-50%, -50%) rotate(${ballRotation}deg)`,
                                  transition: 'transform 0.05s linear', // makes spin smooth
                                }}
                              />
                            </div>

                    </div>

                    
                </div>
                <div className='bottomPoints'>
                      <div className='Player1points'><span className='player2pointstext'>{Player1Points}</span></div>
                      <div className='Player2points'><span className='player1pointstext'>{Player2Points}</span></div>
                    </div>
            
            
            
            

            


            


            

          {gameOver && (
            <div className="winContainer">
              <div className='winnerText'>
              {Player1Points >= 10 ? 'Przegrana!' : 'Wygrana!!!'}
              </div>
              <button className='playAgain' onClick={() => navigate('/')}>Play again!</button>
              <button className='zapiszWynik'  onClick={handleSaveGame}>Save your score!</button>
              

            </div>
        )}


        </div>
          
     
    )
  }

  export default App
