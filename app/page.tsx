"use client"

import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { GameAccessModal } from "@/components/game-access-modal"
import { Navbar } from "@/components/navbar"
import { MoonIcon, UsersIcon, EyeIcon } from "lucide-react"

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-gradient-to-b from-gray-900/95 to-gray-800/95 text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <HeroSection />
          <FeaturesSection />
          <HowToPlaySection />
        </main>
        <footer className="bg-gray-900/80 backdrop-blur-sm py-6 text-center text-gray-400 border-t border-gray-800">
          <p>
            © {new Date().getFullYear()} {t("home.title")}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="py-20 text-center relative">
      <div className="absolute inset-0 bg-red-900/10 rounded-3xl backdrop-blur-sm -z-10"></div>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl font-bold mb-6 text-red-500 drop-shadow-lg">{t("home.title")}</h1>
        <p className="text-xl mb-8">{t("home.subtitle")}</p>
        <div className="animate-pulse">
          <GameAccessModal
            trigger={
              <Button size="lg" className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30">
                {t("common.play")}
              </Button>
            }
          />
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      title: t("home.features.strategic.title"),
      description: t("home.features.strategic.description"),
      icon: <EyeIcon className="h-12 w-12 text-purple-500" />,
    },
    {
      title: t("home.features.roles.title"),
      description: t("home.features.roles.description"),
      icon: <UsersIcon className="h-12 w-12 text-blue-500" />,
    },
    {
      title: t("home.features.cycles.title"),
      description: t("home.features.cycles.description"),
      icon: <MoonIcon className="h-12 w-12 text-yellow-500" />,
    },
  ]

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-red-400">{t("home.features.title")}</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg text-center border border-gray-700 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-1"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowToPlaySection() {
  const { t } = useTranslation()

  const steps = [
    {
      title: t("home.howToPlay.steps.1.title"),
      description: t("home.howToPlay.steps.1.description"),
    },
    {
      title: t("home.howToPlay.steps.2.title"),
      description: t("home.howToPlay.steps.2.description"),
    },
    {
      title: t("home.howToPlay.steps.3.title"),
      description: t("home.howToPlay.steps.3.description"),
    },
    {
      title: t("home.howToPlay.steps.4.title"),
      description: t("home.howToPlay.steps.4.description"),
    },
  ]

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gray-800/50 rounded-3xl backdrop-blur-sm -z-10"></div>
      <h2 className="text-3xl font-bold text-center mb-12 text-red-400">{t("home.howToPlay.title")}</h2>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start bg-gray-900/60 p-4 rounded-lg border border-gray-700 hover:border-red-500/30 transition-all"
            >
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-red-600/20">
                {index + 1}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <GameAccessModal
            trigger={
              <Button size="lg" className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30">
                {t("common.play")}
              </Button>
            }
          />
        </div>
      </div>
    </section>
  )
}
