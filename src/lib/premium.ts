// Prix de l'abonnement Premium mensuel (Ariary). Défini côté serveur :
// le client ne doit jamais pouvoir choisir le montant.
export const PREMIUM_PRICE_MGA = 15000

export const MOBILE_MONEY_METHODS = ["MVOLA", "ORANGE_MONEY", "AIRTEL_MONEY"] as const
export type MobileMoneyMethod = (typeof MOBILE_MONEY_METHODS)[number]
