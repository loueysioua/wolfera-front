"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trophy, Users, Camera } from "lucide-react"
import { AvatarBuilderModal } from "@/components/avatar-builder/avatar-builder-modal"

// Mock user data
const userData = {
  username: "WolfHunter",
  email: "wolf.hunter@example.com",
  bio: "I love playing as the Seer and uncovering the truth!",
  joinDate: "January 2023",
  avatar: "/placeholder.svg?height=128&width=128",
  avatarData: {}, // This would store the avatar builder data
  stats: {
    gamesPlayed: 87,
    wins: 52,
    winRate: "59.8%",
    favoriteRole: "Seer",
  },
  achievements: [
    { id: 1, name: "First Blood", description: "Win your first game", unlocked: true },
    { id: 2, name: "Pack Leader", description: "Win 5 games as a Werewolf", unlocked: true },
    { id: 3, name: "Village Elder", description: "Win 10 games as a Villager", unlocked: true },
    {
      id: 4,
      name: "Psychic",
      description: "Correctly identify 3 Werewolves in a single game as Seer",
      unlocked: false,
    },
    { id: 5, name: "Survivor", description: "Win 20 games in a row", unlocked: false },
  ],
  recentGames: [
    { id: "g1", date: "2 hours ago", result: "Win", role: "Villager" },
    { id: "g2", date: "Yesterday", result: "Loss", role: "Werewolf" },
    { id: "g3", date: "3 days ago", result: "Win", role: "Seer" },
  ],
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    username: userData.username,
    bio: userData.bio,
    email: userData.email,
  })
  const [avatarBuilderOpen, setAvatarBuilderOpen] = useState(false)
  const [avatarData, setAvatarData] = useState(userData.avatarData)
  const [avatarUrl, setAvatarUrl] = useState(userData.avatar)

  const handleSaveProfile = () => {
    // In a real app, this would save the profile to the server
    console.log("Saving profile:", profile)
    setIsEditing(false)
  }

  const handleSaveAvatar = (newAvatarData: any) => {
    // In a real app, this would save the avatar data to the server
    console.log("Saving avatar:", newAvatarData)
    setAvatarData(newAvatarData)

    // In a real implementation, the server would generate an avatar image
    // For now, we'll just keep using the placeholder
    setAvatarUrl(`/placeholder.svg?height=128&width=128&text=Custom`)
  }

  return (
    <div className="min-h-screen bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-gradient-to-b from-gray-900/95 to-gray-800/95 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Summary */}
            <Card className="md:col-span-1 border-gray-700 bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 relative group">
                  <img
                    src={avatarUrl || "/placeholder.svg"}
                    alt={userData.username}
                    className="rounded-full w-32 h-32 border-4 border-red-500 shadow-lg shadow-red-500/20"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-gray-800 border-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setAvatarBuilderOpen(true)}
                  >
                    <Camera className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <CardTitle className="text-2xl text-red-400">{userData.username}</CardTitle>
                <CardDescription>Member since {userData.joinDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-yellow-400">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      <div>Games Played:</div>
                      <div className="text-right font-medium">{userData.stats.gamesPlayed}</div>
                      <div>Wins:</div>
                      <div className="text-right font-medium">{userData.stats.wins}</div>
                      <div>Win Rate:</div>
                      <div className="text-right font-medium text-green-400">{userData.stats.winRate}</div>
                      <div>Favorite Role:</div>
                      <div className="text-right font-medium text-purple-400">{userData.stats.favoriteRole}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-400">
                      <Users className="w-5 h-5 mr-2 text-blue-500" />
                      Recent Games
                    </h3>
                    <div className="space-y-2">
                      {userData.recentGames.map((game) => (
                        <div
                          key={game.id}
                          className="flex justify-between text-sm bg-gray-800/50 p-3 rounded-lg border border-gray-700"
                        >
                          <div>
                            <span className="font-medium">{game.role}</span> • {game.date}
                          </div>
                          <Badge
                            variant={game.result === "Win" ? "default" : "outline"}
                            className={game.result === "Win" ? "bg-green-600" : "text-red-400 border-red-400"}
                          >
                            {game.result}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="md:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="grid grid-cols-2 bg-gray-800/50 border border-gray-700">
                  <TabsTrigger value="about" className="data-[state=active]:bg-gray-700">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="data-[state=active]:bg-gray-700">
                    Achievements
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-red-400">About Me</CardTitle>
                        <CardDescription>Your profile information</CardDescription>
                      </div>
                      {!isEditing && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-red-400">Edit Profile</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label htmlFor="username">Username</label>
                                <Input
                                  id="username"
                                  value={profile.username}
                                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="email">Email</label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={profile.email}
                                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="bio">Bio</label>
                                <Textarea
                                  id="bio"
                                  rows={4}
                                  value={profile.bio}
                                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleSaveProfile} className="bg-red-600 hover:bg-red-700">
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <h3 className="font-medium text-sm text-gray-500 mb-1">Username</h3>
                          <p>{userData.username}</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <h3 className="font-medium text-sm text-gray-500 mb-1">Email</h3>
                          <p>{userData.email}</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <h3 className="font-medium text-sm text-gray-500 mb-1">Bio</h3>
                          <p>{userData.bio}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements" className="mt-6">
                  <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-yellow-400">Achievements</CardTitle>
                      <CardDescription>
                        You've unlocked {userData.achievements.filter((a) => a.unlocked).length} out of{" "}
                        {userData.achievements.length} achievements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userData.achievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className={`p-4 border rounded-lg flex items-start ${
                              achievement.unlocked
                                ? "border-yellow-500/50 bg-yellow-500/10"
                                : "border-gray-700 opacity-60"
                            }`}
                          >
                            <div className="mr-4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  achievement.unlocked ? "bg-yellow-500 text-black" : "bg-gray-700"
                                } shadow-lg ${achievement.unlocked ? "shadow-yellow-500/20" : ""}`}
                              >
                                <Trophy className="h-5 w-5" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold">{achievement.name}</h3>
                              <p className="text-sm text-gray-400">{achievement.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Builder Modal */}
      <AvatarBuilderModal
        open={avatarBuilderOpen}
        onOpenChange={setAvatarBuilderOpen}
        onSave={handleSaveAvatar}
        initialAvatar={avatarData}
      />
    </div>
  )
}
