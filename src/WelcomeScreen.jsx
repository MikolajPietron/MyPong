import React, { useState, useRef, use } from 'react';
import mypongGif from './assets/mypongWelcome.gif';
import WelcomeScreenBackground from './assets/WelcomeScreenBackground.png';
import './WelcomeScreen.css';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal.jsx';
import BitSong from './assets/gameSong.mp3';
import ChillSong from './assets/ChillLofiSong.mp3';
import RockSong from './assets/RockSong.mp3';
import PingPong from './assets/pingPongSound.mp3';
import BackgroundPaddles from './assets/backgroundPaddles.png';
import PasekDoRozdzielania from './assets/pasekDoRozdzielenia.png';
import Logo from './assets/AtsAkanzaLogo.png';
import Icon from "@mdi/react";
import CurrentUser from './assets/userIconBlackBg.png';
import LeaderBoard from './LeaderBoard.jsx';
import HardPlayer from './assets/HardPlayer.png';
import EasyPlayer from './assets/EasyPlayer.png';
import bluePhoto from "./assets/welcomeScreenPhoto_blue.webp"



import { mdiGuitarElectric, mdiHome, mdiHumanHandsup, mdiNintendoGameBoy, mdiSofaSingle, mdiTennisBall,mdiCog, mdiAccount, mdiMusic, mdiTableTennis  } from "@mdi/js";


function WelcomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigation = useNavigate();
  const audio8bitRef = useRef(new Audio(BitSong));
  const audioChillRef = useRef(new Audio(ChillSong));
  const audioRockRef = useRef(new Audio(RockSong));
  const audioPingRef = useRef(new Audio(PingPong)); 
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isShown, setIsShown] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showMusicIcons, setShowMusicIcons] = useState(false);
  const [currentUserName, setCurrnetUserName] = useState(null);
  const [showOponent, setShownOponent] = useState(false);
const [selectedDifficulty, setSelectedDifficulty] = useState(null);
const [selectedOpponent, setSelectedOpponent] = useState(null);
const [isSettingsShown, setSettingsShown] = useState(false);

const musicNames = {
  "8bit": "8bit",
  chill: "Chill",
  rock: "Rock",
  ping: "Ping"
};
const difficultyNames = {
  easy: "Easy",
  normal : "Normal",
  hard: "Hard"
};

  const handleGameNavigation = (e) => {
    e.preventDefault();
    pauseAll();
     setFadeOut(true);
    setTimeout(() => {
      console.log("Navigating with difficulty:", selectedDifficulty);
      navigation('/game', {state: {selectedMusic, selectedPlayer, currentUserName, selectedDifficulty, selectedOpponent}});
    }, 1000);

    
  };
  const pauseAll = () => {
  audio8bitRef.current.pause();
  audioChillRef.current.pause();
  audioRockRef.current.pause();
  audioPingRef.current.pause();
};

  const playSound8bit = () => {
    
    setSelectedMusic('8bit');
    pauseAll();
  audio8bitRef.current.currentTime = 0;
  audio8bitRef.current.loop = true;
  audio8bitRef.current.play();
  
};

const playSoundChill = () => {
  
  setSelectedMusic('chill');
  pauseAll();
  audioChillRef.current.currentTime = 0;
  audioChillRef.current.loop = true;
  audioChillRef.current.play();
  
};

const playSoundRock = () => {
  
  setSelectedMusic('rock');
  pauseAll();
  audioRockRef.current.currentTime = 0;
  audioRockRef.current.loop = true;
  audioRockRef.current.play();
  
};
const playSoundPing = () => {
  
  setSelectedMusic('rock');
  pauseAll();
  audioPingRef.current.currentTime = 0;
  audioPingRef.current.loop = true;
  audioPingRef.current.play();
  
};



const playSound = () => {
  pauseAll();
  if (selectedMusic === '8bit') {
    audio8bitRef.current.currentTime = 0;
    audio8bitRef.current.play();
  } else if (selectedMusic === 'chill') {
    audioChillRef.current.currentTime = 0;
    audioChillRef.current.play();
  } else if (selectedMusic === 'rock') {
    audioRockRef.current.currentTime = 0;
    audioRockRef.current.play();
  } 
};
const togglePlayersModal = () => {
  setIsShown(prev => !prev);
};
const closePlayerModal = () => {
  setIsShown(false);
}
const toggleMusicIcons = () => {
  setShowMusicIcons(prev => !prev);
}
const toggleOponentModal = () =>{
  setShownOponent(prev => !prev);
}
const toggleSettings = () =>{
  setSettingsShown(prev => !prev);
}






  return (
    <>
    
    <div className={`welcomeScreen ${fadeOut ? 'fade-out' : ''} ${isShown ? 'blurred' : ''} ${showOponent ? 'blurred' : ''}`} >
      <div className='bluePhotoContainer'>
        <img src={bluePhoto} alt='akanzaBackground'className='bluePhotoImg'></img>
      </div>
      <div className='settings'>
        <Icon path= {mdiCog} size={1} color = "blue"/>
        <button  className ="settingsButton"onClick={(toggleSettings)}>SETTINGS</button>
      </div>
      <div className={`containerForTwo ${isSettingsShown ? 'show' : ''}`}>
            <div className='playerIconContainer'>
              <Icon path= {mdiAccount} color= "white" size = {1.5}/>
              <button className='showPlayersButton' onClick={togglePlayersModal}>
  {selectedPlayer === 'Partyka' ? 'Natalia' : 
   selectedPlayer === 'Grubba' ? 'Andrzej' : 
   selectedPlayer === 'currentUser' ? currentUserName || 'My Player' : 
   'My Player'}
</button>

            </div>
            <div className='showSoundsContainer'>
              <Icon path={mdiMusic} size={1.2} color="white"/>
              <button className='showSoundsButton' onClick={toggleMusicIcons}>
  {musicNames[selectedMusic] || "Music"}
</button>
            </div>
            <div className ='showOponent'>
              <Icon path={mdiTableTennis} size={1.2} color="white"/>
              <button className='showOponentButton' onClick={toggleOponentModal}>
  {difficultyNames[selectedDifficulty] || "Difficulty"}
</button>

            </div>

          </div>
      
      <img src={Logo} alt='Akanza Logo' className='logo' />
      
      
      
      <div className='container'>
        
        <a href="#" className='game' onClick={(e) => { handleGameNavigation(e); }}>
          Enter The Game
        </a>
        
            
        
        
          
          

            <div className={`musicButtons ${showMusicIcons ? 'show' : ''}`}>
                
                  <div className='bitcontainer'>
                    <input  type = "radio" name = 'music' className='8bitButton' onClick={playSound8bit}></input>
                    <Icon path={mdiNintendoGameBoy}  className='biticon'/>
                  </div>  
                  <div className='chillcontainer'>
                    <input type ='radio' name = 'music' className='ChillButton' onClick={playSoundChill}></input>
                    <Icon path={mdiSofaSingle} className='chillicon'/>
                  </div>
                  <div className='rockcontainer'>
                    <input type = 'radio' name = 'music' className='RockButton' onClick={playSoundRock}></input>
                    <Icon path={mdiGuitarElectric} className='rockicon'/>
                  </div>
                  <div className='pingcontainer'>
                    <input type = 'radio' name = 'music' className='PingButton' onClick={() =>{
                      // playSoundPing();
                       setSelectedMusic('ping');
                      pauseAll();
                    }}></input> 
                    <Icon path={mdiTennisBall} className='pingicon'/>
                  </div>
              </div>
        

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Game Rules</h2>
          <p>1. Use the right paddle to control the player.</p>
          <p>2. The left paddle is controlled by AI.</p>
          <p>3. Score 10 points to win the game.</p>
          <p>4. Press 'Start' or Drag the Right paddle to start the game.</p>
          <p>5. Have fun!</p>
        </Modal>
      </div>
      <div className='stopka'>
        <h1>DEVELOPED BY AKANZA</h1>
        <div className='stopkaContainer'>
              <a className='leaderboardButton' onClick={() =>navigation("/leaderboard")}>RANKING</a>
          

        <a
          href="#"
          className='rules'
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
        >
           RULES
        </a>
        </div>
          
      </div>
    </div>
    {isShown && (
  <div className="modalOverlay" onClick={closePlayerModal}>
    <div
      className={`choosePlayer ${isShown ? 'show' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="x" onClick={closePlayerModal}>&times;</span>

      <div className="HeroSelection">
        <div className="partykaContainer">
          <button className="nataliaPartyka" />
          <div className="partykaText">Natalia Partyka</div>
          <button
            className="partykaButton"
            onClick={() => {
              setSelectedPlayer("Partyka");
              togglePlayersModal();
            }}
          >
            SELECT
          </button>
        </div>

        <div className="grubbaContainer">
          <button className="andrzejGrubba" />
          <div className="grubbaText">Andrzej Grubba</div>
          <button
            className="grubbaButton"
            onClick={() => {
              setSelectedPlayer("Grubba");
              togglePlayersModal();
            }}
          >
            SELECT
          </button>
        </div>

        <div className="currentUserContainer">
          <button className="currentUser" />
          <div className="currentUserText">
            <input
              type="text"
              className="currentUserTextInput"
              maxLength={9}
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              placeholder="Your name"
              onChange={(e) => setCurrnetUserName(e.target.value)}
            />
          </div>
          <button
            className="currentUserButton"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              setSelectedPlayer("currentUser");
              togglePlayersModal();
            }}
          >
            SELECT
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      {showOponent && (
  <div className="modalOverlay" onClick={toggleOponentModal}>
    <div
      className={`oponentContainer ${showOponent ? 'show' : ''}`}
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      <div className='HardPlayer'>
        <div className='HardPlayerLeft'>
          <div className="HardPlayerImg">
            <Icon path={mdiTennisBall} size={2} color="white"/>
            <Icon path={mdiTennisBall} size={2} color="white"/>
            <Icon path={mdiTennisBall} size={2} color="white"/>
          </div>
          <button
            className='HardButton'
            onClick={() => {
              setSelectedDifficulty('hard');
              setSelectedOpponent('hard');
              toggleOponentModal();
            }}
          >
            HARD
          </button>
        </div>

        <div className='spacerWelcomeScreen'/>
        
        <div className='NormalPlayerMiddle'>
          <div className="NormalPlayerImg">
            <Icon path={mdiTennisBall} size={2} color="white"/>
            <Icon path={mdiTennisBall} size={2} color="white"/>
          </div>
          <button
            className='NormalButton'
            onClick={() => {
              setSelectedDifficulty('normal');
              setSelectedOpponent('normal');
              toggleOponentModal();
            }}
          >
            NORMAL
          </button>
        </div>

        <div className='spacerWelcomeScreen'/>
        
        <div className='HardPlayerRight'>
          <div className='EasyPlayerImg'>
            <Icon path={mdiTennisBall} size={2} color="white"/>
          </div>
          <button
            className='EasyButton'
            onClick={() => {
              setSelectedDifficulty('easy');
              setSelectedOpponent('easy');
              toggleOponentModal();
            }}
          >
            EASY
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
  
}

export default WelcomeScreen;
