"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AvatarBuilder } from "@/components/avatar-builder/avatar-builder"

interface AvatarBuilderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (avatarData: any) => void
  initialAvatar?: any
}

export function AvatarBuilderModal({ open, onOpenChange, onSave, initialAvatar }: AvatarBuilderModalProps) {
  const handleSave = (avatarData: any) => {
    onSave(avatarData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] p-0 bg-transparent border-none shadow-none">
        <AvatarBuilder onSave={handleSave} onCancel={handleCancel} initialAvatar={initialAvatar} />
      </DialogContent>
    </Dialog>
  )
}
