export const AVATAR_HOMME = "/images/avatar-homme.jpg"
export const AVATAR_FEMME = "/images/avatar-femme.jpg"

/**
 * Photo à afficher pour un profil :
 * - la vraie photo si elle existe,
 * - sinon l'avatar par défaut selon le genre (Femme → avatar-femme, sinon avatar-homme).
 */
export function getProfilePhoto(
  profile?: { mainPhoto?: string | null; gender?: string | null } | null
): string {
  if (profile?.mainPhoto) return profile.mainPhoto
  return profile?.gender === "Femme" ? AVATAR_FEMME : AVATAR_HOMME
}
