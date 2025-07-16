import React, { useState } from 'react';
import mypongGif from './assets/mypongWelcome.gif';
import WelcomeScreenBackground from './assets/WelcomeScreenBackground.png';
import './WelcomeScreen.css';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal.jsx';
import Song from './assets/gameSong.mp3';
import Logo from './assets/akanzaLogo.png';

function WelcomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigation = useNavigate();

  const handleGameNavigation = (e) => {
    e.preventDefault();
     setFadeOut(true);
    setTimeout(() => {
      navigation('/game');
    }, 1000);

    
  };
  const playSound = () => {
    const audio = new Audio(Song);
    audio.play();
  }

  return (
    <div className={`welcomeScreen ${fadeOut ? 'fade-out' : ''}`}>
      <img src={Logo} alt='Akanza Logo' className='logo' />
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
