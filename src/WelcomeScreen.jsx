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

function WelcomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigation = useNavigate();
  const audio8bitRef = useRef(new Audio(BitSong));
  const audioChillRef = useRef(new Audio(ChillSong));
  const audioRockRef = useRef(new Audio(RockSong));
  const audioPingRef = useRef(new Audio(PingPong)); // Assuming you have a ping sound
  const [selectedMusic, setSelectedMusic] = useState(null);

  const handleGameNavigation = (e) => {
    e.preventDefault();
     setFadeOut(true);
    setTimeout(() => {
      navigation('/game', {state: {selectedMusic}});
    }, 1000);

    
  };
  const pauseAll = () => {
  audio8bitRef.current.pause();
  audioChillRef.current.pause();
  audioRockRef.current.pause();
};

  const playSound8bit = () => {
    
    setSelectedMusic('8bit');
  
};

const playSoundChill = () => {
  
  setSelectedMusic('chill');
  
};

const playSoundRock = () => {
  
  setSelectedMusic('rock');
  
};
const playSoundPing = () => {
  setSelectedMusic('ping');
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
  } else if (selectedMusic === 'ping') {
    audioPingRef.current.currentTime = 0;
    audioPingRef.current.play();
  }
};




  return (
    <div className={`welcomeScreen ${fadeOut ? 'fade-out' : ''}`}>
      <img src={Logo} alt='Akanza Logo' className='logo' />
        <div className='musicButtons'>
          <div className='bitcontainer'>
            <input  type = "radio" name = 'music' className='8bitButton' onClick={playSound8bit}></input>
            <Icon path={mdiNintendoGameBoy} size={2} className='biticon'/>
          </div>
          <div className='chillcontainer'>
            <input type ='radio' name = 'music' className='ChillButton' onClick={playSoundChill}></input>
            <Icon path={mdiSofaSingle} size={2} className='chillicon'/>
          </div>
          <div className='rockcontainer'>
            <input type = 'radio' name = 'music' className='RockButton' onClick={playSoundRock}></input>
            <Icon path={mdiGuitarElectric} size={2} className='rockicon'/>
          </div>
          <div className='pingcontainer'>
            <input type = 'radio' name = 'music' className='PingButton' onClick={playSoundPing}></input>
            <Icon path={mdiTennisBall} size={2} className='pingicon'/>
          </div>
          

        </div>
      <div className='container'>
        <a href="#" className='game' onClick={(e) => { handleGameNavigation(e); playSound(); }}>
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
