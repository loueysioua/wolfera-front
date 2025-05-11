"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface Player {
  id: string
  name: string
  avatar: string
}

interface CupidActionProps {
  players: Player[]
  onComplete: (lover1Id: string, lover2Id: string) => void
}

export function CupidAction({ players, onComplete }: CupidActionProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  const handlePlayerSelect = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId))
    } else if (selectedPlayers.length < 2) {
      setSelectedPlayers([...selectedPlayers, playerId])
    }
  }

  const handleConfirm = () => {
    if (selectedPlayers.length !== 2) return

    setShowConfirmation(false)
    setShowAnimation(true)

    setTimeout(() => {
      onComplete(selectedPlayers[0], selectedPlayers[1])
    }, 3000)
  }

  useEffect(() => {
    setShowConfirmation(selectedPlayers.length === 2)
  }, [selectedPlayers])

  return (
    <div className="fixed inset-0 z-40 bg-pink-900/30 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/90 p-6 rounded-xl max-w-md w-full border border-pink-500/50 shadow-lg shadow-pink-500/20"
      >
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 text-pink-400 mr-2" />
          <h2 className="text-2xl font-bold text-pink-300">Cupid's Arrow</h2>
        </div>

        {!showAnimation ? (
          <>
            <p className="text-center mb-6 text-gray-300">
              Select two players to become lovers. They will share the same fate.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 max-h-60 overflow-y-auto">
              {players
                .filter((p) => p.id !== "your-id")
                .map((player) => (
                  <motion.div
                    key={player.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg cursor-pointer border ${
                      selectedPlayers.includes(player.id)
                        ? "border-pink-500 bg-pink-900/30"
                        : "border-gray-700 bg-gray-800/50"
                    }`}
                    onClick={() => handlePlayerSelect(player.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-700 mb-2 overflow-hidden relative">
                        <img
                          src={player.avatar || "/placeholder.svg"}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedPlayers.includes(player.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1"
                          >
                            <Heart className="h-3 w-3 text-white" fill="white" />
                          </motion.div>
                        )}
                      </div>
                      <div className="font-medium text-sm text-center">{player.name}</div>
                    </div>
                  </motion.div>
                ))}
            </div>

            {showConfirmation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <p className="mb-4 text-pink-300">
                  Are you sure you want to match{" "}
                  <span className="font-bold text-white">{players.find((p) => p.id === selectedPlayers[0])?.name}</span>{" "}
                  and{" "}
                  <span className="font-bold text-white">{players.find((p) => p.id === selectedPlayers[1])?.name}</span>
                  ?
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg font-medium bg-pink-700 text-white hover:bg-pink-600"
                  onClick={handleConfirm}
                >
                  <Heart className="w-5 h-5 mr-2 inline-block" />
                  Confirm Match
                </motion.button>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
              <p className="text-gray-300 mb-4">
                <span className="font-bold text-white">{players.find((p) => p.id === selectedPlayers[0])?.name}</span>{" "}
                and{" "}
                <span className="font-bold text-white">{players.find((p) => p.id === selectedPlayers[1])?.name}</span>{" "}
                are now in love!
              </p>

              <div className="relative h-40 flex items-center justify-center">
                <div className="absolute left-1/4 transform -translate-x-1/2">
                  <motion.div initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 2, ease: "easeInOut" }}>
                    <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden border-2 border-pink-500">
                      <img
                        src={players.find((p) => p.id === selectedPlayers[0])?.avatar || "/placeholder.svg"}
                        alt={players.find((p) => p.id === selectedPlayers[0])?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="z-10"
                >
                  <Heart className="h-12 w-12 text-pink-500" fill="#ec4899" />
                </motion.div>

                <div className="absolute right-1/4 transform translate-x-1/2">
                  <motion.div initial={{ x: -50 }} animate={{ x: 0 }} transition={{ duration: 2, ease: "easeInOut" }}>
                    <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden border-2 border-pink-500">
                      <img
                        src={players.find((p) => p.id === selectedPlayers[1])?.avatar || "/placeholder.svg"}
                        alt={players.find((p) => p.id === selectedPlayers[1])?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                <p className="text-pink-300 italic">"What Cupid has joined together, let no one separate."</p>
              </motion.div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
