import { useState, useEffect } from 'react'
import './CariocaScoreboard.css'
import { translations } from './translations'
import type { Language } from './translations'

interface Player {
  name: string
  scores: (number | null)[]
  winners: boolean[]
}

function CariocaScoreboard() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('carioca-language')
    return (saved as Language) || 'es'
  })
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('carioca-players')
    if (saved) {
      const parsed = JSON.parse(saved) as Player[]
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

  const t = translations[language]
  const ROUNDS = t.rounds

  useEffect(() => {
    localStorage.setItem('carioca-language', language)
  }, [language])

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
    newPlayers.forEach(p => p.winners[round] = false)
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
    
    if (newScore % 5 !== 0) {
      alert(t.errorMultiple5)
      return
    }
    
    if (newScore === 0) {
      const hasWinner = players.some((p, i) => i !== playerIndex && p.scores[round] === 0)
      if (hasWinner) {
        alert(t.errorOneWinner)
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
    if (confirm(t.resetConfirm)) {
      setPlayers([])
      setCurrentRound(0)
    }
  }

  const nextRound = () => {
    if (currentRound < 7) {
      const hasWinner = players.some(p => p.winners[currentRound])
      if (!hasWinner) {
        alert(t.errorSelectWinner)
        return
      }
      
      const allScoresValid = players.every(p => {
        if (p.winners[currentRound]) return true
        const score = p.scores[currentRound]
        return score !== null && score > 0
      })
      
      if (!allScoresValid) {
        alert(t.errorAllScores)
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
      <h1>{t.title}</h1>
      
      {players.length === 0 ? (
        <div className="setup">
          <h2>{t.addPlayers}</h2>
          <div className="add-player">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              placeholder={t.playerName}
              maxLength={15}
            />
            <button onClick={addPlayer}>{t.addPlayer}</button>
          </div>
        </div>
      ) : (
        <>
          <div className="round-nav">
            <button onClick={prevRound} disabled={currentRound === 0}>←</button>
            <div className="round-info">
              <h2>{t.round} {currentRound + 1}</h2>
              <p>{ROUNDS[currentRound]}</p>
            </div>
            <button onClick={nextRound} disabled={currentRound === 7}>→</button>
          </div>

          <div className="scores-table">
            <table>
              <thead>
                <tr>
                  <th>{t.player}</th>
                  {ROUNDS.map((_, i) => (
                    <th key={i} className={i === currentRound ? 'current' : ''}>{t.roundPrefix}{i + 1}</th>
                  ))}
                  <th>{t.total}</th>
                  <th>{t.rank}</th>
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
                            title={t.winner}
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
                placeholder={t.addPlayer}
                maxLength={15}
              />
              <button onClick={addPlayer}>{t.add}</button>
            </div>
          )}

          <div className="actions">
            <button onClick={resetGame} className="reset">{t.resetGame}</button>
          </div>

          <div className="scoring-guide">
            <h3>{t.scoring}</h3>
            <p>{t.scoringGuide}</p>
          </div>

          <div className="language-selector">
            <button 
              onClick={() => setLanguage('es')} 
              className={language === 'es' ? 'active' : ''}
              title="Español"
            >
              🇪🇸
            </button>
            <button 
              onClick={() => setLanguage('en')} 
              className={language === 'en' ? 'active' : ''}
              title="English"
            >
              🇬🇧
            </button>
            <button 
              onClick={() => setLanguage('sv')} 
              className={language === 'sv' ? 'active' : ''}
              title="Svenska"
            >
              🇸🇪
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default CariocaScoreboard
