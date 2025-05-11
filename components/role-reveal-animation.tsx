"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Skull, Eye, Shield, Moon, Heart, FlaskRoundIcon as Flask, BabyIcon as Child, ArrowUpDown } from "lucide-react"

type PlayerRole = "villager" | "werewolf" | "seer" | "doctor" | "hunter" | "witch" | "little-girl" | "cupid" | "lover"

interface RoleRevealAnimationProps {
  role: PlayerRole
  onComplete: () => void
}

export function RoleRevealAnimation({ role, onComplete }: RoleRevealAnimationProps) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Show role details after card flip animation
    const detailsTimer = setTimeout(() => {
      setShowDetails(true)
    }, 1000)

    // Complete the animation after showing details
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 4000)

    return () => {
      clearTimeout(detailsTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-80 h-96">
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden"
          initial={{ rotateY: 180 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className={`w-full h-full ${getRoleCardBackground(role)} p-6 flex flex-col items-center justify-between`}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mb-4 flex justify-center"
              >
                {getRoleIcon(role)}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="text-3xl font-bold mb-2"
              >
                {getRoleName(role)}
              </motion.h2>
            </div>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="mb-6">{getRoleDescription(role)}</p>
                <div className="text-sm opacity-80">
                  <h3 className="font-semibold mb-1">Special Abilities:</h3>
                  <p>{getRoleAbilities(role)}</p>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 0.5 }}
              className="text-sm opacity-70 mt-4"
            >
              Game starting soon...
            </motion.div>
          </div>
        </motion.div>

        {/* Card back */}
        <motion.div
          className="absolute inset-0 bg-gray-800 rounded-xl flex items-center justify-center"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 180 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-4xl font-bold text-red-500">?</div>
        </motion.div>
      </div>
    </div>
  )
}

function getRoleIcon(role: PlayerRole) {
  const iconSize = "h-16 w-16"

  switch (role) {
    case "werewolf":
      return <Skull className={`${iconSize} text-red-500`} />
    case "seer":
      return <Eye className={`${iconSize} text-purple-500`} />
    case "doctor":
      return <Shield className={`${iconSize} text-green-500`} />
    case "hunter":
      return <Moon className={`${iconSize} text-yellow-500`} />
    case "witch":
      return <Flask className={`${iconSize} text-blue-500`} />
    case "little-girl":
      return <Child className={`${iconSize} text-pink-400`} />
    case "cupid":
      return <Heart className={`${iconSize} text-red-400`} />
    case "lover":
      return <Heart className={`${iconSize} text-pink-500`} />
    default:
      return <ArrowUpDown className={`${iconSize} text-blue-400`} />
  }
}

function getRoleName(role: PlayerRole): string {
  switch (role) {
    case "werewolf":
      return "Werewolf"
    case "seer":
      return "Seer"
    case "doctor":
      return "Doctor"
    case "hunter":
      return "Hunter"
    case "witch":
      return "Witch"
    case "little-girl":
      return "Little Girl"
    case "cupid":
      return "Cupid"
    case "lover":
      return "Lover"
    default:
      return "Villager"
  }
}

function getRoleDescription(role: PlayerRole): string {
  switch (role) {
    case "werewolf":
      return "You are a werewolf hunting in the shadows. Eliminate the villagers without being discovered."
    case "seer":
      return "You have the gift of insight. Each night, you can see the true nature of one player."
    case "doctor":
      return "You are a healer. Each night, you can protect one player from the werewolves."
    case "hunter":
      return "You are a skilled hunter. If you are eliminated, you can take one player with you."
    case "witch":
      return "You possess two powerful potions - one to heal, one to kill. Use them wisely."
    case "little-girl":
      return "You are curious and brave. You can peek during the werewolf phase to gather information."
    case "cupid":
      return "You are the matchmaker. At the start of the game, you will choose two players to be lovers."
    case "lover":
      return "You are in love. If your partner dies, you die of heartbreak. Win together or die together."
    default:
      return "You are a simple villager. Use your wits to identify the werewolves among you."
  }
}

function getRoleAbilities(role: PlayerRole): string {
  switch (role) {
    case "werewolf":
      return "Vote each night to eliminate a villager. Communicate secretly with other werewolves."
    case "seer":
      return "Each night, select one player to learn if they are a werewolf or a villager."
    case "doctor":
      return "Each night, select one player to protect from werewolf attacks."
    case "hunter":
      return "When eliminated, you can immediately choose another player to eliminate."
    case "witch":
      return "You have one healing potion and one poison potion to use during the game."
    case "little-girl":
      return "You can peek during the werewolf phase, but risk being caught and eliminated."
    case "cupid":
      return "At the start of the game, select two players to become lovers who share the same fate."
    case "lover":
      return "You must protect your partner. If they die, you die too. You can win together as a couple."
    default:
      return "Vote during the day to eliminate suspected werewolves."
  }
}

function getRoleCardBackground(role: PlayerRole): string {
  switch (role) {
    case "werewolf":
      return "bg-gradient-to-br from-red-900 to-gray-900 text-white"
    case "seer":
      return "bg-gradient-to-br from-purple-900 to-indigo-900 text-white"
    case "doctor":
      return "bg-gradient-to-br from-green-800 to-emerald-900 text-white"
    case "hunter":
      return "bg-gradient-to-br from-yellow-800 to-amber-900 text-white"
    case "witch":
      return "bg-gradient-to-br from-blue-900 to-indigo-900 text-white"
    case "little-girl":
      return "bg-gradient-to-br from-pink-800 to-purple-900 text-white"
    case "cupid":
      return "bg-gradient-to-br from-red-700 to-pink-900 text-white"
    case "lover":
      return "bg-gradient-to-br from-pink-700 to-red-900 text-white"
    default:
      return "bg-gradient-to-br from-blue-800 to-gray-900 text-white"
  }
}
