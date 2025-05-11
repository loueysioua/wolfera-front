"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FlaskRoundIcon as Flask, Heart } from "lucide-react"

interface Player {
  id: string
  name: string
  avatar: string
}

interface WitchActionProps {
  players: Player[]
  killedPlayer: Player | null
  hasHealPotion: boolean
  hasKillPotion: boolean
  onComplete: (healId: string | null, killId: string | null) => void
}

export function WitchAction({ players, killedPlayer, hasHealPotion, hasKillPotion, onComplete }: WitchActionProps) {
  const [step, setStep] = useState<"heal" | "kill" | "complete">("heal")
  const [healTarget, setHealTarget] = useState<string | null>(null)
  const [killTarget, setKillTarget] = useState<string | null>(null)

  const handleHeal = (playerId: string | null) => {
    setHealTarget(playerId)
    if (hasKillPotion) {
      setStep("kill")
    } else {
      setStep("complete")
      setTimeout(() => onComplete(playerId, null), 1500)
    }
  }

  const handleKill = (playerId: string | null) => {
    setKillTarget(playerId)
    setStep("complete")
    setTimeout(() => onComplete(healTarget, playerId), 1500)
  }

  const skipHeal = () => {
    if (hasKillPotion) {
      setStep("kill")
    } else {
      setStep("complete")
      setTimeout(() => onComplete(null, null), 1000)
    }
  }

  const skipKill = () => {
    setStep("complete")
    setTimeout(() => onComplete(healTarget, null), 1000)
  }

  return (
    <div className="fixed inset-0 z-40 bg-blue-900/30 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/90 p-6 rounded-xl max-w-md w-full border border-blue-500/50 shadow-lg shadow-blue-500/20"
      >
        <div className="flex items-center justify-center mb-4">
          <Flask className="h-8 w-8 text-blue-400 mr-2" />
          <h2 className="text-2xl font-bold text-blue-300">Witch's Potions</h2>
        </div>

        {step === "heal" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center mb-6">
              {hasHealPotion ? (
                <>
                  <p className="text-gray-300 mb-2">
                    {killedPlayer ? (
                      <>
                        <span className="font-bold text-white">{killedPlayer.name}</span> was killed tonight.
                      </>
                    ) : (
                      <>No one was killed tonight.</>
                    )}
                  </p>
                  <p className="text-gray-300">Do you want to use your healing potion?</p>
                </>
              ) : (
                <p className="text-gray-300">You have already used your healing potion.</p>
              )}
            </div>

            {hasHealPotion && killedPlayer && (
              <div className="flex justify-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-lg border border-green-500 bg-green-900/30 flex flex-col items-center cursor-pointer"
                  onClick={() => handleHeal(killedPlayer.id)}
                >
                  <div className="w-16 h-16 rounded-full bg-gray-700 mb-2 overflow-hidden">
                    <img
                      src={killedPlayer.avatar || "/placeholder.svg"}
                      alt={killedPlayer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-medium">{killedPlayer.name}</div>
                  <div className="mt-2 flex items-center text-green-400">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>Heal</span>
                  </div>
                </motion.div>
              </div>
            )}

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600"
                onClick={skipHeal}
              >
                {hasKillPotion ? "Skip Healing" : "Continue"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "kill" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center mb-6">
              {hasKillPotion ? (
                <p className="text-gray-300">Do you want to use your poison potion to kill someone?</p>
              ) : (
                <p className="text-gray-300">You have already used your poison potion.</p>
              )}
            </div>

            {hasKillPotion && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-6 max-h-60 overflow-y-auto">
                  {players
                    .filter((p) => p.id !== "your-id")
                    .map((player) => (
                      <motion.div
                        key={player.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-lg cursor-pointer border border-gray-700 bg-gray-800/50 hover:border-red-500 hover:bg-red-900/20"
                        onClick={() => handleKill(player.id)}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-gray-700 mb-2 overflow-hidden">
                            <img
                              src={player.avatar || "/placeholder.svg"}
                              alt={player.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="font-medium text-sm text-center">{player.name}</div>
                        </div>
                      </motion.div>
                    ))}
                </div>

                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600"
                    onClick={skipKill}
                  >
                    Skip Poisoning
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {step === "complete" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <p className="text-gray-300 mb-4">Your witchcraft is complete for tonight.</p>
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
