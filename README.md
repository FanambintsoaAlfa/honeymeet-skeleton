# HoneyMeet – Plateforme Web de Rencontre

**Skeleton officiel** – Honey Group  
Stage : Conception et développement d’une plateforme de rencontre internationale avec support Mobile Money Madagascar.

---

## 🎯 Objectif du projet

Développer une plateforme de rencontre moderne permettant :
- L’accès aux utilisateurs **Internationaux** et **Locaux (Madagascar)**
- Un système de matching avancé (algorithmes + géolocalisation + filtres)
- Une messagerie / chat
- Un modèle économique payant (abonnements)
- Des paiements via **Stripe** (international) et **Mobile Money** (MVola, Orange Money, Airtel Money) avec transfert direct vers les comptes Honey Group

---

## 🏗️ Architecture système

```
USER ACCESS & CLIENTS
├── Web (Next.js)
├── iOS App
└── Android App
        │
        ▼ Secure HTTPS
ACCESS & LOAD BALANCER (AWS)
        │
        ▼
SYSTEM BACKEND
├── Auth & Security (Auth0 + JWT)
├── User Profile Management
├── Matching Engine (Algorithms + Geolocation + Filters)
├── Communications (Chat + Messaging + Notifications) → Jitsi
└── Subscriptions & Memberships
        │
        ▼
PAYMENT & SUBSCRIPTION MODULE
├── International → Stripe / PayPal
└── Madagascar → MVola / Orange Money / Airtel Money
                 (Transfert direct → Comptes Honey Group)
        │
        ▼
DATA LAYER
├── Main DB          → PostgreSQL (Profiles, Matches...)
├── Cache            → Redis
├── Object Storage   → AWS S3 (Photos, Videos)
└── Analytics & Reporting
```

---

## 🗄️ Modèle de données (PostgreSQL)

Tables principales (selon spécifications Honey Group) :

| Table                    | Description                              |
|--------------------------|------------------------------------------|
| `users`                  | Comptes utilisateurs (International / Local) |
| `profiles`               | Profils membres + géolocalisation + is_premium |
| `photos_videos`          | Médias stockés sur AWS S3                |
| `matches_interactions`   | Likes, Dislikes, SuperLikes, Matchs      |
| `subscriptions`          | Abonnements (Mensuel, Trimestriel, Pass) |
| `transactions_payments`  | Historique des paiements (Stripe + Mobile Money) |

### Logique de paiement Mobile Money (Madagascar)
1. L’utilisateur effectue le transfert vers les comptes professionnels Honey Group
2. La plateforme enregistre la transaction avec statut `PENDING` + référence
3. Validation (Webhook API ou manuelle admin) → statut `SUCCESS`
4. Activation de l’abonnement + `is_premium = true`

---

## 🛠️ Stack technique

| Couche              | Technologie                     |
|---------------------|---------------------------------|
| Framework           | Next.js 15 (App Router)         |
| Langage             | TypeScript                      |
| Styling             | Tailwind CSS                    |
| Base de données     | PostgreSQL + Prisma             |
| Auth (prévu)        | Auth0 / JWT                     |
| Paiements           | Stripe + Mobile Money           |
| Stockage médias     | AWS S3                          |
| Chat (prévu)        | Jitsi / temps réel              |
| Cache               | Redis                           |
| Déploiement         | Vercel + AWS                    |

---

## 📁 Structure du projet (Skeleton)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── search/          ← Matching Engine
│   │   ├── matches/
│   │   ├── messages/        ← Communications
│   │   └── subscription/    ← Paiements & Abonnements
│   └── api/
│       ├── auth/
│       ├── payments/
│       └── webhooks/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── profile/
│   ├── matching/
│   ├── chat/
│   └── payments/
├── lib/
├── types/
└── styles/
prisma/
└── schema.prisma            ← Schéma officiel complet
```

---

## 🚀 Installation & Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données
cp .env.example .env
# → Remplir DATABASE_URL avec votre PostgreSQL

# 3. Générer le client Prisma
npx prisma generate

# 4. Pousser le schéma (création des tables)
npx prisma db push

# 5. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📋 Prochaines étapes (après validation du Skeleton)

1. Authentification complète (Auth0 ou NextAuth + JWT)
2. CRUD Profils + Upload photos (AWS S3)
3. Matching Engine (filtres + score de compatibilité)
4. Système de Likes / Matchs
5. Messagerie temps réel
6. Module Paiements :
   - Stripe (international) → activation automatique
   - Mobile Money → flux Pending → Success
7. Dashboard Admin (validation manuelle des paiements Mobile Money)

---

## 👤 Auteur

**FANAMBINATSOA Alfa**  
Stage à distance – Honey Group  
Gérant : Robert Samson RAKOTOARISON

---

## 📄 Licence

Projet privé – Honey Group © 2024-2026
