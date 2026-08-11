# TEDxDelémont — nouveau site (v24)

Site statique complet (HTML / CSS / JS). Aucun build, aucune dépendance sauf la
**aucune** : les deux polices (Helvetica, officielle TEDx, et Mrs Saint Delafield, hébergée dans `assets/fonts/` avec sa licence OFL) sont locales ou système. Plus aucun appel à Google Fonts.
Pour prévisualiser : double-cliquez sur `index.html`.

## Parti pris graphique

Base sombre TEDx, minimaliste, volontairement non standard :

- **Hero sans photo** — un champ de points rouges dessiné sur canvas : dérive lente,
  répulsion souple autour du curseur, halo rouge qui suit la souris. Plus de
  diaporama. Même traitement sur l'accueil et sur la page Édition 2026.
- **HUD de verre liquide** — la barre d'infos du hero est un bloc en verre dépoli
  (`backdrop-filter`) avec reflet qui balaie la surface, point rouge pulsant et
  compte à rebours intégré.
- **Sections « eau »** — nappes de couleur floutées (rouge, vert acide, bleu) qui
  dérivent lentement en fond, sous des panneaux de verre translucides.
- **Typographie empilée** — titres Helvetica massifs, lignes décalées, révélées par
  masque au scroll. Point rouge TED en fin de titre.
- **Deux polices, pas une de plus** — Helvetica pour tout, y compris les petites
  capitales espacées des intitulés, rôles et légendes. Mrs Saint Delafield en rouge
  uniquement dans les grands titres, sur **un seul mot** : *Revivez*, *joyeuse*,
  *À propos*, *surprenante*, *intelligences*, *images*, *possible*, *bénévoles*,
  *Rendez-vous*. Jamais dans un paragraphe.
- **Équilibre des deux polices** — Mrs Saint Delafield a une hauteur d'x très basse :
  le mot en cursive est composé à 1,82 fois le corps de l'Helvetica voisine pour que
  les deux paraissent optiquement de la même taille. La ligne de titre concernée
  reçoit une réserve haute et basse pour que les déliés ne soient pas coupés.
- **Curseur** — un X rouge (le x de TEDx) qui pivote selon le mouvement et devient
  vert acide sur les éléments cliquables. Le curseur système est masqué : il n'y
  a plus de double curseur.
- **Galerie animée** — deux bandes de photos qui défilent en continu et en sens
  opposés, mises en pause au survol.
- **En-tête « pilules »** — logo à gauche, pilule rouge Billetterie et bouton MENU
  blanc alignés en haut à droite. Le menu s'ouvre en plein écran : entrées rouges
  géantes, numérotées, avec flèche au survol et soulignement sur la page active.
- **Hero à image : l'accueil uniquement.** Les trois autres pages gardent leur
  en-tête typographique sur fond noir (points rouges animés sur la page 2026).
- **Hero d'accueil** — la photo de la salle comble occupe la moitié gauche en fond,
  bord à bord, avec un fondu vers le noir sur son bord droit et son bas. À droite,
  sur le noir aux points rouges animés, le texte aligné à droite : RENDEZ-VOUS LE /
  *23 avril 2027* (cursive rouge) / POUR LA SECONDE ÉDITION. En bas, sur toute la
  largeur : *thème 2027* en blanc puis EXPLORATION en géant. **Au survol, chaque
  lettre bascule en Mrs Saint Delafield rouge** — les deux glyphes sont superposés,
  le second en position absolue, pour que le changement de police ne décale rien.
- **Mot géant pleine largeur, 100 % responsive** — EXPLORATION est en `inline-block`
  (sa largeur mesurée est donc bien celle du texte, pas celle du bloc parent — c'était
  la cause du mauvais ajustement). Le script mesure à une taille de référence, applique
  la règle de trois, puis affine en trois passes : le mot occupe exactement la largeur
  de l'écran à n'importe quelle taille. Recalculé au chargement, au redimensionnement,
  à la rotation de l'écran, à l'arrivée des polices et via un ResizeObserver.
- **Script Mrs Saint Delafield** — la police que tu as fournie, convertie en woff2
  (20 Ko) et hébergée dans `assets/fonts/` avec sa licence OFL. Aucune dépendance
  externe. Réservée à deux mots : « Rendez-vous » et « thème ». Le reste de la
  phrase est en Helvetica.
- **Bande de mots** — CRÉER + INSPIRER + INTRIGUER + INNOVER en défilement continu.
- **Menu empilé en haut à droite** — logo doublé (jusqu'à 112 px), pilule Billetterie,
  puis les trois entrées empilées en dessous, doublées elles aussi (jusqu'à 3,35 rem),
  bien détachées du bouton. Dès qu'on défile, l'en-tête se compacte automatiquement
  en une barre horizontale pour ne pas manger l'écran. Sous 1080 px, bouton MENU +
  menu plein écran.
- **Corrections d'alignement** — une variable `--edge` aligne le texte du hero sur
  exactement la même marge que le logo et le menu, à toutes les largeurs. Les numéros
  du menu plein écran ont été retirés pour que les libellés s'alignent sur les liens
  du bas. La sous-navigation de la page 2026 se colle à la hauteur réelle de l'en-tête,
  mesurée en direct (variable `--nav-now`).
- **Menu mobile** — une croix rouge en haut à droite ferme le menu (l'en-tête passait
  derrière le panneau, le bouton était donc inaccessible). Échap fonctionne aussi.
- **Hero mobile plein écran** — la section fait 100 % de la hauteur d'écran : la photo
  occupe l'espace disponible et le mot géant est calé tout en bas.
- **Filet de sécurité** — si `main.js` ne s'exécute pas, un script inline révèle
  tous les titres et contenus après 2,5 s. Aucun contenu ne peut rester invisible.

## Structure

```
index.html              Accueil — hero animé, thème « EXPLORATION », newsletter
                        (aucun contenu de l'édition 2026)
edition-2026.html       01 Aftermovie · 02 La soirée · 03 Galerie animée
                        04 Conférencier·ère·s · 05 Partenaires · 06 Workshop
a-propos-de-tedx.html   Texte protocole TEDx (repris tel quel)
le-comite.html          Les 6 membres du comité
assets/css/style.css    Design system complet
assets/js/main.js       Interactions (⚙️ config billetterie en haut du fichier)
assets/docs/            Livre blanc en téléchargement direct (PDF, 6 Mo)
sitemap.xml · robots.txt · _redirects
```

## ⚙️ Activer la billetterie 2027

Une seule modification, au début de `assets/js/main.js` :

```js
const TICKETS = {
  open: true,                                  // ← passer à true
  url: "https://infomaniak.events/...",        // ← coller le lien
};
```

Tous les boutons du site (barre de nav, menu mobile, footer, bas de la page 2026)
passent automatiquement de « Billetterie bientôt ouverte » (grisé) à un lien actif.

## ⚙️ Connecter la newsletter

Dans `index.html`, section `#newsletter`, sur la balise `<form>` :

```html
<form class="nl-form" data-newsletter action="URL_DU_SERVICE" method="post">
```

Le champ e-mail s'appelle `EMAIL` (à renommer selon Brevo / Mailchimp).
Un champ anti-spam invisible (`website`) est déjà en place.

## Compte à rebours

Le J−… affiché dans la barre du haut, dans le HUD du hero et dans l'encadré
« Prochaine édition » est calculé à partir de la date cible `2027-04-23T17:00+02:00` :
recalculé à chaque chargement de page, puis toutes les minutes, et à chaque retour
sur l'onglet. Aucune intervention n'est nécessaire.

## Contenus mis à jour dans cette version

- **Conférencier·ère·s** : les biographies ont été remplacées par un résumé de
  conférence en un paragraphe + une citation, extraits du livre blanc
  « L'ENTREPRISE DE DEMAIN ». Icône YouTube sur chaque lien de rediffusion.
- **Livre blanc** : téléchargement direct du PDF (hébergé sur le site) + lien
  Canva en secondaire.
- **Table Sismic** : illustrée avec la photo dédiée de la galerie.
- **Logos** : tous détourés et affichés en `contain`, jamais rognés. DJ IDEM,
  DJ Hakim, BFR et Big Factory en version blanche sur fond noir, à grande taille.
  Agence Curcuma en version bicolore (fond clair) sur les tuiles blanches.
- **Photos du comité** : recadrées automatiquement par détection de visage,
  format 4:5 homogène, visage centré à 36 % de la hauteur.
- **Thèmes** : toujours écrits « EN MAJUSCULES ENTRE GUILLEMETS ».

## Reste à compléter

- **Logo DécorLight** : absent des fichiers fournis → affiché en texte sur la page
  Partenaires (commentaire `⚙️` dans `edition-2026.html`).
- **Photos 2027** : l’accueil ne contient plus aucune photo (parti pris minimaliste) ; les visuels 2027 pourront y être ajoutés après l’édition.
- **Conférenciers 2027** : à ajouter dès l'annonce de la programmation.

## Mise en ligne

1. **Netlify / Vercel** : glisser-déposer le dossier. `_redirects` gère les
   anciennes URLs Wix (`/conférenciers2026`, `/partenaires`…).
2. **Infomaniak / FTP** : envoyer le contenu à la racine `web/`, recréer les
   redirections dans `.htaccess`.
3. Remplacer `https://www.tedxdelemont.ch/` par le domaine final si différent
   (canonical, Open Graph, sitemap, JSON-LD).
4. Soumettre `sitemap.xml` dans la Google Search Console.

## SEO & accessibilité

Titres, descriptions et canonical uniques par page · Open Graph + Twitter Card ·
JSON-LD (Organization, WebSite, Event 2026, Event 2027, comité, fil d'Ariane) ·
alt descriptifs · `width`/`height` sur les images · lazy loading · preload du
visuel hero · HTML sémantique · lien d'évitement · focus visible · navigation
clavier complète · `prefers-reduced-motion` · contenu visible même sans JavaScript.

## Poids

Site complet ≈ 17 Mo, dont 6 Mo de livre blanc PDF et 5,6 Mo d'aftermovie
(recompressé depuis 394 Mo, chargé uniquement au clic).
