import { useEffect, useState } from "react";
import "./LeaderBoard.css";

function LeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState([]); // ✅ Initialize as []

  useEffect(() => {
    fetch("http://localhost:5000/api/getgamescore") // ✅ Use HTTP, not HTTPS
      .then((res) => res.json())
      .then((data) => setLeaderboardData(data))
      .catch((err) =>
        console.error("Nie udalo sie zaladowac wynikow ", err)
      );
  }, []);

  return (
  <div className="leaderBoardContainer">
    <div className="tablicaWynikowContainer">
      <h1 className="tablicaWynikow">TABLICA WYNIKÓW</h1>
      
    </div>
    <div className="leaderList">
        {leaderboardData.map((entry, index) => (
          <div className="leaderEntry" key={index}>
            <span className="position">{index + 1}.</span>
            <span className="playerName">{entry.playerName}</span>
            <span className="score">{entry.score} pts</span>
            <span className="date">{new Date(entry.date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
  </div>
);

}

export default LeaderBoard;
