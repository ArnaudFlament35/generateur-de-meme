# 🎭 Générateur de Meme

Application web simple et moderne pour créer des memes personnalisés.

## Fonctionnalités

- ✅ **Upload d'images** : Téléchargez votre propre image comme template
- ✅ **Galerie de templates** : Sélectionnez parmi une collection de templates prédéfinis
- ✅ **Texte personnalisable** : Ajoutez du texte avec taille ajustable
- ✅ **Style de texte** : Texte blanc avec bordures noires pour une meilleure lisibilité
- ✅ **Positionnement** : Placez le texte en haut, au centre ou en bas
- ✅ **Téléchargement** : Téléchargez votre meme en haute qualité (PNG)

## Utilisation

1. Ouvrez `index.html` dans votre navigateur web
2. Choisissez une image :
   - **Onglet Upload** : Téléchargez votre propre image
   - **Onglet Galerie** : Sélectionnez un template prédéfini
3. Ajoutez votre texte dans la zone de texte
4. Ajustez la taille du texte avec le slider
5. Choisissez la position du texte (haut/centre/bas)
6. Cliquez sur "Télécharger le meme" pour sauvegarder votre création

## Structure du projet

```
cursor_video/
├── index.html          # Structure HTML principale
├── styles.css          # Styles CSS
├── script.js           # Logique JavaScript
├── templates/          # Dossier pour les images templates
│   └── README.md       # Instructions pour ajouter des templates
└── README.md           # Ce fichier
```

## Ajouter des templates à la galerie

1. Ajoutez vos images dans le dossier `templates/`
2. Modifiez `script.js` et ajoutez les chemins dans le tableau `templateImages` de la fonction `loadGalleryTemplates()`

Exemple :
```javascript
const templateImages = [
    'templates/template1.jpg',
    'templates/template2.png'
];
```

## Technologies utilisées

- HTML5
- CSS3 (avec Grid et Flexbox)
- JavaScript vanilla
- Canvas API pour le rendu et l'export

## Compatibilité

L'application fonctionne sur tous les navigateurs modernes supportant :
- Canvas API
- FileReader API
- ES6+

## Notes

- Les images téléchargées sont exportées en PNG haute qualité
- Le texte supporte les retours à la ligne (appuyez sur Entrée)
- La taille du texte peut être ajustée de 20px à 100px

