import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderBoard.css";
import { BACKEND_BASE_URL } from './apiConfig.js'; 

function LeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState([]); // ✅ Initialize as []
  const [isShown, setIsShown] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/getgamescore`) // ✅ Use HTTP, not HTTPS
      .then((res) => res.json())
      .then((data) => setLeaderboardData(data))
      .catch((err) =>
        console.error("Nie udalo sie zaladowac wynikow ", err)
      );
  }, []);

  function handleClose(){
    setIsShown(false);
  }

  return (
  <div className="leaderBoardContainer">
    <span className="closeButton" onClick={() => navigate('/')}>&times;</span>
    <div className="tablicaWynikowContainer">
      <h1 className="tablicaWynikow">TABLICA WYNIKÓW</h1>
      
    </div>
    <div className="leaderList">
        {leaderboardData.map((entry, index) => (
          <div className="leaderEntry" key={index}>
            <span className="position">{index + 1}.</span>
            <span className="playerNamee">{entry.playerName}</span>
            <span className="score">{entry.score} pts</span>
            <span className="diff">{entry.difficulty}</span>
            <span className="date">{new Date(entry.date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
  </div>
);

}

export default LeaderBoard;
