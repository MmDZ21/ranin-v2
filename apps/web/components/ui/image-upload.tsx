"use client"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { uploadFile } from "@/actions/upload"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  label?: string
}

export function ImageUpload({ value, onChange, disabled, label = "آپلود تصویر" }: ImageUploadProps) {
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState<string | undefined>(value)

  useEffect(() => {
    setPreview(value)
  }, [value])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create local preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    startTransition(async () => {
      const formData = new FormData()
      formData.append("file", file)

      const res = await uploadFile(formData)
      if (res.error) {
        alert(res.error)
        setPreview(value) // Revert on error
      } else {
        onChange(res.url)
      }
    })
  }

  const handleRemove = () => {
    onChange("")
    setPreview(undefined)
  }

  return (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 border rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
            {preview ? (
                <>
                <Image 
                    src={preview} 
                    alt="Upload preview" 
                    fill 
                    className="object-cover" 
                />
                <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md hover:bg-red-600 transition z-10"
                    disabled={disabled || isPending}
                >
                    <X className="w-3 h-3" />
                </button>
                </>
            ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
            )}
        </div>
        <div className="flex-1">
            <Button
            type="button"
            variant="outline"
            disabled={disabled || isPending}
            onClick={() => document.getElementById("image-upload-input")?.click()}
            >
            <Upload className="w-4 h-4 mr-2" />
            {isPending ? "در حال آپلود..." : label}
            </Button>
            <Input
            id="image-upload-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={disabled || isPending}
            />
        </div>
        </div>
    </div>
  )
}

