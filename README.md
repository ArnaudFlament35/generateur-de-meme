# Générateur de Memes - Application Next.js avec InstantDB

Application fullstack permettant aux utilisateurs de créer, publier et voter pour des memes.

## Fonctionnalités

- **Générateur de memes** : Créez des memes avec des templates ou vos propres images
- **Publication** : Publiez vos memes dans la galerie publique
- **Système de vote** : Votez pour vos memes préférés (un vote par utilisateur par meme)
- **Authentification** : Système d'inscription et de connexion avec InstantDB
- **Galerie publique** : Parcourez tous les memes publiés, triés par nombre de votes

## Technologies

- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage statique
- **InstantDB** : Base de données temps réel
- **React** : Bibliothèque UI

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
Créez un fichier `.env.local` à la racine du projet :
```
NEXT_PUBLIC_INSTANTDB_APP_ID=8df3dccd-a945-4d8f-8ace-161a00ae419b
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Structure du projet

```
cursor_video/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx         # Layout principal avec InstantDB Provider
│   ├── page.tsx           # Page d'accueil (Galerie)
│   ├── create/            # Page générateur de memes
│   ├── login/             # Page authentification
│   └── api/               # API routes
├── components/            # Composants React
│   ├── MemeGenerator/    # Composants du générateur
│   ├── MemeGallery/       # Composants de la galerie
│   ├── Auth/             # Composants d'authentification
│   └── Layout/           # Composants de layout
├── lib/                  # Utilitaires et configuration
│   ├── instantdb.ts      # Configuration InstantDB
│   └── utils.ts         # Utilitaires (canvas, base64)
├── styles/               # Styles CSS globaux
│   └── globals.css
└── public/               # Fichiers statiques
    └── templates/        # Templates de memes
```

## Utilisation

1. **Créer un compte** : Cliquez sur "Se connecter" puis "S'inscrire"
2. **Créer un meme** : Allez sur "Créer un meme", sélectionnez un template ou uploadez une image
3. **Ajouter du texte** : Utilisez les contrôles pour ajouter, modifier et positionner du texte
4. **Publier** : Cliquez sur "Publier" pour partager votre meme
5. **Voter** : Dans la galerie, cliquez sur le bouton de vote pour voter pour un meme

## Notes

- Les images sont stockées en base64 dans InstantDB
- Un utilisateur ne peut voter qu'une seule fois par meme
- La galerie affiche les memes triés par nombre de votes décroissant
