# Templates de Memes

Ce dossier contient les images templates pour la galerie de memes.

## Templates actuels

Les templates suivants sont déjà configurés et disponibles dans la galerie :
- `all_well.jpg`
- `clever.jpg`
- `made_it.jpg`

## Comment ajouter de nouveaux templates

1. Ajoutez vos images dans ce dossier (formats supportés : JPG, PNG, GIF, WebP)
2. Modifiez le fichier `script.js` et ajoutez les chemins de vos images dans le tableau `templateImages` de la fonction `loadGalleryTemplates()`

Exemple :
```javascript
const templateImages = [
    'templates/all_well.jpg',
    'templates/clever.jpg',
    'templates/made_it.jpg',
    'templates/votre_nouveau_template.jpg'  // Ajoutez votre nouveau template ici
];
```

Les images seront automatiquement affichées dans la galerie et pourront être sélectionnées pour créer des memes.

**Note :** Vous pouvez toujours utiliser l'onglet "Upload" pour télécharger vos propres images sans les ajouter dans ce dossier.

