import { v2 as cloudinary } from "cloudinary"

// Le nom du cloud n'est pas secret : NEXT_PUBLIC_ est accepté, mais CLOUDINARY_CLOUD_NAME est préféré.
const cloudName =
  (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)?.trim()
const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret, // secret : serveur uniquement, jamais NEXT_PUBLIC_
  secure: true,
})

/** Vrai si les 3 variables Cloudinary sont renseignées (sans jamais afficher leur valeur). */
export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret)
}

export default cloudinary
