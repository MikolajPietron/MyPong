import React, { useState, useRef } from 'react';
import mypongGif from './assets/mypongWelcome.gif';
import WelcomeScreenBackground from './assets/WelcomeScreenBackground.png';
import './WelcomeScreen.css';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal.jsx';
import BitSong from './assets/gameSong.mp3';
import ChillSong from './assets/ChillLofiSong.mp3';
import RockSong from './assets/RockSong.mp3';
import PingPong from './assets/pingPongSound.mp3';

import Logo from './assets/akanzaLogo.png';
import Icon from "@mdi/react";
import { mdiGuitarElectric, mdiHome, mdiNintendoGameBoy, mdiSofaSingle, mdiTennisBall } from "@mdi/js";
import { pass } from 'three/tsl';

function WelcomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigation = useNavigate();
  const audio8bitRef = useRef(new Audio(BitSong));
  const audioChillRef = useRef(new Audio(ChillSong));
  const audioRockRef = useRef(new Audio(RockSong));
  const audioPingRef = useRef(new Audio(PingPong)); 
  const [selectedMusic, setSelectedMusic] = useState(null);

  const handleGameNavigation = (e) => {
    e.preventDefault();
    pauseAll();
     setFadeOut(true);
    setTimeout(() => {
      navigation('/game', {state: {selectedMusic}});
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




  return (
    <div className={`welcomeScreen ${fadeOut ? 'fade-out' : ''}`}>
      <img src={Logo} alt='Akanza Logo' className='logo' />
        <div className='musicButtons'>

          <h1>Wybierz<br />muzyke</h1>

          
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
              setSelectedMusic('ping');
              pauseAll();

            }}></input>
            <Icon path={mdiTennisBall} className='pingicon'/>
          </div>
          

        </div>
      <div className='container'>
        <a href="#" className='game' onClick={(e) => { handleGameNavigation(e); }}>
          Enter The Game
        </a>

        <a
          href="#"
          className='rules'
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
        >
          Read The Rules
        </a>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Game Rules</h2>
          <p>1. Use the right paddle to control the player.</p>
          <p>2. The left paddle is controlled by AI.</p>
          <p>3. Score 10 points to win the game.</p>
          <p>4. Press 'Enter' to start the game.</p>
          <p>5. Have fun!</p>
        </Modal>
      </div>
    </div>
  );
}

export default WelcomeScreen;
