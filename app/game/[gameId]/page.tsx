"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Moon, Sun, MessageCircle, Skull, Shield, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"
import { DayNightTransition } from "@/components/day-night-transition"
import { PlayerCard } from "@/components/player-card"

// Add these imports at the top of the file
import { RoleRevealAnimation } from "@/components/role-reveal-animation"
import { SeerAction } from "@/components/role-actions/seer-action"
import { WitchAction } from "@/components/role-actions/witch-action"
import { CupidAction } from "@/components/role-actions/cupid-action"
import { LittleGirlAction } from "@/components/role-actions/little-girl-action"
import { LoversConnection } from "@/components/lovers-connection"
// Add this import at the top of the file
import { PhaseTimer } from "@/components/phase-timer"

// Game phases
type GamePhase = "role-reveal" | "night" | "day" | "voting" | "results"

// Player roles
type PlayerRole = "villager" | "werewolf" | "seer" | "doctor" | "hunter" | "witch" | "little-girl" | "cupid" | "lover"

// Player status
type PlayerStatus = "alive" | "dead"

// Player interface
interface Player {
  id: string
  name: string
  avatar: string
  role: PlayerRole
  status: PlayerStatus
  isCurrentPlayer?: boolean
}

// Message interface
interface GameMessage {
  id: string
  sender: string | null // null for system messages
  content: string
  timestamp: Date
  isSystem: boolean
  isPrivate: boolean
  isWerewolfChat?: boolean
}

// Mock game data
const mockGameData = {
  id: "game-abc123",
  name: "Village Mayhem",
  phase: "role-reveal" as GamePhase,
  day: 0,
  players: [
    {
      id: "p1",
      name: "WolfHunter",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "werewolf", // Changed to werewolf for testing
      status: "alive",
      isCurrentPlayer: true,
    },
    { id: "p2", name: "MoonHowler", avatar: "/placeholder.svg?height=40&width=40", role: "werewolf", status: "alive" },
    { id: "p3", name: "VillageElder", avatar: "/placeholder.svg?height=40&width=40", role: "seer", status: "alive" },
    { id: "p4", name: "NightStalker", avatar: "/placeholder.svg?height=40&width=40", role: "doctor", status: "alive" },
    {
      id: "p5",
      name: "ForestWanderer",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "villager",
      status: "alive",
    },
    {
      id: "p6",
      name: "MidnightHowl",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "werewolf",
      status: "alive",
    },
    { id: "p7", name: "SilentWatcher", avatar: "/placeholder.svg?height=40&width=40", role: "hunter", status: "alive" },
    { id: "p8", name: "MoonChild", avatar: "/placeholder.svg?height=40&width=40", role: "villager", status: "alive" },
  ],
  messages: [
    {
      id: "m1",
      sender: null,
      content: "Welcome to Werewolf Online! The game is about to begin.",
      timestamp: new Date(),
      isSystem: true,
      isPrivate: false,
    },
    {
      id: "m2",
      sender: null,
      content: "Night falls on the village. Everyone close your eyes.",
      timestamp: new Date(),
      isSystem: true,
      isPrivate: false,
    },
  ],
  werewolfMessages: [
    {
      id: "wm1",
      sender: null,
      content: "Werewolves, open your eyes. You can now communicate with your pack.",
      timestamp: new Date(),
      isSystem: true,
      isPrivate: true,
      isWerewolfChat: true,
    },
  ],
}

// Role icons
const getRoleIcon = (role: PlayerRole) => {
  switch (role) {
    case "werewolf":
      return <Skull className="h-4 w-4 text-red-500" />
    case "seer":
      return <Eye className="h-4 w-4 text-purple-500" />
    case "doctor":
      return <Shield className="h-4 w-4 text-green-500" />
    case "hunter":
      return <Moon className="h-4 w-4 text-yellow-500" />
    default:
      return null
  }
}

export default function GamePage({ params }: { params: { gameId: string } }) {
  const router = useRouter()
  const isMobile = useMobile()
  const [gameData, setGameData] = useState(mockGameData)
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("role-reveal")
  const [day, setDay] = useState(0)
  const [players, setPlayers] = useState<Player[]>(mockGameData.players)
  const [messages, setMessages] = useState<GameMessage[]>(mockGameData.messages)
  const [werewolfMessages, setWerewolfMessages] = useState<GameMessage[]>(mockGameData.werewolfMessages || [])
  const [newMessage, setNewMessage] = useState("")
  const [newWerewolfMessage, setNewWerewolfMessage] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [votes, setVotes] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState<string>("village")
  const [transition, setTransition] = useState<"day-to-night" | "night-to-day" | "elimination" | null>(null)
  const [eliminatedPlayer, setEliminatedPlayer] = useState<{ name: string; role: string } | undefined>(undefined)
  const [playerBeingEliminated, setPlayerBeingEliminated] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const werewolfMessagesEndRef = useRef<HTMLDivElement>(null)

  // Add these state variables inside the GamePage component
  const [showRoleReveal, setShowRoleReveal] = useState(true)
  const [showSeerAction, setShowSeerAction] = useState(false)
  const [showWitchAction, setShowWitchAction] = useState(false)
  const [showCupidAction, setShowCupidAction] = useState(false)
  const [showLittleGirlAction, setShowLittleGirlAction] = useState(false)
  const [lovers, setLovers] = useState<{ player1Id: string; player2Id: string } | null>(null)
  const [showLoversConnection, setShowLoversConnection] = useState(false)
  const [witchPotions, setWitchPotions] = useState({ heal: true, kill: true })
  const [killedPlayer, setKilledPlayer] = useState<Player | null>(null)

  // Inside the GamePage component, add these constants for phase durations
  const PHASE_DURATIONS = {
    "role-reveal": 10, // 10 seconds for role reveal
    night: 60, // 60 seconds for night phase
    day: 120, // 120 seconds for day discussion
    voting: 30, // 30 seconds for voting
  }

  // Add this function inside the GamePage component
  const getPhaseLabel = () => {
    switch (currentPhase) {
      case "role-reveal":
        return "Role Reveal"
      case "night":
        return "Night Phase"
      case "day":
        return `Day ${day} Discussion`
      case "voting":
        return "Voting Phase"
      default:
        return "Game Phase"
    }
  }

  // Add this handler inside the GamePage component
  const handlePhaseTimeUp = () => {
    // Automatically progress to the next phase when time is up
    if (currentPhase === "night") {
      progressToDay()
    } else if (currentPhase === "day") {
      progressToVoting()
    } else if (currentPhase === "voting") {
      // Simulate automatic voting
      const alivePlayers = players.filter((p) => p.status === "alive" && !p.isCurrentPlayer)
      if (alivePlayers.length > 0) {
        const randomPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)]
        handlePlayerSelect(randomPlayer.id)
      }
    }
  }

  // Get current player
  const currentPlayer = players.find((p) => p.isCurrentPlayer)
  const isWerewolf = currentPlayer?.role === "werewolf"

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-scroll to bottom of werewolf messages
  useEffect(() => {
    werewolfMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [werewolfMessages])

  // Determine if player can act based on role and phase
  const canAct = () => {
    if (!currentPlayer || currentPlayer.status === "dead") return false

    if (currentPhase === "night") {
      // Only werewolves, seer, and doctor can act at night
      return ["werewolf", "seer", "doctor"].includes(currentPlayer.role)
    } else if (currentPhase === "voting") {
      // Everyone alive can vote
      return currentPlayer.status === "alive" && !isVoting
    }

    return false
  }

  // Determine if player can chat based on role and phase
  const canChat = () => {
    if (!currentPlayer || currentPlayer.status === "dead") return false

    if (currentPhase === "night") {
      // Only werewolves can chat with each other at night
      return currentPlayer.role === "werewolf"
    } else if (currentPhase === "day") {
      // Everyone alive can chat during the day
      return currentPlayer.status === "alive"
    }

    return false
  }

  // Determine if werewolf chat is available
  const isWerewolfChatAvailable = () => {
    return isWerewolf && currentPhase === "night" && currentPlayer?.status === "alive"
  }

  // Handle transition completion
  const handleTransitionComplete = () => {
    setTransition(null)
    setEliminatedPlayer(undefined)
  }

  // Mock game progression for demo purposes
  useEffect(() => {
    if (currentPhase === "role-reveal") {
      // Add role reveal message
      const roleMessage: GameMessage = {
        id: `m-role-${Date.now()}`,
        sender: null,
        content: `You are a ${currentPlayer?.role}. ${getRoleDescription(currentPlayer?.role as PlayerRole)}`,
        timestamp: new Date(),
        isSystem: true,
        isPrivate: true,
      }
      setMessages((prev) => [...prev, roleMessage])

      // Automatically progress to night phase after 5 seconds
      const timer = setTimeout(() => {
        progressToNight()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [currentPhase])

  // Add this effect to handle role-specific actions during night phase
  useEffect(() => {
    if (currentPhase === "night" && currentPlayer?.status === "alive") {
      // Show role-specific actions based on player's role
      if (currentPlayer.role === "seer") {
        setTimeout(() => setShowSeerAction(true), 1000)
      } else if (currentPlayer.role === "witch") {
        setTimeout(() => setShowWitchAction(true), 1000)
      } else if (currentPlayer.role === "little-girl") {
        setTimeout(() => setShowLittleGirlAction(true), 1000)
      } else if (currentPlayer.role === "cupid" && day === 0) {
        setTimeout(() => setShowCupidAction(true), 1000)
      }
    }
  }, [currentPhase, currentPlayer, day])

  // Add this effect to handle lovers connection
  useEffect(() => {
    if (lovers) {
      const showLoversTimer = setInterval(() => {
        setShowLoversConnection((prev) => !prev)
      }, 30000) // Show lovers connection every 30 seconds

      return () => clearInterval(showLoversTimer)
    }
  }, [lovers])

  // Progress to night phase
  const progressToNight = () => {
    setTransition("day-to-night")

    // Wait for transition to complete before updating game state
    setTimeout(() => {
      setCurrentPhase("night")
      const nightMessage: GameMessage = {
        id: `m-night-${Date.now()}`,
        sender: null,
        content: "Night falls on the village. The werewolves are on the prowl...",
        timestamp: new Date(),
        isSystem: true,
        isPrivate: false,
      }
      setMessages((prev) => [...prev, nightMessage])

      // Add werewolf-specific message if player is a werewolf
      if (isWerewolf) {
        const werewolfMessage: GameMessage = {
          id: `wm-night-${Date.now()}`,
          sender: null,
          content: "Werewolves, choose your victim. Discuss with your pack.",
          timestamp: new Date(),
          isSystem: true,
          isPrivate: true,
          isWerewolfChat: true,
        }
        setWerewolfMessages((prev) => [...prev, werewolfMessage])
        setActiveTab("werewolf")
      }

      // For demo purposes, automatically progress to day after 10 seconds
      setTimeout(() => {
        progressToDay()
      }, 10000)
    }, 500)
  }

  // Progress to day phase
  const progressToDay = () => {
    setTransition("night-to-day")

    // Wait for transition to complete before updating game state
    setTimeout(() => {
      setDay((prev) => prev + 1)
      setCurrentPhase("day")
      setActiveTab("village") // Switch back to village chat during day
      const dayMessage: GameMessage = {
        id: `m-day-${Date.now()}`,
        sender: null,
        content: `Day ${day + 1} begins. The village awakens to discuss the night's events.`,
        timestamp: new Date(),
        isSystem: true,
        isPrivate: false,
      }
      setMessages((prev) => [...prev, dayMessage])

      // For demo purposes, automatically progress to voting after 10 seconds
      setTimeout(() => {
        progressToVoting()
      }, 10000)
    }, 500)
  }

  // Progress to voting phase
  const progressToVoting = () => {
    setCurrentPhase("voting")
    setIsVoting(true)
    const voteMessage: GameMessage = {
      id: `m-vote-${Date.now()}`,
      sender: null,
      content: "It's time to vote. Select a player you suspect is a werewolf.",
      timestamp: new Date(),
      isSystem: true,
      isPrivate: false,
    }
    setMessages((prev) => [...prev, voteMessage])
  }

  // Handle player selection (for actions or voting)
  const handlePlayerSelect = (playerId: string) => {
    if (!canAct()) return

    setSelectedPlayer(playerId)

    if (currentPhase === "voting") {
      // Cast vote
      const targetPlayer = players.find((p) => p.id === playerId)
      if (targetPlayer && targetPlayer.status === "alive") {
        // Update votes
        setVotes((prev) => {
          const newVotes = { ...prev }
          newVotes[playerId] = (newVotes[playerId] || 0) + 1
          return newVotes
        })

        // Add vote message
        const voteMessage: GameMessage = {
          id: `m-vote-${Date.now()}`,
          sender: null,
          content: `${currentPlayer?.name} has voted.`,
          timestamp: new Date(),
          isSystem: true,
          isPrivate: false,
        }
        setMessages((prev) => [...prev, voteMessage])

        // Disable further voting for this player
        setIsVoting(false)

        // For demo purposes, end voting after a short delay
        setTimeout(() => {
          // Find player with most votes
          let maxVotes = 0
          let eliminatedPlayerId = ""

          Object.entries(votes).forEach(([id, voteCount]) => {
            if (voteCount > maxVotes) {
              maxVotes = voteCount
              eliminatedPlayerId = id
            }
          })

          if (eliminatedPlayerId) {
            const eliminatedPlayerData = players.find((p) => p.id === eliminatedPlayerId)

            if (eliminatedPlayerData) {
              // Set the player being eliminated for animation
              setPlayerBeingEliminated(eliminatedPlayerId)

              // Show elimination transition
              setEliminatedPlayer({
                name: eliminatedPlayerData.name,
                role: eliminatedPlayerData.role,
              })
              setTransition("elimination")

              // Wait for transition to complete before updating player status
              setTimeout(() => {
                // Eliminate player
                setPlayers((prev) => prev.map((p) => (p.id === eliminatedPlayerId ? { ...p, status: "dead" } : p)))
                setPlayerBeingEliminated(null)

                // Add elimination message
                const eliminationMessage: GameMessage = {
                  id: `m-elim-${Date.now()}`,
                  sender: null,
                  content: `${eliminatedPlayerData.name} has been eliminated. They were a ${eliminatedPlayerData.role}.`,
                  timestamp: new Date(),
                  isSystem: true,
                  isPrivate: false,
                }
                setMessages((prev) => [...prev, eliminationMessage])

                // Reset votes and progress to night
                setVotes({})
                setTimeout(() => {
                  progressToNight()
                }, 3000)
              }, 3500)
            }
          }
        }, 2000)
      }
    }
  }

  // Send a chat message
  const sendMessage = () => {
    if (!newMessage.trim() || !canChat()) return

    const message: GameMessage = {
      id: `m-chat-${Date.now()}`,
      sender: currentPlayer?.name || "Unknown",
      content: newMessage,
      timestamp: new Date(),
      isSystem: false,
      isPrivate: currentPhase === "night" && currentPlayer?.role === "werewolf",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  // Send a werewolf chat message
  const sendWerewolfMessage = () => {
    if (!newWerewolfMessage.trim() || !isWerewolfChatAvailable()) return

    const message: GameMessage = {
      id: `wm-chat-${Date.now()}`,
      sender: currentPlayer?.name || "Unknown",
      content: newWerewolfMessage,
      timestamp: new Date(),
      isSystem: false,
      isPrivate: true,
      isWerewolfChat: true,
    }

    setWerewolfMessages((prev) => [...prev, message])
    setNewWerewolfMessage("")
  }

  // Get description for player role
  const getRoleDescription = (role: PlayerRole): string => {
    switch (role) {
      case "villager":
        return "Your goal is to identify and eliminate all werewolves through daily voting."
      case "werewolf":
        return "Your goal is to eliminate villagers until werewolves equal or outnumber them."
      case "seer":
        return "Each night, you can check one player to see if they are a werewolf."
      case "doctor":
        return "Each night, you can protect one player from being killed by werewolves."
      case "hunter":
        return "If you are eliminated, you can take one player down with you."
      default:
        return ""
    }
  }

  // Get role badge color
  const getRoleBadgeColor = (role: PlayerRole): string => {
    switch (role) {
      case "werewolf":
        return "bg-red-600"
      case "seer":
        return "bg-purple-600"
      case "doctor":
        return "bg-green-600"
      case "hunter":
        return "bg-yellow-600"
      default:
        return "bg-blue-600"
    }
  }

  // Get background style based on current phase
  const getBackgroundStyle = () => {
    if (currentPhase === "night") {
      return "bg-gradient-to-b from-gray-900/95 to-indigo-950/95"
    } else {
      return "bg-gradient-to-b from-gray-900/95 to-gray-800/95"
    }
  }

  // Add these handler functions for role-specific actions
  const handleSeerActionComplete = (targetId: string) => {
    setShowSeerAction(false)
    // In a real game, this would reveal the player's role to the seer
    const targetPlayer = players.find((p) => p.id === targetId)

    if (targetPlayer) {
      const seerMessage: GameMessage = {
        id: `m-seer-${Date.now()}`,
        sender: null,
        content: `You have seen that ${targetPlayer.name} is a ${targetPlayer.role}.`,
        timestamp: new Date(),
        isSystem: true,
        isPrivate: true,
      }
      setMessages((prev) => [...prev, seerMessage])
    }
  }

  const handleWitchActionComplete = (healId: string | null, killId: string | null) => {
    setShowWitchAction(false)

    // Update witch potions
    if (healId) {
      setWitchPotions((prev) => ({ ...prev, heal: false }))

      // In a real game, this would save the player from being killed
      const healMessage: GameMessage = {
        id: `m-witch-heal-${Date.now()}`,
        sender: null,
        content: `You used your healing potion on ${players.find((p) => p.id === healId)?.name}.`,
        timestamp: new Date(),
        isSystem: true,
        isPrivate: true,
      }
      setMessages((prev) => [...prev, healMessage])
    }

    if (killId) {
      setWitchPotions((prev) => ({ ...prev, kill: false }))

      // In a real game, this would kill the selected player
      const killMessage: GameMessage = {
        id: `m-witch-kill-${Date.now()}`,
        sender: null,
        content: `You used your poison potion on ${players.find((p) => p.id === killId)?.name}.`,
        timestamp: new Date(),
        isSystem: true,
        isPrivate: true,
      }
      setMessages((prev) => [...prev, killMessage])
    }
  }

  const handleCupidActionComplete = (lover1Id: string, lover2Id: string) => {
    setShowCupidAction(false)
    setLovers({ player1Id: lover1Id, player2Id: lover2Id })

    // In a real game, this would set the lovers
    const cupidMessage: GameMessage = {
      id: `m-cupid-${Date.now()}`,
      sender: null,
      content: `You have matched ${players.find((p) => p.id === lover1Id)?.name} and ${players.find((p) => p.id === lover2Id)?.name} as lovers.`,
      timestamp: new Date(),
      isSystem: true,
      isPrivate: true,
    }
    setMessages((prev) => [...prev, cupidMessage])

    // Show lovers connection briefly
    setShowLoversConnection(true)
    setTimeout(() => setShowLoversConnection(false), 5000)
  }

  const handleLittleGirlActionComplete = (didPeek: boolean) => {
    setShowLittleGirlAction(false)

    // In a real game, this would determine if the little girl gets information or gets caught
    const littleGirlMessage: GameMessage = {
      id: `m-little-girl-${Date.now()}`,
      sender: null,
      content: didPeek
        ? "You successfully peeked and saw the werewolves' discussion."
        : "You stayed hidden and remained safe.",
      timestamp: new Date(),
      isSystem: true,
      isPrivate: true,
    }
    setMessages((prev) => [...prev, littleGirlMessage])
  }

  // Add this right before the return statement in the GamePage component
  const getLoversData = () => {
    if (!lovers) return null

    const player1 = players.find((p) => p.id === lovers.player1Id)
    const player2 = players.find((p) => p.id === lovers.player2Id)

    if (!player1 || !player2) return null

    return {
      player1: {
        id: player1.id,
        name: player1.name,
        avatar: player1.avatar,
      },
      player2: {
        id: player2.id,
        name: player2.name,
        avatar: player2.avatar,
      },
    }
  }

  return (
    <>
      <DayNightTransition
        transitionType={transition}
        eliminatedPlayer={eliminatedPlayer}
        onTransitionComplete={handleTransitionComplete}
      />

      <div className="min-h-screen bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-fixed">
        <div className={`min-h-screen ${getBackgroundStyle()} transition-colors duration-1000`}>
          {/* Game Header */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-b border-red-900/50 p-4 sticky top-0 z-10">
            <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-xl font-bold text-red-500">{gameData.name}</h1>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      currentPhase === "night" ? "border-blue-400 text-blue-400" : "border-yellow-400 text-yellow-400"
                    }`}
                  >
                    {currentPhase === "night" ? (
                      <>
                        <Moon className="h-3 w-3 mr-1" /> Night
                      </>
                    ) : (
                      <>
                        <Sun className="h-3 w-3 mr-1" /> Day {day}
                      </>
                    )}
                  </Badge>
                  {currentPlayer && (
                    <Badge className={`text-xs ${getRoleBadgeColor(currentPlayer.role)}`}>
                      {getRoleIcon(currentPlayer.role)}
                      <span className="ml-1">Role: {currentPlayer.role}</span>
                    </Badge>
                  )}
                </div>
              </div>

              {/* Add the phase timer here */}
              <div className="mt-3 md:mt-0 md:mx-4 flex-1 max-w-xs">
                <PhaseTimer
                  duration={PHASE_DURATIONS[currentPhase]}
                  phase={getPhaseLabel()}
                  onTimeUp={handlePhaseTimeUp}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/")}
                className="mt-3 md:mt-0 border-red-500 text-red-500"
              >
                Leave Game
              </Button>
            </div>
          </div>

          {/* Game Content */}
          <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-80px)]">
            {/* Players Grid */}
            <div className="md:col-span-2 bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 overflow-auto border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 text-red-400">Players</h2>
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <AnimatePresence>
                  {players.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      isSelected={selectedPlayer === player.id}
                      isWerewolf={isWerewolf}
                      onClick={() => handlePlayerSelect(player.id)}
                      isBeingEliminated={playerBeingEliminated === player.id}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Game Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 bg-gray-900/90 rounded-lg p-4 border border-gray-700"
              >
                <h3 className="font-semibold mb-2 text-red-400">Game Status</h3>
                <div className="text-sm">
                  {currentPhase === "role-reveal" && <p>The game is starting. You will discover your role shortly.</p>}
                  {currentPhase === "night" && (
                    <p>
                      It's nighttime. Werewolves are choosing their victim, while the Seer and Doctor use their
                      abilities.
                    </p>
                  )}
                  {currentPhase === "day" && (
                    <p>It's daytime. Discuss with other villagers to identify the werewolves.</p>
                  )}
                  {currentPhase === "voting" && (
                    <p>Voting is in progress. Select a player you suspect is a werewolf.</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Chat Panel */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg flex flex-col h-full border border-gray-700">
              {isWerewolf ? (
                <Tabs
                  defaultValue="village"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full h-full flex flex-col"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
                    <TabsTrigger value="village" className="data-[state=active]:bg-gray-800">
                      Village Chat
                    </TabsTrigger>
                    <TabsTrigger
                      value="werewolf"
                      className={`${
                        isWerewolfChatAvailable()
                          ? "data-[state=active]:bg-red-900/50 data-[state=active]:text-white"
                          : "opacity-50"
                      }`}
                      disabled={!isWerewolfChatAvailable()}
                    >
                      Werewolf Pack
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="village" className="flex-grow flex flex-col p-0 m-0">
                    <VillageChatPanel
                      messages={messages}
                      newMessage={newMessage}
                      setNewMessage={setNewMessage}
                      sendMessage={sendMessage}
                      canChat={canChat}
                      currentPhase={currentPhase}
                      currentPlayer={currentPlayer}
                      messagesEndRef={messagesEndRef}
                    />
                  </TabsContent>

                  <TabsContent value="werewolf" className="flex-grow flex flex-col p-0 m-0">
                    <WerewolfChatPanel
                      messages={werewolfMessages}
                      newMessage={newWerewolfMessage}
                      setNewMessage={setNewWerewolfMessage}
                      sendMessage={sendWerewolfMessage}
                      canChat={isWerewolfChatAvailable}
                      messagesEndRef={werewolfMessagesEndRef}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <VillageChatPanel
                  messages={messages}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  sendMessage={sendMessage}
                  canChat={canChat}
                  currentPhase={currentPhase}
                  currentPlayer={currentPlayer}
                  messagesEndRef={messagesEndRef}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showRoleReveal && currentPlayer && (
        <RoleRevealAnimation role={currentPlayer.role} onComplete={() => setShowRoleReveal(false)} />
      )}

      {showSeerAction && (
        <SeerAction
          players={players.filter((p) => p.status === "alive" && !p.isCurrentPlayer)}
          onComplete={handleSeerActionComplete}
        />
      )}

      {showWitchAction && (
        <WitchAction
          players={players.filter((p) => p.status === "alive")}
          killedPlayer={killedPlayer}
          hasHealPotion={witchPotions.heal}
          hasKillPotion={witchPotions.kill}
          onComplete={handleWitchActionComplete}
        />
      )}

      {showCupidAction && (
        <CupidAction
          players={players.filter((p) => p.status === "alive" && !p.isCurrentPlayer)}
          onComplete={handleCupidActionComplete}
        />
      )}

      {showLittleGirlAction && <LittleGirlAction onComplete={handleLittleGirlActionComplete} />}

      {lovers && showLoversConnection && getLoversData() && (
        <LoversConnection
          player1={getLoversData()!.player1}
          player2={getLoversData()!.player2}
          visible={showLoversConnection}
        />
      )}
    </>
  )
}

// Village Chat Panel Component
function VillageChatPanel({
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  canChat,
  currentPhase,
  currentPlayer,
  messagesEndRef,
}: {
  messages: GameMessage[]
  newMessage: string
  setNewMessage: (message: string) => void
  sendMessage: () => void
  canChat: () => boolean
  currentPhase: GamePhase
  currentPlayer: Player | undefined
  messagesEndRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <>
      <div className="p-3 border-b border-gray-700 flex items-center">
        <MessageCircle className="h-5 w-5 mr-2" />
        <h2 className="font-semibold">Village Chat</h2>
      </div>

      <ScrollArea className="flex-grow p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`${
                message.isSystem ? "bg-gray-700/80" : message.isPrivate ? "bg-red-900/30" : "bg-gray-900/80"
              } p-3 rounded-lg border border-gray-700`}
            >
              {message.sender ? (
                <div className="font-semibold text-sm mb-1">{message.sender}</div>
              ) : (
                <div className="text-xs text-gray-400 mb-1">SYSTEM</div>
              )}
              <div className="text-sm">{message.content}</div>
              <div className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
                {message.isPrivate && " • Private"}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-gray-700">
        <div className="flex space-x-2">
          <Input
            placeholder={canChat() ? "Type a message..." : "Chat unavailable"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={!canChat()}
            className="bg-gray-900/50"
          />
          <Button
            onClick={sendMessage}
            disabled={!canChat() || !newMessage.trim()}
            size="sm"
            className="bg-red-600 hover:bg-red-700"
          >
            Send
          </Button>
        </div>
        {!canChat() && currentPhase !== "role-reveal" && (
          <p className="text-xs text-gray-500 mt-1">
            {currentPlayer?.status === "dead"
              ? "You are dead and cannot chat"
              : currentPhase === "night" && currentPlayer?.role !== "werewolf"
                ? "Only werewolves can chat at night"
                : "Chat is currently disabled"}
          </p>
        )}
      </div>
    </>
  )
}

// Werewolf Chat Panel Component
function WerewolfChatPanel({
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  canChat,
  messagesEndRef,
}: {
  messages: GameMessage[]
  newMessage: string
  setNewMessage: (message: string) => void
  sendMessage: () => void
  canChat: () => boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <>
      <div className="p-3 border-b border-red-900/50 flex items-center bg-red-900/30">
        <Skull className="h-5 w-5 mr-2 text-red-400" />
        <h2 className="font-semibold text-red-200">Werewolf Pack</h2>
      </div>

      <ScrollArea className="flex-grow p-3 bg-gray-900/30">
        <div className="space-y-3">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`${
                message.isSystem ? "bg-red-950/50" : "bg-red-900/20"
              } p-3 rounded-lg border border-red-900/30`}
            >
              {message.sender ? (
                <div className="font-semibold text-sm mb-1 text-red-300">{message.sender}</div>
              ) : (
                <div className="text-xs text-red-400 mb-1">PACK LEADER</div>
              )}
              <div className="text-sm text-red-100">{message.content}</div>
              <div className="text-xs text-red-500/70 mt-1">{message.timestamp.toLocaleTimeString()}</div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-red-900/50 bg-red-950/20">
        <div className="flex space-x-2">
          <Input
            placeholder={canChat() ? "Coordinate with your pack..." : "Pack chat unavailable"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={!canChat()}
            className="bg-red-900/20 border-red-900/50 text-red-100 placeholder:text-red-400/70"
          />
          <Button
            onClick={sendMessage}
            disabled={!canChat() || !newMessage.trim()}
            size="sm"
            className="bg-red-700 hover:bg-red-800"
          >
            Howl
          </Button>
        </div>
        {!canChat() && (
          <p className="text-xs text-red-500/70 mt-1">
            Werewolf pack communication is only available during the night phase
          </p>
        )}
      </div>
    </>
  )
}
