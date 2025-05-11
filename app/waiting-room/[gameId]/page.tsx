"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Copy, UserPlus, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for waiting room
const mockGameData = {
  id: "game-abc123",
  name: "Village Mayhem",
  host: "WolfHunter",
  status: "waiting",
  players: [
    { id: "p1", name: "WolfHunter", avatar: "/placeholder.svg?height=40&width=40", isHost: true, status: "ready" },
    { id: "p2", name: "MoonHowler", avatar: "/placeholder.svg?height=40&width=40", isHost: false, status: "ready" },
    {
      id: "p3",
      name: "VillageElder",
      avatar: "/placeholder.svg?height=40&width=40",
      isHost: false,
      status: "not-ready",
    },
    { id: "p4", name: "NightStalker", avatar: "/placeholder.svg?height=40&width=40", isHost: false, status: "ready" },
  ],
  settings: {
    playerCount: 8,
    roles: ["Villager", "Werewolf", "Seer", "Doctor", "Hunter"],
    isPublic: true,
  },
  recentPlayers: [
    { id: "rp1", name: "ForestWanderer", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "rp2", name: "MidnightHowl", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "rp3", name: "SilentWatcher", avatar: "/placeholder.svg?height=40&width=40" },
  ],
}

export default function WaitingRoomPage({ params }: { params: { gameId: string } }) {
  const router = useRouter()
  const [gameData, setGameData] = useState(mockGameData)
  const [searchTerm, setSearchTerm] = useState("")
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)

  // In a real app, this would fetch the game data from the server
  useEffect(() => {
    // Mock setting the invite link
    setInviteLink(`https://werewolf-online.com/join/${params.gameId}`)
  }, [params.gameId])

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const startGame = () => {
    // In a real app, this would start the game on the server
    console.log("Starting game...")
    router.push(`/game/${params.gameId}`)
  }

  const invitePlayer = (playerId: string) => {
    // In a real app, this would send an invitation to the player
    console.log(`Inviting player ${playerId}...`)
  }

  const canStartGame =
    gameData.players.length >= 4 &&
    gameData.players.filter((p) => p.status === "ready").length === gameData.players.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{gameData.name}</CardTitle>
                  <CardDescription>Waiting for players to join</CardDescription>
                </div>
                <Badge variant="outline" className="uppercase">
                  {gameData.settings.isPublic ? "Public" : "Private"} Game
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Game Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Game Code</h3>
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-800 px-3 py-2 rounded-md font-mono text-lg w-full text-center">
                        {params.gameId}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyInviteLink}
                        className={copied ? "text-green-500" : ""}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {copied ? "Copied to clipboard!" : "Click to copy invite link"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Game Settings</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Players:</span>
                        <span>
                          {gameData.players.length} / {gameData.settings.playerCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Roles:</span>
                        <span>{gameData.settings.roles.length} types</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Roles</h3>
                    <div className="flex flex-wrap gap-1">
                      {gameData.settings.roles.map((role, index) => (
                        <Badge key={index} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Players List */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Players ({gameData.players.length}/{gameData.settings.playerCount})
                  </h3>

                  <div className="space-y-3 mb-6">
                    {gameData.players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                            <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{player.name}</div>
                            {player.isHost && <div className="text-xs text-gray-400">Host</div>}
                          </div>
                        </div>
                        <Badge variant={player.status === "ready" ? "default" : "outline"}>
                          {player.status === "ready" ? "Ready" : "Not Ready"}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Tabs defaultValue="invite">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="invite">Invite Players</TabsTrigger>
                      <TabsTrigger value="recent">Recent Players</TabsTrigger>
                    </TabsList>

                    <TabsContent value="invite" className="mt-4">
                      <div className="space-y-4">
                        <Input
                          placeholder="Search for players..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="text-center text-sm text-gray-500">
                          {searchTerm ? "No results found" : "Type to search for players"}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="recent" className="mt-4">
                      <div className="space-y-3">
                        {gameData.recentPlayers.map((player) => (
                          <div key={player.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                                <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{player.name}</div>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => invitePlayer(player.id)}>
                              <UserPlus className="h-4 w-4 mr-1" />
                              Invite
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/")}>
                Leave Game
              </Button>
              <Button
                onClick={startGame}
                disabled={!canStartGame}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700"
              >
                {canStartGame
                  ? "Start Game"
                  : `Waiting for ${gameData.settings.playerCount - gameData.players.length} more players`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
