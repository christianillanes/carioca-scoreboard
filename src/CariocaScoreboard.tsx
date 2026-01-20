import { useState, useEffect } from 'react'
import './CariocaScoreboard.css'

interface Player {
  name: string
  scores: (number | null)[]
  winners: boolean[]
}

const ROUNDS = [
  '2 Trios',
  '1 Trio + 1 Escala',
  '2 Escalas',
  '3 Trios',
  '2 Trios + 1 Escala',
  '1 Trio + 2 Escalas',
  '4 Trios',
  '3 Escalas'
]

function CariocaScoreboard() {
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('carioca-players')
    if (saved) {
      const parsed = JSON.parse(saved) as Player[]
      // Migrate old data to include winners field
      return parsed.map((p) => ({
        ...p,
        winners: p.winners || Array(8).fill(false)
      }))
    }
    return []
  })
  const [newPlayerName, setNewPlayerName] = useState('')
  const [currentRound, setCurrentRound] = useState(() => {
    const saved = localStorage.getItem('carioca-round')
    return saved ? parseInt(saved) : 0
  })

  useEffect(() => {
    localStorage.setItem('carioca-players', JSON.stringify(players))
  }, [players])

  useEffect(() => {
    localStorage.setItem('carioca-round', currentRound.toString())
  }, [currentRound])

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 6) {
      const newScores = Array(8).fill(null)
      const newWinners = Array(8).fill(false)
      
      // For each round, assign the highest score from existing players
      if (players.length > 0) {
        for (let round = 0; round < 8; round++) {
          const maxScore = Math.max(...players.map(p => p.scores[round] ?? 0))
          newScores[round] = maxScore
        }
      }
      
      setPlayers([...players, { name: newPlayerName.trim(), scores: newScores, winners: newWinners }])
      setNewPlayerName('')
    }
  }

  const toggleWinner = (playerIndex: number, round: number) => {
    const newPlayers = [...players]
    // Unset all winners for this round
    newPlayers.forEach(p => p.winners[round] = false)
    // Set this player as winner and score to 0
    newPlayers[playerIndex].winners[round] = true
    newPlayers[playerIndex].scores[round] = 0
    setPlayers(newPlayers)
  }

  const updateScore = (playerIndex: number, round: number, score: string) => {
    if (score === '') {
      const newPlayers = [...players]
      newPlayers[playerIndex].scores[round] = null
      setPlayers(newPlayers)
      return
    }
    
    const newScore = parseInt(score)
    
    // Check if score is a multiple of 5
    if (newScore % 5 !== 0) {
      alert('Los puntos deben ser múltiplos de 5')
      return
    }
    
    // Check if trying to set 0 and another player already has 0 in this round
    if (newScore === 0) {
      const hasWinner = players.some((p, i) => i !== playerIndex && p.scores[round] === 0)
      if (hasWinner) {
        alert('Solo un jugador puede tener 0 puntos por ronda (el ganador)')
        return
      }
    }
    
    const newPlayers = [...players]
    newPlayers[playerIndex].scores[round] = newScore
    setPlayers(newPlayers)
  }

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index))
  }

  const getTotalScore = (player: Player) => {
    return player.scores.reduce((sum, score) => (sum ?? 0) + (score ?? 0), 0)
  }

  const getRank = (playerIndex: number) => {
    const playerTotal = getTotalScore(players[playerIndex])
    const uniqueScores = [...new Set(players.map(p => getTotalScore(p)))].sort((a, b) => (a ?? 0) - (b ?? 0))
    return uniqueScores.indexOf(playerTotal) + 1
  }

  const resetGame = () => {
    if (confirm('¿Reiniciar el juego?')) {
      setPlayers([])
      setCurrentRound(0)
    }
  }

  const nextRound = () => {
    if (currentRound < 7) {
      // Check if there's a winner
      const hasWinner = players.some(p => p.winners[currentRound])
      if (!hasWinner) {
        alert('Debe seleccionar un ganador antes de avanzar')
        return
      }
      
      // Check if all non-winners have valid scores (not null/empty and not 0)
      const allScoresValid = players.every(p => {
        if (p.winners[currentRound]) return true // Winner is valid
        const score = p.scores[currentRound]
        return score !== null && score > 0
      })
      
      if (!allScoresValid) {
        alert('Todos los jugadores deben tener puntos asignados (mayores a 0)')
        return
      }
      
      setCurrentRound(currentRound + 1)
    }
  }

  const prevRound = () => {
    if (currentRound > 0) setCurrentRound(currentRound - 1)
  }

  return (
    <div className="scoreboard">
      <h1>Carioca Scoreboard</h1>
      
      {players.length === 0 ? (
        <div className="setup">
          <h2>Agregar Jugadores</h2>
          <div className="add-player">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Nombre del jugador"
              maxLength={15}
            />
            <button onClick={addPlayer}>Agregar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="round-nav">
            <button onClick={prevRound} disabled={currentRound === 0}>←</button>
            <div className="round-info">
              <h2>Ronda {currentRound + 1}</h2>
              <p>{ROUNDS[currentRound]}</p>
            </div>
            <button onClick={nextRound} disabled={currentRound === 7}>→</button>
          </div>

          <div className="scores-table">
            <table>
              <thead>
                <tr>
                  <th>Jugador</th>
                  {ROUNDS.map((_, i) => (
                    <th key={i} className={i === currentRound ? 'current' : ''}>R{i + 1}</th>
                  ))}
                  <th>Total</th>
                  <th>Rank</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, pIndex) => (
                  <tr key={pIndex}>
                    <td className="player-name">{player.name}</td>
                    {player.scores.map((score, rIndex) => (
                      <td key={rIndex} className={rIndex === currentRound ? 'current' : ''}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                          <button
                            onClick={() => toggleWinner(pIndex, rIndex)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              padding: '0',
                              opacity: player.winners[rIndex] ? 1 : 0.3
                            }}
                            title="Ganador"
                            disabled={rIndex !== currentRound}
                          >
                            ⭐
                          </button>
                          <input
                            type="number"
                            value={score ?? ''}
                            onChange={(e) => updateScore(pIndex, rIndex, e.target.value)}
                            min="0"
                            step="5"
                            disabled={player.winners[rIndex] || rIndex !== currentRound}
                          />
                        </div>
                      </td>
                    ))}
                    <td className="total">{getTotalScore(player)}</td>
                    <td className="total">{getRank(pIndex)}</td>
                    <td>
                      <button onClick={() => removePlayer(pIndex)} className="remove">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {players.length < 6 && (
            <div className="add-player">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                placeholder="Agregar jugador"
                maxLength={15}
              />
              <button onClick={addPlayer}>+</button>
            </div>
          )}

          <div className="actions">
            <button onClick={resetGame} className="reset">Reiniciar Juego</button>
          </div>

          <div className="scoring-guide">
            <h3>Puntuación</h3>
            <p>Jokers: 30 | Ases: 15 | 8-K: 10 | 2-7: 5</p>
          </div>
        </>
      )}
    </div>
  )
}

export default CariocaScoreboard
