"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Shuffle, User, Check } from "lucide-react"
import { useTranslation } from "react-i18next"

// Avatar feature types
type AvatarFeature = "face" | "eyes" | "eyebrows" | "nose" | "mouth" | "hair" | "accessories"

// Avatar options
const avatarOptions = {
  face: [
    { id: "face-1", src: "/placeholder.svg?height=60&width=60", name: "Round" },
    { id: "face-2", src: "/placeholder.svg?height=60&width=60", name: "Oval" },
    { id: "face-3", src: "/placeholder.svg?height=60&width=60", name: "Square" },
    { id: "face-4", src: "/placeholder.svg?height=60&width=60", name: "Heart" },
  ],
  eyes: [
    { id: "eyes-1", src: "/placeholder.svg?height=40&width=80", name: "Round" },
    { id: "eyes-2", src: "/placeholder.svg?height=40&width=80", name: "Almond" },
    { id: "eyes-3", src: "/placeholder.svg?height=40&width=80", name: "Narrow" },
    { id: "eyes-4", src: "/placeholder.svg?height=40&width=80", name: "Wide" },
  ],
  eyebrows: [
    { id: "eyebrows-1", src: "/placeholder.svg?height=20&width=80", name: "Straight" },
    { id: "eyebrows-2", src: "/placeholder.svg?height=20&width=80", name: "Arched" },
    { id: "eyebrows-3", src: "/placeholder.svg?height=20&width=80", name: "Thick" },
    { id: "eyebrows-4", src: "/placeholder.svg?height=20&width=80", name: "Thin" },
  ],
  nose: [
    { id: "nose-1", src: "/placeholder.svg?height=40&width=40", name: "Small" },
    { id: "nose-2", src: "/placeholder.svg?height=40&width=40", name: "Medium" },
    { id: "nose-3", src: "/placeholder.svg?height=40&width=40", name: "Large" },
    { id: "nose-4", src: "/placeholder.svg?height=40&width=40", name: "Button" },
  ],
  mouth: [
    { id: "mouth-1", src: "/placeholder.svg?height=30&width=60", name: "Smile" },
    { id: "mouth-2", src: "/placeholder.svg?height=30&width=60", name: "Neutral" },
    { id: "mouth-3", src: "/placeholder.svg?height=30&width=60", name: "Smirk" },
    { id: "mouth-4", src: "/placeholder.svg?height=30&width=60", name: "Frown" },
  ],
  hair: [
    { id: "hair-1", src: "/placeholder.svg?height=80&width=100", name: "Short" },
    { id: "hair-2", src: "/placeholder.svg?height=80&width=100", name: "Medium" },
    { id: "hair-3", src: "/placeholder.svg?height=80&width=100", name: "Long" },
    { id: "hair-4", src: "/placeholder.svg?height=80&width=100", name: "Curly" },
    { id: "hair-5", src: "/placeholder.svg?height=80&width=100", name: "Bald" },
  ],
  accessories: [
    { id: "accessories-1", src: "/placeholder.svg?height=60&width=100", name: "Glasses" },
    { id: "accessories-2", src: "/placeholder.svg?height=60&width=100", name: "Sunglasses" },
    { id: "accessories-3", src: "/placeholder.svg?height=60&width=100", name: "Hat" },
    { id: "accessories-4", src: "/placeholder.svg?height=60&width=100", name: "None" },
  ],
}

interface AvatarBuilderProps {
  onSave: (avatar: Record<AvatarFeature, string>) => void
  onCancel: () => void
  initialAvatar?: Partial<Record<AvatarFeature, string>>
}

export function AvatarBuilder({ onSave, onCancel, initialAvatar = {} }: AvatarBuilderProps) {
  const { t } = useTranslation()
  const [activeFeature, setActiveFeature] = useState<AvatarFeature>("face")
  const [selectedFeatures, setSelectedFeatures] = useState<Record<AvatarFeature, string>>({
    face: initialAvatar.face || "face-1",
    eyes: initialAvatar.eyes || "eyes-1",
    eyebrows: initialAvatar.eyebrows || "eyebrows-1",
    nose: initialAvatar.nose || "nose-1",
    mouth: initialAvatar.mouth || "mouth-1",
    hair: initialAvatar.hair || "hair-1",
    accessories: initialAvatar.accessories || "accessories-4", // Default to "None"
  })

  // Get the current index of the selected feature
  const getCurrentIndex = (feature: AvatarFeature): number => {
    const options = avatarOptions[feature]
    return options.findIndex((option) => option.id === selectedFeatures[feature]) || 0
  }

  // Navigate to the next or previous option for the current feature
  const navigateOption = (feature: AvatarFeature, direction: "next" | "prev") => {
    const options = avatarOptions[feature]
    const currentIndex = getCurrentIndex(feature)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % options.length
    } else {
      newIndex = (currentIndex - 1 + options.length) % options.length
    }

    setSelectedFeatures((prev) => ({
      ...prev,
      [feature]: options[newIndex].id,
    }))
  }

  const handleRandomize = () => {
    const randomFeatures: Record<AvatarFeature, string> = {
      face: avatarOptions.face[Math.floor(Math.random() * avatarOptions.face.length)].id,
      eyes: avatarOptions.eyes[Math.floor(Math.random() * avatarOptions.eyes.length)].id,
      eyebrows: avatarOptions.eyebrows[Math.floor(Math.random() * avatarOptions.eyebrows.length)].id,
      nose: avatarOptions.nose[Math.floor(Math.random() * avatarOptions.nose.length)].id,
      mouth: avatarOptions.mouth[Math.floor(Math.random() * avatarOptions.mouth.length)].id,
      hair: avatarOptions.hair[Math.floor(Math.random() * avatarOptions.hair.length)].id,
      accessories: avatarOptions.accessories[Math.floor(Math.random() * avatarOptions.accessories.length)].id,
    }
    setSelectedFeatures(randomFeatures)
  }

  const handleSave = () => {
    onSave(selectedFeatures)
  }

  // Feature navigation
  const features: AvatarFeature[] = ["face", "hair", "eyes", "eyebrows", "nose", "mouth", "accessories"]

  const navigateFeature = (direction: "next" | "prev") => {
    const currentIndex = features.indexOf(activeFeature)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % features.length
    } else {
      newIndex = (currentIndex - 1 + features.length) % features.length
    }

    setActiveFeature(features[newIndex])
  }

  // Get the current option for a feature
  const getCurrentOption = (feature: AvatarFeature) => {
    return avatarOptions[feature].find((option) => option.id === selectedFeatures[feature])
  }

  return (
    <div className="bg-gray-900/90 rounded-xl border border-gray-700 shadow-xl max-w-4xl w-full mx-auto overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          <User className="mr-2 h-5 w-5" />
          {t("avatar.builder")}
        </h2>
        <Button variant="outline" size="sm" onClick={handleRandomize}>
          <Shuffle className="h-4 w-4 mr-2" />
          {t("avatar.randomize")}
        </Button>
      </div>

      <div className="p-6">
        {/* Feature Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigateFeature("prev")}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("avatar.previous")}
          </Button>
          <div className="text-lg font-semibold text-red-400">
            {activeFeature.charAt(0).toUpperCase() + activeFeature.slice(1)}
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigateFeature("next")}>
            {t("avatar.next")}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          {/* Avatar Preview */}
          <div className="md:col-span-3 flex flex-col items-center">
            <div className="relative w-64 h-64 bg-gray-800 rounded-full border-4 border-gray-700 overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* This would be replaced with actual avatar rendering */}
                <div className="relative w-full h-full">
                  {/* Face */}
                  <img
                    src={avatarOptions.face.find((f) => f.id === selectedFeatures.face)?.src || "/placeholder.svg"}
                    alt="Face"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Eyes */}
                  <img
                    src={avatarOptions.eyes.find((f) => f.id === selectedFeatures.eyes)?.src || "/placeholder.svg"}
                    alt="Eyes"
                    className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-10"
                  />
                  {/* Eyebrows */}
                  <img
                    src={
                      avatarOptions.eyebrows.find((f) => f.id === selectedFeatures.eyebrows)?.src || "/placeholder.svg"
                    }
                    alt="Eyebrows"
                    className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-5"
                  />
                  {/* Nose */}
                  <img
                    src={avatarOptions.nose.find((f) => f.id === selectedFeatures.nose)?.src || "/placeholder.svg"}
                    alt="Nose"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10"
                  />
                  {/* Mouth */}
                  <img
                    src={avatarOptions.mouth.find((f) => f.id === selectedFeatures.mouth)?.src || "/placeholder.svg"}
                    alt="Mouth"
                    className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-15 h-7.5"
                  />
                  {/* Hair */}
                  <img
                    src={avatarOptions.hair.find((f) => f.id === selectedFeatures.hair)?.src || "/placeholder.svg"}
                    alt="Hair"
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-25 h-20"
                  />
                  {/* Accessories */}
                  {selectedFeatures.accessories !== "accessories-4" && (
                    <img
                      src={
                        avatarOptions.accessories.find((f) => f.id === selectedFeatures.accessories)?.src ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt="Accessories"
                      className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-25 h-15"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Feature Options with Arrows */}
          <div className="md:col-span-4">
            <AnimatePresence mode="wait">
              {features.map((feature) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: activeFeature === feature ? 1 : 0, y: activeFeature === feature ? 0 : 20 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${activeFeature === feature ? "block" : "hidden"}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => navigateOption(feature, "prev")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-700 rounded-md overflow-hidden mb-2 flex items-center justify-center">
                          <img
                            src={getCurrentOption(feature)?.src || "/placeholder.svg"}
                            alt={getCurrentOption(feature)?.name}
                            className="max-w-full max-h-full"
                          />
                        </div>
                        <span className="text-lg font-medium">{getCurrentOption(feature)?.name}</span>
                        <div className="text-xs text-gray-400 mt-1">
                          {getCurrentIndex(feature) + 1} / {avatarOptions[feature].length}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => navigateOption(feature, "next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Feature Selection Dots */}
                  <div className="flex justify-center mt-4 space-x-1">
                    {avatarOptions[feature].map((option, index) => (
                      <button
                        key={option.id}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedFeatures[feature] === option.id ? "bg-red-500 scale-125" : "bg-gray-600"
                        }`}
                        onClick={() =>
                          setSelectedFeatures((prev) => ({
                            ...prev,
                            [feature]: option.id,
                          }))
                        }
                        aria-label={`Select ${option.name}`}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Feature Navigation Tabs */}
            <div className="flex justify-center mt-8 space-x-2">
              {features.map((feature) => (
                <button
                  key={feature}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    activeFeature === feature ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveFeature(feature)}
                >
                  {feature.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-8 space-x-3">
          <Button variant="outline" onClick={onCancel}>
            {t("avatar.cancel")}
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            {t("avatar.save")}
          </Button>
        </div>
      </div>
    </div>
  )
}
