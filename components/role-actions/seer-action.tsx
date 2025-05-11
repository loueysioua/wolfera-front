"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, Skull, Check } from "lucide-react"

interface Player {
  id: string
  name: string
  avatar: string
  role: string
}

interface SeerActionProps {
  players: Player[]
  onComplete: (targetId: string) => void
}

export function SeerAction({ players, onComplete }: SeerActionProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const [revealedRole, setRevealedRole] = useState<string | null>(null)
  const [isRevealing, setIsRevealing] = useState(false)

  const handlePlayerSelect = (playerId: string) => {
    if (isRevealing) return
    setSelectedPlayer(playerId)
  }

  const handleReveal = () => {
    if (!selectedPlayer || isRevealing) return

    setIsRevealing(true)

    // Find the selected player's role
    const player = players.find((p) => p.id === selectedPlayer)

    // Simulate revealing after a delay
    setTimeout(() => {
      setRevealedRole(player?.role || null)

      // Complete the action after showing the result
      setTimeout(() => {
        onComplete(selectedPlayer)
      }, 2000)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-40 bg-purple-900/30 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/90 p-6 rounded-xl max-w-md w-full border border-purple-500/50 shadow-lg shadow-purple-500/20"
      >
        <div className="flex items-center justify-center mb-4">
          <Eye className="h-8 w-8 text-purple-400 mr-2" />
          <h2 className="text-2xl font-bold text-purple-300">Seer's Vision</h2>
        </div>

        {!revealedRole ? (
          <>
            <p className="text-center mb-6 text-gray-300">Choose a player to reveal their true nature</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {players
                .filter((p) => p.id !== "your-id")
                .map((player) => (
                  <motion.div
                    key={player.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg cursor-pointer border ${
                      selectedPlayer === player.id
                        ? "border-purple-500 bg-purple-900/30"
                        : "border-gray-700 bg-gray-800/50"
                    }`}
                    onClick={() => handlePlayerSelect(player.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-700 mr-3 overflow-hidden">
                        <img
                          src={player.avatar || "/placeholder.svg"}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-medium">{player.name}</div>
                    </div>
                  </motion.div>
                ))}
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!selectedPlayer || isRevealing}
                className={`px-6 py-2 rounded-lg font-medium flex items-center ${
                  !selectedPlayer || isRevealing
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-purple-700 text-white hover:bg-purple-600"
                }`}
                onClick={handleReveal}
              >
                {isRevealing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Revealing...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Reveal Role
                  </>
                )}
              </motion.button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <p className="text-gray-300 mb-2">
                You have seen that{" "}
                <span className="font-bold text-white">{players.find((p) => p.id === selectedPlayer)?.name}</span> is a:
              </p>

              <div className="flex items-center justify-center mt-4">
                {revealedRole === "werewolf" ? (
                  <motion.div
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="bg-red-900/50 border border-red-500 rounded-full p-4"
                  >
                    <Skull className="h-16 w-16 text-red-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="bg-green-900/50 border border-green-500 rounded-full p-4"
                  >
                    <Check className="h-16 w-16 text-green-500" />
                  </motion.div>
                )}
              </div>

              <h3 className="text-2xl font-bold mt-4">
                {revealedRole === "werewolf" ? (
                  <span className="text-red-500">Werewolf!</span>
                ) : (
                  <span className="text-green-500">Villager</span>
                )}
              </h3>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
