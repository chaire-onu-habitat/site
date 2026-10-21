/* =========================================================
   REMPLISSAGE AUTOMATIQUE DU SITE
   ---------------------------------------------------------
   Organisation du dossier data/ :

     data/structure/   structure du site (rarement modifiée)
       navigation.json   navigation supérieure, menu principal,
                         sous-menus et réseaux sociaux. Le footer
                         est généré à partir des mêmes données.
       accueil.json      réglages de la page d'accueil
                         (éléments affichés dans le carrousel)
       images.json       images du site (gestionnaire d'images) :
                         texte alternatif de chaque image

     data/contenus/    contenus ajoutés au fil de l'eau
       actualites.json, publications.json, projets.json,
       personnes.json, evenements.json, partenaires.json

   ---------------------------------------------------------
   CONTENUS : tout conteneur portant  data-source="xxx"  est
   rempli depuis  data/contenus/xxx.json.
     data-source  (obligatoire) nom du fichier, sans extension
     data-limit   (optionnel)   nombre maximum d'éléments
   Tri du plus récent au plus ancien (champ "date" AAAA-MM-JJ).
   Pour un nouveau type : créer le JSON, ajouter un gabarit
   dans RENDUS, placer <div data-source="nouveau-type"></div>.

   NAVIGATION (depuis data/structure/navigation.json) :
     data-nav="superieure"  liens de la navigation supérieure
     data-nav="principale"  menu principal + méga-menus
     data-nav="footer"      colonnes du footer (une par
                            catégorie ayant un sous-menu, puis
                            la colonne des réseaux sociaux)
   Une fois le menu construit, l'évènement "navigation:prete"
   est émis sur document (le script du menu s'y branche).

   CATÉGORIES : le champ "categorie" des contenus contient l'id
   d'une entrée de navigation.json (catégorie du menu ou élément
   de sous-menu, ex. "seminaires-et-conferences"). Le titre
   affiché est celui de navigation.json.

   CARROUSEL (depuis data/structure/accueil.json) :
     data-carrousel  sur la section .hero : les diapositives sont
                     les actualités, publications ou projets dont
                     les ids sont listés dans "carrousel.elements"
                     (dans cet ordre).
   Une fois construit, l'évènement "carrousel:pret" est émis
   sur document (le script du carrousel s'y branche).

   AGENDA (depuis data/contenus/evenements.json) :
     data-agenda  conteneur de la section Agenda : onglets
                  « À venir » / « Passés », calculés d'après la
                  date du jour du visiteur.
       data-limit-avenir  (optionnel) nb d'évènements à venir
                          affichés avant « Afficher plus » (déf. 6)
       data-limit-passes  (optionnel) idem pour les passés (déf. 4)

   PROJET (fiche détaillée d'un projet) :
     data-projet="id-du-projet"  conteneur de la section Projet.
       Affiche : pays, titre, image, description du projet ;
       un volet de navigation à droite (voir VOLET ci-dessous,
       menu "projets" par défaut, projet courant mis en évidence) ;
       les publications dont "projets" contient cet id ;
       les personnes listées dans le champ "personnes" du projet
       (ids de personnes.json, dans cet ordre ; avec photo ;
       carte cliquable si la personne a un "lien") ;
       les partenaires listés dans le champ "partenaires" du
       projet (ids de data/contenus/partenaires.json) ;
       les dernières actualités dont "projets" contient cet id.
       data-limit-actualites  (optionnel) nb d'actualités affichées,
                          puis « Afficher plus » par lots de ce nombre (déf. 4)
       data-limit-equipe  (optionnel) nb de personnes affichées
                          avant « Afficher plus » sur grand écran (déf. 5)
       data-limit-equipe-mobile  (optionnel) idem sur petit écran,
                          ≤ 600 px, grille de 2 colonnes (déf. 6)
       data-volet         (optionnel) autre menu pour le volet
       data-volet-titre   (optionnel) titre du volet
                          (déf. « Tous les projets »)

   PERSONNE (portrait détaillé, même principe que PROJET) :
     data-personne="id-de-la-personne"  conteneur d'une section.
       Plusieurs ids possibles, séparés par des virgules
       (ex. "rania-hedeya, aida-robbana") : portraits à la suite.
       Affiche : nom, photo, biographie ; puis ses publications,
       projets et dernières actualités (avec les évènements) ;
       un volet de navigation à droite (menu "a-propos" par défaut).
       data-volet         (optionnel) autre menu pour le volet,
                          ou "aucun" pour ne pas en afficher
       data-volet-actif   (optionnel) élément du menu mis en évidence
       data-volet-titre   (optionnel) titre du volet

   MEMBRES ET PARTENAIRES :
     data-partenaires  conteneur de la section. Affiche d'abord les
                       membres (pastilles rondes avec photo, comme
                       l'équipe d'un projet, depuis personnes.json),
                       puis les partenaires groupés par catégorie
                       (ordre de "categories" dans partenaires.json).
       data-partenaires="id1, id2"  (optionnel) n'afficher que ces
                       catégories de partenaires
       data-membres    (optionnel) ids de personnes séparés par des
                       virgules, dans l'ordre voulu (déf. toutes les
                       personnes de personnes.json) ; "aucun" pour
                       masquer le bloc Membres
       data-titre-membres (optionnel) titre du bloc (déf. « Membres »)
       data-limit-membres, data-limit-membres-mobile (optionnel)
                       pastilles visibles avant « Afficher plus »
                       (déf. toutes)
       data-titre      (optionnel) titre (déf. « Nos membres et partenaires »)
       data-volet      (optionnel) menu du volet (déf. "membres-partenaires",
                       donc menu « À propos » avec cet élément en
                       évidence) ; "aucun" pour ne pas en afficher
       data-volet-actif, data-volet-titre : comme pour VOLET.

   BLOCS (pages composées dans le gestionnaire, accueil compris) :
     data-blocs="accueil" | "page:id" | "personne:id" | "projet:id"
                       sections de la page enregistrées par le
                       gestionnaire (texte, image, agenda, actualités,
                       membres et partenaires…), voir BLOCS plus bas.
     data-liste="publications|actualites|evenements|fil"  liste filtrée
                       (data-liste-projets, data-liste-personnes,
                       data-liste-categorie, data-limit).

   PERSONNES ET PROJETS D'UNE PAGE (pages créées dans le gestionnaire) :
     data-page-liens   conteneur ; data-liens-personnes, data-liens-projets
                       et data-liens-partenaires ("id1, id2") : personnes
                       (pastilles), projets (cartes) et partenaires (logos)
                       liés à la page.

   TOUS LES PROJETS (vue d'ensemble des projets de la Chaire) :
     data-projets      conteneur de la section. Affiche les projets de
                       projets.json (dans l'ordre du fichier), en cartes :
                       image, pays, titre, extrait, équipe en pastilles,
                       nombre de publications et d'actualités liées.
                       Un filtre par pays apparaît s'il y a plusieurs pays.
       data-titre      (optionnel) titre (déf. « Les projets de la Chaire »)
       data-pays       (optionnel) ids de pays séparés par des virgules :
                       n'afficher que ces pays (ex. "tunisie, maroc")
       data-filtres="non" (optionnel) masque le filtre par pays
       data-limit      (optionnel) nb de cartes affichées, puis
                       « Afficher plus » par lots de ce nombre (déf. 6)
       data-volet      (optionnel) menu d'un volet à droite
                       (ex. "projets") ; aucun volet par défaut
       data-volet-actif, data-volet-titre : comme pour VOLET.

   CATÉGORIE (liste des contenus d'une catégorie + volet) :
     data-categorie="id"  id d'une entrée de navigation.json :
       - élément de sous-menu (ex. "ouvrages-et-articles-scientifiques")
         -> contenus dont "categorie" vaut cet id ; volet = menu de
            sa catégorie parente ("Publications"), élément en évidence ;
       - catégorie du menu (ex. "publications")
         -> contenus de la catégorie ET de tous ses sous-menus.
       Les 4 plus récents, puis « Afficher plus » par lots de 4.
       data-limit    (optionnel) taille des lots (déf. 4)
       data-sources  (optionnel) fichiers parcourus, séparés par des
                     virgules (déf. "actualites, publications")
       data-titre    (optionnel) titre affiché (déf. titre de navigation.json) ;
                     "aucun" = pas de titre (blocs « Contenus d'une catégorie »)
       data-volet, data-volet-actif, data-volet-titre : comme ci-dessous,
                     data-volet="aucun" pour ne pas afficher de volet.

   VOLET (menu latéral de navigation, à droite du contenu) :
     data-volet="id"  sur n'importe quel conteneur : son contenu
                      passe dans une colonne principale et un volet
                      est ajouté à droite (dessous sur mobile).
       "id" = id d'une catégorie de navigation.json (ex. "a-propos")
              -> le volet liste son sous-menu (ou son sous-menu
                 automatique, ex. "projets" groupés par pays) ;
              ou id d'un élément de sous-menu (ex. "la-chaire")
              -> volet de sa catégorie, cet élément mis en évidence.
       data-volet-actif  (optionnel) id de l'élément à mettre en
                         évidence. Sans lui, c'est le lien qui pointe
                         vers la page courante.
       data-volet-titre  (optionnel) titre (déf. titre de la catégorie)
     Le volet est généré par la même fonction que le méga-menu
     (colonnesCategorie) : un seul système, aucune liste à recopier.
     Projets, personnes, catégories et volets génériques partagent ce code ; chaque volet
     reçoit un identifiant unique (plusieurs volets par page possibles).

   NOUVEL ONGLET : dans n'importe quel JSON, un élément qui a un
   "lien" peut ajouter  "nouvelOnglet": true  pour que ce lien
   s'ouvre dans un nouvel onglet (target="_blank").
     - réseaux sociaux : nouvel onglet par défaut ; mettre
       "nouvelOnglet": false pour l'empêcher.

   Liens personnes <-> contenus :
     - projets, articles et actualités : le CONTENU porte la liste
                 des personnes ("personnes": ["id-personne", ...]),
                 ex. dans projets.json pour l'équipe d'un projet.
   ========================================================= */

(function () {
  "use strict";

  const DOSSIER_DATA = "data/";
  const DOSSIER_CONTENUS = "contenus/";   // défaut quand aucun sous-dossier n'est précisé

  /* ---------------------------------------------------------
     Utilitaires
     --------------------------------------------------------- */

  // Échappe le texte pour éviter toute injection HTML
  function esc(valeur) {
    return String(valeur ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ---------------------------------------------------------
     SITE MULTILINGUE
     ---------------------------------------------------------
     navigation.json, "site" :
       "langue": "fr"                langue principale
       "langues": ["fr", "en", "es"] langues du site, dans l'ordre du
                                     sélecteur « FR | EN | ES »
       "titres": { "en": "…" }       titre du site traduit
       "textes": { "en": { "Afficher plus": "Show more", … } }
                                     textes génériques du site traduits
                                     (clé : texte français d'origine)
     Pages rangées par langue : fr/a-propos/…, en/about/…
     Langue de la page affichée : <meta name="isci-langue">, sinon
     premier dossier de son chemin, sinon la langue principale.

     Chaque élément peut porter "langue" (sa langue d'origine) et
     "traductions": { "en": { champs traduits… } } : les données sont
     lues dans la langue de la page (charger()). Actualités et
     évènements ne sont affichés que dans leur langue ; une page créée
     n'existe que dans la sienne. Le sélecteur de langue (navigation
     supérieure) ne montre que les langues où la page existe
     (<link rel="alternate" hreflang="…"> écrits par le gestionnaire).
     --------------------------------------------------------- */
  let LANGUE = "fr";              // langue de la page affichée
  let LANGUE_PRINCIPALE = "fr";
  let LANGUES = [];               // langues du site (vide : site non multilingue)
  let TEXTES = {};                // textes génériques traduits (langue de la page)

  // Texte générique dans la langue de la page (texte français par défaut)
  const t = (texte) => (TEXTES && TEXTES[texte]) || texte;

  // Chemin de la page depuis la racine du site (ex. "en/about/x.html")
  function cheminDepuisRacine() {
    try {
      const racine = new URL(".", document.baseURI).href.replace(/[^/]*$/, "");
      const ici = location.href.split(/[?#]/)[0];
      return ici.startsWith(racine) ? decodeURI(ici.slice(racine.length)) : "";
    } catch (e) { return ""; }
  }

  let languePrete = null;
  function determinerLangue() {
    if (!languePrete) {
      if (EXPORT) DEPENDANCES.add("structure/navigation");
      languePrete = chargerBrut("structure/navigation").then((nav) => {
        const site = (nav && nav.site) || {};
        LANGUES = Array.isArray(site.langues) && site.langue ? site.langues.filter(Boolean) : [];
        LANGUE_PRINCIPALE = site.langue || "fr";
        const meta = document.querySelector('meta[name="isci-langue"]');
        const dossier = cheminDepuisRacine().split("/")[0];
        LANGUE = (meta && meta.content) || (LANGUES.includes(dossier) ? dossier : "") || LANGUE_PRINCIPALE;
        TEXTES = (site.textes && site.textes[LANGUE]) || {};
        if (LANGUES.length && document.documentElement.lang !== LANGUE) document.documentElement.lang = LANGUE;
      }).catch(() => {});
    }
    return languePrete;
  }

  // Racine du site (index.html non rangé dans une langue) : vers l'accueil
  // dans la langue du visiteur si elle est gérée, sinon la langue principale
  async function redirigerRacine() {
    if (!LANGUES.length || window.parent !== window) return false;
    if (document.querySelector('meta[name="isci-langue"]')) return false;
    const chemin = cheminDepuisRacine();
    if (chemin && chemin !== "index.html") return false;
    // Langues qui ont un accueil
    let avecAccueil = [LANGUE_PRINCIPALE];
    try {
      const accueil = await chargerBrut("structure/accueil");
      avecAccueil = [LANGUE_PRINCIPALE, ...Object.keys((accueil && accueil.traductions) || {})].filter((l) => LANGUES.includes(l));
    } catch (e) { /* accueil illisible : langue principale */ }
    const voulues = (navigator.languages || [navigator.language || ""]).map((l) => String(l).slice(0, 2).toLowerCase());
    const langue = voulues.find((l) => avecAccueil.includes(l)) || LANGUE_PRINCIPALE;
    location.replace(new URL(`${langue}/index.html`, document.baseURI).href);
    return true;
  }

  // Élément lu dans la langue de la page : champs traduits fusionnés
  // (l'identifiant ne change jamais)
  function localiserElement(o) {
    if (!o || typeof o !== "object" || Array.isArray(o)) return o;
    const { traductions, ...reste } = o;
    const tr = traductions && traductions[LANGUE];
    if (!tr || typeof tr !== "object") return reste;
    const { id, slug, ...champs } = tr;
    Object.keys(champs).forEach((k) => { if (champs[k] === "" || champs[k] === undefined) delete champs[k]; });
    return { ...reste, ...champs };
  }
  const langueDe = (o) => (o && o.langue) || LANGUE_PRINCIPALE;
  // Actualités, évènements : une seule version par élément (les versions
  // d'une même page partagent "groupe") : celle de la langue de la page,
  // sinon la langue principale, puis les autres langues du site dans
  // l'ordre ; un élément sans traduction s'affiche dans sa langue
  // d'origine. _versions : ids de toutes ses versions (références par id).
  function uneVersionParElement(liste) {
    const ordre = [LANGUE, LANGUE_PRINCIPALE, ...LANGUES].filter((l, i, a) => l && a.indexOf(l) === i);
    const rang = (o) => {
      if (o && o.traductions && o.traductions[LANGUE]) return 0;
      const i = ordre.indexOf(langueDe(o));
      return i < 0 ? ordre.length : i;
    };
    const groupes = new Map();
    liste.forEach((o, i) => {
      const cle = o && o.groupe ? "g:" + o.groupe : "i:" + i;
      if (!groupes.has(cle)) groupes.set(cle, []);
      groupes.get(cle).push(o);
    });
    const choix = new Map();
    groupes.forEach((g) => {
      // version publiée de préférence
      const tri = [...g].sort((a, b) => (publie(b) - publie(a)) || rang(a) - rang(b));
      choix.set(tri[0], g.length > 1 ? g.map((x) => x && x.id).filter(Boolean) : null);
    });
    return liste.filter((o) => choix.has(o)).map((o) => (choix.get(o) ? { ...o, _versions: choix.get(o) } : o));
  }

  // Rubrique / sous-rubrique : titre et lien de la langue de la page
  // (sans traduction : titre d'origine, sans lien)
  function localiserNav(item) {
    if (!item || typeof item !== "object") return item;
    const { traductions, ...reste } = item;
    if (LANGUE === LANGUE_PRINCIPALE || !LANGUES.length) return reste;
    const tr = (traductions && traductions[LANGUE]) || {};
    // Pas de lien propre à la langue (adresse externe, ancien fichier) : celui de la langue principale
    return { ...reste, titre: tr.titre || reste.titre, lien: tr.lien || reste.lien || "#" };
  }

  function localiser(source, d) {
    if (!LANGUES.length || !d) return d;
    const liste = (x) => (Array.isArray(x) ? x : []);
    switch (source) {
      case "structure/navigation": {
        const site = { ...(d.site || {}) };
        if (site.titres && site.titres[LANGUE]) site.titre = site.titres[LANGUE];
        const reseaux = d.reseauxSociaux ? { ...d.reseauxSociaux } : d.reseauxSociaux;
        if (reseaux && reseaux.titres && reseaux.titres[LANGUE]) reseaux.titre = reseaux.titres[LANGUE];
        return {
          ...d, site, reseauxSociaux: reseaux,
          menu: liste(d.menu).map((r) => ({ ...localiserNav(r), ...(r.sousMenu ? { sousMenu: r.sousMenu.map(localiserNav) } : {}) })),
        };
      }
      case "actualites":
      case "evenements":
        return uneVersionParElement(liste(d)).map(localiserElement);
      case "personnes":
      case "projets":
      case "publications":
        return liste(d).map(localiserElement);
      case "partenaires": {
        const r = { ...d };
        r.categories = liste(d.categories).map(localiserElement);
        return r;
      }
      case "structure/pages-creees":
        return liste(d).filter((o) => langueDe(o) === LANGUE);
      case "structure/accueil": {
        if (LANGUE === LANGUE_PRINCIPALE) { const { traductions, ...r } = d; return r; }
        const tr = (d.traductions && d.traductions[LANGUE]) || {};
        const { traductions, blocs, ...r } = d;
        return { ...r, ...tr, blocs: Array.isArray(tr.blocs) ? tr.blocs : [] };
      }
      case "structure/images":
        return liste(d).map((im) => {
          const tr = im && im.traductions && im.traductions[LANGUE];
          return tr && tr.alt ? { ...im, alt: tr.alt } : im;
        });
      case "structure/documents":
        return { ...d, documents: liste(d.documents).map(localiserElement) };
      default:
        return d;
    }
  }

  // "2026-09-04" -> "4 septembre 2026" (dans la langue de la page)
  function formaterDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return esc(iso);
    return esc(d.toLocaleDateString(LANGUE === "fr" ? "fr-FR" : LANGUE, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }));
  }

  // Nom affiché des pays (les JSON utilisent des identifiants
  // en minuscules sans accent), dans la langue de la page. Pays absent
  // de la liste : première lettre mise en majuscule.
  const NOMS_PAYS = {
    tunisie: "Tunisie",
    maroc: "Maroc",
    algerie: "Algérie",
    egypte: "Égypte",
    liban: "Liban",
    jordanie: "Jordanie",
    france: "France",
  };
  const CODES_PAYS = { tunisie: "TN", maroc: "MA", algerie: "DZ", egypte: "EG", liban: "LB", jordanie: "JO", france: "FR" };

  function nomPays(id) {
    const cle = String(id || "").toLowerCase();
    if (LANGUE !== "fr" && CODES_PAYS[cle] && typeof Intl !== "undefined" && Intl.DisplayNames) {
      try { return new Intl.DisplayNames([LANGUE], { type: "region" }).of(CODES_PAYS[cle]); } catch (e) { /* langue inconnue */ }
    }
    return NOMS_PAYS[cle] || cle.charAt(0).toUpperCase() + cle.slice(1);
  }

  // Tri du plus récent au plus ancien ; sans date : ordre d'origine conservé
  // (évènements : "dateDebut" tient lieu de date)
  const dateDe = (item) => String(item.date || item.dateDebut || "");
  function trierParDate(liste) {
    return liste
      .map((item, ordre) => ({ item, ordre }))
      .sort((a, b) =>
        dateDe(b.item).localeCompare(dateDe(a.item)) || a.ordre - b.ordre
      )
      .map(({ item }) => item);
  }

  const publie = (item) => item && item.publie !== false;

  // data-limit… : nombre d'éléments affichés, ou "tous"
  function limiteDe(valeur, defaut) {
    if (/^(tous|infinity)$/i.test(String(valeur || "").trim())) return Infinity;
    return parseInt(valeur, 10) || defaut;
  }

  /* ---------------------------------------------------------
     Catégories : id (champ "categorie") -> titre de navigation.json
     Toutes les entrées portant un "id" sont prises en compte :
     navigation supérieure, catégories du menu, sous-menus.
     --------------------------------------------------------- */

  const TITRES_CATEGORIES = new Map();
  const categoriesInconnues = new Set();
  let chargementCategories = null;

  function chargerCategories() {
    if (!chargementCategories) {
      chargementCategories = charger("structure/navigation")
        .then((nav) => {
          const ajouter = (el) => {
            if (el && el.id && el.titre) TITRES_CATEGORIES.set(el.id, el.titre);
          };
          (nav.navigationSuperieure || []).forEach(ajouter);
          (nav.menu || []).forEach((cat) => {
            ajouter(cat);
            (cat.sousMenu || []).forEach(ajouter);
          });
        })
        .catch((err) => console.error("[contenus] Catégories : navigation.json illisible :", err));
    }
    return chargementCategories;
  }

  // Titre affiché d'une catégorie ("" si l'id est inconnu, avec avertissement)
  function titreCategorie(id) {
    if (!id) return "";
    if (TITRES_CATEGORIES.has(id)) return TITRES_CATEGORIES.get(id);
    if (!categoriesInconnues.has(id)) {
      categoriesInconnues.add(id);
      console.warn(`[contenus] Catégorie "${id}" introuvable dans data/structure/navigation.json`);
    }
    return "";
  }

  // Attributs à ajouter à un <a> si l'élément demande un nouvel onglet :
  //   cible(item)                          -> lit item.nouvelOnglet
  //   cible(item, "nouvelOnglet", true)      -> nouvel onglet par défaut
  function cible(item, champ = "nouvelOnglet", parDefaut = false) {
    const valeur = item && typeof item[champ] === "boolean" ? item[champ] : parDefaut;
    return valeur ? ' target="_blank" rel="noopener noreferrer"' : "";
  }

  // Encode les espaces / accents des chemins d'images locaux
  function url(chemin) {
    return esc(encodeURI(chemin || ""));
  }

  /* ---------------------------------------------------------
     Gabarits de rendu (un par type de données)
     Signature : (item, index) => chaîne HTML
     --------------------------------------------------------- */

  // Image d'une carte : rien si l'élément n'a pas d'image (la case garde
  // alors un fond bleu marine, classe « sans-image »)
  const imageCarte = (item, classe = "", altDefaut = item.titre) => (item.image
    ? `<img${classe ? ` class="${classe}"` : ""} src="${url(item.image)}" alt="${esc(altDe(item, altDefaut))}" loading="lazy">`
    : "");
  const sansImage = (item) => (item.image ? "" : " sans-image");

  // Liens sans destination (href="#", ex. rubrique du menu sans page) : ils
  // ne mènent nulle part. Sans cela, dans une page d'un sous-dossier (balise
  // <base href="../">), « # » renverrait vers l'accueil. Le clic donne
  // seulement le focus (le panneau des sous-rubriques s'ouvre).
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  // Image introuvable (lien mort) : retirée, la case passe au fond bleu marine
  const CASES_IMAGE = ".news-card, .pt-actu, .publication-image, .pt-article__image, .pt-projet__image, .liste-cat__image, .pj-carte__image";
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (!img || img.tagName !== "IMG") return;
    const boite = img.closest(CASES_IMAGE);
    if (!boite) return;
    boite.classList.add("sans-image");
    img.remove();
  }, true);

  const RENDUS = {

    // --- Dernières actualités (grille news-card) ---
    // Les 2 premières en grand format, les suivantes en petit.
    actualites(item, index) {
      const taille = index < 2 ? "news-card--large" : "news-card--small";
      return `
        <article class="news-card ${taille}${sansImage(item)}">
          ${imageCarte(item, "news-card__image")}
          <div class="news-card__content">
            <div class="news-card__meta">
              <span>${esc(titreCategorie(item.categorie))}</span><span>${formaterDate(item.date)}</span>
            </div>
            <h3 class="news-card__title">${esc(item.titre)}</h3>
            <!--<p class="news-card__description">${esc(item.description)}</p>-->
          </div>
          <a class="news-card__link" href="${esc(item.lien || "#")}"${cible(item)} aria-label="${esc(t("Lire :"))} ${esc(item.titre)}"></a>
        </article>`;
    },

    // --- Ouvrages et publications scientifiques (publication-card) ---
    // Même nombre de cartes sur ordinateur et sur mobile (data-limit)
    publications(item) {
      const classes = "publication-card";
      const auteurs = item.auteurs
        ? `<p class="publication-authors">${esc(item.auteurs)}</p>`
        : "";
      return `
        <article class="${classes}">
          <a href="${esc(item.lien || "#")}"${cible(item)}>
            <div class="publication-image${sansImage(item)}">
              ${imageCarte(item)}
            </div>
            <span class="publication-category">${esc(item.type)}</span>
            <h3>${esc(item.titre)}</h3>
            <!--${auteurs}
            <p class="publication-description">${esc(item.description)}</p>-->
          </a>
        </article>`;
    },
  };

  /* ---------------------------------------------------------
     Articles, projets et actualités d'une personne
     ---------------------------------------------------------
     Chaque groupe correspond à un fichier JSON ; chaque élément
     liste ses personnes dans "personnes": ["id-personne", ...]
     (ex. l'équipe d'un projet dans projets.json).
     Tri du plus récent au plus ancien (sans date : ordre conservé).
     "limite" (optionnel) plafonne le nombre de cartes affichées.
     "initial" + "lot" (optionnel) : "initial" cartes visibles, puis
     « Afficher plus » en révèle "lot" de plus à chaque clic.
     Un groupe vide n'est pas affiché.
     --------------------------------------------------------- */

  const GROUPES_PERSONNE = [
    { source: "publications", titre: "Publications",             carte: carteArticle },
    { source: "projets",      titre: "Projets",              carte: carteProjet },
    // Actualités et évènements réunis dans un même fil, du plus récent au plus ancien
    { source: "actualites",   titre: "Dernières actualités", carte: carteFil, initial: 4, lot: 6,
      sources: ["actualites", "evenements"] },
  ];


  // Élément classé dans l'une des catégories (catégorie principale ou
  // catégories supplémentaires d'une page : "categories")
  const dansCategories = (el, ids) => ids.has(el.categorie) || (Array.isArray(el.categories) && el.categories.some((c) => ids.has(c)));

  // Texte simple (sans **gras**, *italique*, [liens](…), puces, ### …)
  function texteSansFormat(t) {
    return String(t || "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\*\*|__|\*/g, "")
      .replace(/^#+\s*/gm, "")
      .replace(/^\s*[-•]\s+/gm, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  // Résumé d'un élément (cartes, carrousel) : sa description, sinon le
  // premier paragraphe de ses blocs (comme la meta description des pages)
  function resumeDe(item) {
    if (!item) return "";
    const d = Array.isArray(item.description) ? item.description.find((x) => x && String(x).trim()) : item.description;
    if (d && String(d).trim()) return texteSansFormat(d);
    for (const b of Array.isArray(item.blocs) ? item.blocs : []) {
      if (!b || b.publie === false || !b.paragraphes) continue;
      for (const p of Array.isArray(b.paragraphes) ? b.paragraphes : [b.paragraphes]) {
        const x = String(p || "").trim();
        if (x && !x.startsWith("### ")) return texteSansFormat(x);
      }
    }
    return "";
  }

  // Projet : image à gauche, pays, titre, extrait de description
  function carteProjet(item) {
    const pays = (item.pays || []).map((p) => `<span class="pt-tag">${esc(nomPays(p))}</span>`).join("");
    const desc = resumeDe(item);
    return `
      <article class="pt-projet">
        <a class="pt-projet__lien" href="${esc(item.lien || "#")}"${cible(item)}>
          <div class="pt-projet__image${sansImage(item)}">
            ${imageCarte(item)}
          </div>
          <div class="pt-projet__corps">
            ${pays ? `<div class="pt-projet__tags">${pays}</div>` : ""}
            <h4 class="pt-projet__titre">${esc(item.titre)}</h4>
            ${desc ? `<p class="pt-projet__desc">${esc(desc)}</p>` : ""}
            <span class="pt-projet__plus">${esc(t("En savoir plus"))}</span>
          </div>
        </a>
      </article>`;
  }



  // Article : couverture verticale, catégorie · date, titre
  function carteArticle(item) {
    const meta = [item.type ? `<span class="type-publication">${esc(item.type)}</span>` : "", esc(formaterDate(item.date))].filter(Boolean).join(" · ");
    return `
      <article class="pt-article">
        <a class="pt-article__lien" href="${esc(item.lien || "#")}"${cible(item)}>
          <div class="pt-article__image${sansImage(item)}">
            ${imageCarte(item)}
          </div>
          <span class="pt-meta">${meta}</span>
          <h4 class="pt-article__titre">${esc(item.titre)}</h4>
        </a>
      </article>`;
  }


  // Actualité : image plein cadre, dégradé, catégorie · date, titre
  function carteActualite(item) {
    const meta = [titreCategorie(item.categorie), formaterDate(item.date)].filter(Boolean).join(" · ");
    return `
      <article class="pt-actu${sansImage(item)}">
        ${imageCarte(item, "pt-actu__image")}
        <div class="pt-actu__contenu">
          <span class="pt-meta pt-meta--clair">${meta}</span>
          <h4 class="pt-actu__titre">${esc(item.titre)}</h4>
        </div>
        <a class="pt-actu__lien" href="${esc(item.lien || "#")}"${cible(item)} aria-label="${esc(t("Lire :"))} ${esc(item.titre)}"></a>
      </article>`;
  }

  // Évènement : même vignette qu'une actualité (catégorie · date de début ;
  // sans image, fond sombre). Utilisé sur les fiches projet et personne.
  function carteEvenement(item) {
    const dates = item.dateFin && item.dateFin !== item.dateDebut
      ? `${formaterDate(item.dateDebut)} – ${formaterDate(item.dateFin)}`
      : formaterDate(item.dateDebut);
    const meta = [titreCategorie(item.categorie), dates].filter(Boolean).join(" · ");
    return `
      <article class="pt-actu pt-actu--evenement${sansImage(item)}">
        ${imageCarte(item, "pt-actu__image")}
        <div class="pt-actu__contenu">
          <span class="pt-meta pt-meta--clair">${meta}</span>
          <h4 class="pt-actu__titre">${esc(item.titre)}</h4>
        </div>
        ${item.lien && item.lien !== "#" ? `<a class="pt-actu__lien" href="${esc(item.lien)}"${cible(item)} aria-label="${esc(t("Voir :"))} ${esc(item.titre)}"></a>` : ""}
      </article>`;
  }

  // Fil commun actualités + évènements : chaque élément garde sa vignette
  // (un évènement se reconnaît à "dateDebut" sans "date")
  function estEvenement(item) {
    return item.dateDebut !== undefined && item.date === undefined;
  }
  // Évènement d'une page créée dans le gestionnaire ("page") : pas dans le
  // fil, c'est la page qui y figure (comme actualité) si on l'a choisi.
  // Seuls les évènements portent "page" : on ne dépend pas de la date
  // (une page sans date donne un évènement sans "dateDebut", qui n'était
  // alors pas reconnu comme évènement et apparaissait en double)
  function dansFil(item) {
    return !item.page;
  }
  function carteFil(item) {
    return estEvenement(item) ? carteEvenement(item) : carteActualite(item);
  }

  // Aperçu du gestionnaire (édition) : chaque catégorie est affichée, même
  // vide, avec en premier une carte « + Ajouter… » ; chaque carte porte
  // la source et l'id de l'élément (pour le retirer du profil)
  let FICHES_EDITION = false;
  const AJOUT_PERSONNE = { publications: "+ Ajouter une publication", projets: "+ Ajouter un projet", actualites: "+ Ajouter une actualité ou un évènement" };

  const boutonAjout = (source, texte) => `<button type="button" class="pt-ajout" data-ajout-source="${esc(source)}">${esc(texte)}</button>`;
  // Élément de liste (<li>) d'une personne ou d'un partenaire : marqué + bouton retirer
  const liEdition = (html, source, id, titre = "Retirer de ce projet") => html.replace(/^<li>/,
    `<li data-lien-source="${esc(source)}" data-lien-id="${esc(id)}"><button type="button" class="isci-retirer" title="${esc(titre)}">✕ Retirer</button>`);

  function marquerCarte(html, item, source) {
    const retirer = `<button type="button" class="isci-retirer" title="Retirer de ce profil (l'élément lui-même est conservé)">✕ Retirer du profil</button>`;
    return html
      .replace(/<([a-z]+)/i, `<$1 data-lien-source="${esc(item._src || source)}" data-lien-id="${esc(item.id || "")}"`)
      .replace(/<\/([a-z]+)>\s*$/i, `${retirer}</$1>`);
  }

  function grilleTravaux(parSource) {
    if (!parSource && !FICHES_EDITION) return "";
    parSource ||= {};
    const blocs = GROUPES_PERSONNE
      .map((g) => {
        const items = (parSource[g.source] || []).slice(0, g.limite || Infinity);
        if (!items.length && !FICHES_EDITION) return "";
        const cartes = FICHES_EDITION
          ? `<button type="button" class="pt-ajout" data-ajout-source="${esc(g.source)}">${esc(AJOUT_PERSONNE[g.source] || "+ Ajouter")}</button>`
            + items.map((it) => marquerCarte(g.carte(it), it, g.source)).join("")
          : items.map(g.carte).join("");
        return `
          <section class="pt-groupe pt-groupe--${esc(g.source)}">
            <header class="pt-groupe__entete">
              <h3 class="pt-groupe__titre">${esc(t(g.titre))}</h3>
              <span class="pt-groupe__trait"></span>
            </header>
            <div class="pt-grille pt-grille--${esc(g.source)}"${g.lot ? ` data-pagine-pas="${g.lot}" data-pagine-initial="${g.initial || g.lot}"` : ""}>
              ${cartes}
            </div>
          </section>`;
      })
      .join("");
    return blocs ? `<div class="personne__travaux">${blocs}</div>` : "";
  }

  // --- Portrait d'une personne (bloc text-media) ---
  // Titre = nom, image flottante à gauche, "bio" = liste de paragraphes.
  // Sous la bio : articles, projets et dernières actualités liés à la
  // personne, chacun dans sa propre grille (voir GROUPES_PERSONNE).
  // Fiches personne / projet : le contenu de la page est fait de blocs
  // (data-blocs="personne:id"), placés sous le nom ou le titre et au-dessus
  // des équipes, publications, actualités… Anciennes données ("bio",
  // "description" pas encore converties en blocs) : affichage d'avant.
  const ficheEnBlocs = (item, ancien) => !!item && item[ancien] === undefined && Array.isArray(item.blocs);
  const emplacementBlocs = '<div class="fiche__blocs-emplacement" data-emplacement-blocs></div>';
  // Zone des blocs de la page détachée avant de reconstruire la fiche…
  function retenirBlocs(zone, cle) {
    const z = document.querySelector(`[data-blocs="${cle}"]`);
    if (z && zone.contains(z)) z.remove();
    return z;
  }
  // … puis remise dans la fiche (ou après elle : anciennes données)
  function placerBlocs(zone, z) {
    if (!z) return;
    const emp = zone.querySelector("[data-emplacement-blocs]");
    if (emp) { z.classList.add("fiche__blocs"); emp.replaceWith(z); return; }
    if (!z.isConnected) { z.classList.remove("fiche__blocs"); (zone.closest("section") || zone).after(z); }
  }

  function htmlPortrait(item, liens = {}) {
    const idTitre = `personne-${esc(item.id)}-titre`;
    if (ficheEnBlocs(item, "bio")) {
      return `
      <article class="personne personne--blocs" aria-labelledby="${idTitre}">
        <header class="site-section__header">
          <h2 id="${idTitre}" class="site-section__title">${esc(item.nom)}</h2>
          <span class="site-section__line"></span>
        </header>
        ${emplacementBlocs}
        ${grilleTravaux(liens[item.id])}
      </article>`;
    }
    const paragraphes = (Array.isArray(item.bio) ? item.bio : [item.bio])
      .filter(Boolean)
      .map((p) => `<p>${texteEnLigne(p)}</p>`)
      .join("");
    // Avec légende : l'image est dans une <figure> (même mise en page)
    const legende = legendeDe(item);
    const photo = item.image ? `<img src="${url(item.image)}" alt="${esc(altDe(item, item.nom))}" loading="lazy">` : "";
    const image = !item.image ? ""
      : legende ? `<figure class="text-media__image text-media__figure">${photo}${legende}</figure>`
      : photo.replace("<img ", '<img class="text-media__image" ');
    return `
      <article class="personne" aria-labelledby="${idTitre}">
        <header class="site-section__header">
          <h2 id="${idTitre}" class="site-section__title">${esc(item.nom)}</h2>
          <span class="site-section__line"></span>
        </header>
        <div class="text-media">
          ${image}
          ${paragraphes}
        </div>
        ${grilleTravaux(liens[item.id])}
      </article>`;
  }

  // Construit { idPersonne: { source: [éléments triés] } }
  async function chargerLiensPersonnes(personnes) {
    const noms = [...new Set(GROUPES_PERSONNE.flatMap((g) => g.sources || [g.source]))];
    const idsPers = personnes.map((p) => p.id).join(",");
    const donnees = new Map(await Promise.all(
      noms.map((n) => charger(n, "@personnes:" + idsPers).then((l) => [n, l], (err) => {
        console.warn(`[contenus] data/contenus/${n}.json ignoré pour les portraits :`, err);
        return [n, []];
      }))
    ));

    const liens = {};
    GROUPES_PERSONNE.forEach((g) => {
      const elements = (g.sources || [g.source]).flatMap((n) => (donnees.get(n) || []).map((el) => (FICHES_EDITION ? { ...el, _src: n } : el))).filter((el) => publie(el) && dansFil(el));

      // L'élément porte les ids : "personnes": ["gael-maignan", ...]
      trierParDate(elements.filter((el) => Array.isArray(el.personnes)))
        .forEach((el) => {
          new Set(el.personnes).forEach((id) => {
            ((liens[id] ||= {})[g.source] ||= []).push(el);
          });
        });
    });
    return liens;
  }

  /* ---------------------------------------------------------
     Navigation (header + footer) depuis structure/navigation.json
     ---------------------------------------------------------
     Chaque catégorie de "menu" peut avoir :
       titre, lien          libellé et page de la catégorie
       sousMenu             [{ titre, lien }, ...]  (une colonne)
       sousMenuAuto         { source, grouperPar: "pays" }
                            sous-menu généré depuis un fichier de
                            contenus (une colonne par pays)
       bouton: true         affichée comme bouton (ex. Agenda)
       mobile: false        masquée sur mobile
       footer: false        exclue du footer
     --------------------------------------------------------- */

  // Sur ordinateur, au-delà de MAX_COLONNES_MENU pays, les colonnes
  // passent sur plusieurs lignes équilibrées (ex. 5 pays -> 3 + 2,
  // 7 pays -> 4 + 3) plutôt que de laisser un pays seul en bas.
  const MAX_COLONNES_MENU = 4;

  const lienHTML = (l, classe = "") =>
    `<a${classe ? ` class="${classe}"` : ""} href="${esc(l.lien || "#")}"${cible(l)}>${esc(l.titre)}</a>`;

  // Regroupe des éléments par pays (un élément multi-pays va dans
  // chaque colonne concernée ; pays dans l'ordre d'apparition).
  function grouperParPays(elements) {
    const parPays = new Map();
    elements.forEach((el) => {
      (el.pays && el.pays.length ? el.pays : ["autres"]).forEach((p) => {
        const cle = String(p).toLowerCase();
        if (!parPays.has(cle)) parPays.set(cle, []);
        parPays.get(cle).push(el);
      });
    });
    return [...parPays].map(([pays, liens]) => ({ titre: nomPays(pays), liens }));
  }

  // Résout le sous-menu d'une catégorie en colonnes : [{ titre?, liens }]
  async function colonnesCategorie(cat) {
    if (cat.sousMenuAuto) {
      const { source, grouperPar } = cat.sousMenuAuto;
      const elements = (await charger(source, CHAMPS_LIEN)).filter(publie);
      return grouperPar === "pays" ? grouperParPays(elements) : [{ liens: elements }];
    }
    if (Array.isArray(cat.sousMenu) && cat.sousMenu.length) {
      return [{ liens: cat.sousMenu }];
    }
    return [];
  }

  function htmlMegaMenu(cat, colonnes) {
    const parPays = !!(cat.sousMenuAuto && cat.sousMenuAuto.grouperPar === "pays");
    const nbLignes = Math.max(1, Math.ceil(colonnes.length / MAX_COLONNES_MENU));
    const parLigne = Math.max(1, Math.ceil(colonnes.length / nbLignes));

    // Lien vers la page de la catégorie, visible sur mobile uniquement
    // (sur mobile, toucher le titre ouvre/ferme le sous-menu).
    const rubrique = cat.lien && cat.lien !== "#"
      ? `<a class="mega-rubrique" href="${esc(cat.lien)}"${cible(cat)}>${esc(t("Tout voir :"))} ${esc(cat.titre)}</a>`
      : "";

    const cols = colonnes.map((col, i) => `
          <div class="mega-column${parPays && i % parLigne === 0 ? " mega-column--debut" : ""}">
            ${col.titre ? `<h3 class="mega-title">${esc(col.titre)}</h3>` : ""}
            ${col.liens.map((l) => (parPays || !l.id ? lienHTML(l) : lienHTML(l).replace("<a", `<a data-nav-sous="${esc(l.id)}"`))).join("")}
          </div>`).join("");

    return `
        <div class="mega-menu${parPays ? " mega-menu--pays" : ""}" data-nav-rubrique="${esc(cat.id || "")}" aria-label="${esc(t("Sous-menu"))} ${esc(cat.titre)}"${parPays ? ` style="--nb-colonnes:${parLigne}"` : ""}>
          ${rubrique}${cols}
        </div>`;
  }

  function htmlCategorieMenu(cat, colonnes) {
    if (cat.bouton) {
      return `<a href="${esc(cat.lien || "#")}"${cible(cat)} data-nav-id="${esc(cat.id || "")}" class="donate${cat.mobile === false ? " no-mobile" : ""}${cat.publie === false ? " nav--masque" : ""}">${esc(cat.titre)}</a>`;
    }
    return `
      <div class="nav-item${cat.mobile === false ? " no-mobile" : ""}${cat.publie === false ? " nav--masque" : ""}" data-nav-id="${esc(cat.id || "")}">
        <a href="${esc(cat.lien || "#")}"${cible(cat)} class="nav-link">${esc(cat.titre)}</a>
        ${colonnes.length ? htmlMegaMenu(cat, colonnes) : ""}
      </div>`;
  }

  // Colonne de footer : titre de catégorie + tous ses liens (dédoublonnés)
  function htmlColonneFooter(cat, colonnes) {
    const vus = new Set();
    const liens = colonnes.flatMap((c) => c.liens).filter((l) => {
      const cle = l.id || `${l.titre}|${l.lien}`;
      if (vus.has(cle)) return false;
      vus.add(cle);
      return true;
    });
    const titre = cat.lien && cat.lien !== "#" ? lienHTML(cat) : esc(cat.titre);
    return `
            <div class="footer-column">
                <h3>${titre}</h3>
                <ul>${liens.map((l) => `<li>${lienHTML(l)}</li>`).join("")}</ul>
            </div>`;
  }

  // Colonne "réseaux sociaux" du footer
  function htmlColonneReseaux(reseaux) {
    const liens = (reseaux && Array.isArray(reseaux.liens) ? reseaux.liens : []).filter(publie);
    if (!liens.length) return "";
    return `
            <div class="footer-column media-column">
                ${reseaux.titre ? `<h3>${esc(reseaux.titre)}</h3>` : ""}
                <div class="social-links">
                  ${liens.map((r) => `
                  <a href="${esc(r.lien || "#")}" aria-label="${esc(r.nom)}"${cible(r, "nouvelOnglet", true)}>
                    <img src="${url(r.icone)}" alt="${esc(r.nom)}">
                  </a>`).join("")}
                </div>
            </div>`;
  }

  // options.edition : aperçu du gestionnaire (rubriques masquées affichées)
  // Logos de l'en-tête (navigation.json, "logos") : le premier est le logo
  // principal (à gauche), les suivants sont en haut à droite
  function htmlLogos(logos) {
    const logo = (l, i) => {
      const img = l.image ? `<img class="institution-logo" src="${url(l.image)}" alt="${esc(l.alt || "")}">` : "";
      const classe = `institution institution-${i + 1}`;
      // Logo principal sans lien choisi : retour à l'accueil
      if (i === 0 && (!l.lien || l.lien === "#")) return `<a class="${classe}" href="${LANGUES.length ? `${esc(LANGUE)}/index.html` : "index.html"}" title="${esc(t("Accueil"))}">${img}</a>`;
      return l.lien && l.lien !== "#"
        ? `<a class="${classe}" href="${esc(l.lien)}"${l.nouvelOnglet ? ' target="_blank" rel="noopener"' : ""}>${img}</a>`
        : `<span class="${classe}">${img}</span>`;
    };
    const [principal, ...autres] = logos;
    return (principal ? logo(principal, 0) : "") + `<div class="institutions-secondary">${autres.map((l, i) => logo(l, i + 1)).join("")}</div>`;
  }

  // Logos d'origine, utilisés tant que la Structure du site n'en définit pas
  const LOGOS_DEFAUT = [
    { image: "images/logo.png", alt: "ISCI-MENA", lien: "index.html" },
    { image: "https://isci-mena.univ-gustave-eiffel.fr/fileadmin/satellite/_img/logo_univ_gustave_eiffel_3lignes_rvb.svg", alt: "Université Gustave Eiffel", lien: "https://www.univ-gustave-eiffel.fr/", nouvelOnglet: true },
    { image: "images/eivp2.png", alt: "EIVP", lien: "https://www.eivp-paris.fr/", nouvelOnglet: true },
    { image: "images/UN-Habitat.png", alt: "ONU-Habitat", lien: "https://unhabitat.org/", nouvelOnglet: true },
  ];

  /* Anti-chevauchement de l'en-tête : si le menu principal (ou la navigation
     supérieure) ne tient plus à droite des logos, on resserre d'abord, puis on
     passe le menu sur sa propre ligne. Recalculé à chaque redimensionnement. */
  function largeurEnfants(el) {
    return [...el.children].reduce((somme, e) => {
      const st = getComputedStyle(e);
      return somme + e.getBoundingClientRect().width + parseFloat(st.marginLeft) + parseFloat(st.marginRight);
    }, 0);
  }

  function ajusterHeader() {
    const header = document.querySelector(".header");
    const nav = header && header.querySelector(".main-nav");
    if (!nav) return;
    header.classList.remove("header--serre", "header--deux-lignes");
    if (window.matchMedia("(max-width: 850px)").matches) return;
    const sup = header.querySelector(".top-nav");
    const deborde = () =>
      largeurEnfants(nav) > nav.clientWidth + 1 ||
      (sup && sup.offsetParent && largeurEnfants(sup) > sup.clientWidth + 1);
    if (!deborde()) return;
    header.classList.add("header--serre");
    if (!deborde()) return;
    // Sur deux lignes, le menu retrouve sa taille normale s'il tient
    header.classList.remove("header--serre");
    header.classList.add("header--deux-lignes");
    if (deborde()) header.classList.add("header--serre");
  }

  let headerSurveille = false;
  function surveillerHeader() {
    ajusterHeader();
    if (headerSurveille) return;
    headerSurveille = true;
    let attente = 0;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(attente);
      attente = requestAnimationFrame(ajusterHeader);
    });
    // Polices et logos chargés après coup : nouvelle mesure
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajusterHeader);
    window.addEventListener("load", ajusterHeader);

    // Passage d'une rubrique à une autre : le panneau des sous-rubriques
    // reste affiché et change de contenu sans fondu (pas de clignotement).
    // Le fondu est conservé à l'ouverture et à la fermeture du panneau.
    const header = document.querySelector(".header");
    if (!header) return;
    let fin = 0;
    header.addEventListener("mouseover", (e) => {
      const item = e.target.closest(".main-nav .nav-item");
      const depuis = e.relatedTarget;
      if (!item || !depuis || item.contains(depuis) || !depuis.closest(".main-nav")) return;
      if (![...header.querySelectorAll(".nav-item.is-open")].some((autre) => autre !== item)) return;
      header.classList.add("header--bascule-menu");
      cancelAnimationFrame(fin);
      fin = requestAnimationFrame(() => {
        fin = requestAnimationFrame(() => header.classList.remove("header--bascule-menu"));
      });
    });
  }

  // Identité du site (navigation.json, "site" : titre, logo) : icône de
  // l'onglet et titre « Page - Titre du site ». Les pages générées les ont
  // déjà dans leur <head> ; ceci couvre index.html et les changements pas
  // encore répercutés.
  function appliquerIdentite(site) {
    if (!site || typeof site !== "object") return;
    if (site.logo) {
      let icone = document.querySelector('link[rel~="icon"]');
      if (!icone) {
        icone = document.createElement("link");
        icone.rel = "icon";
        document.head.append(icone);
      }
      const href = new URL(encodeURI(site.logo), document.baseURI).href;
      if (icone.href !== href) icone.href = href;
    }
    if (site.titre) {
      const meta = document.querySelector('meta[name="isci-page-generee"]');
      const og = document.querySelector('meta[property="og:title"]');
      const titrePage = meta && og ? og.getAttribute("content") : "";
      // Accueil (titre écrit dans index.html par le gestionnaire) et pages
      // écrites à la main : leur titre est gardé
      if (titrePage) document.title = `${titrePage} - ${site.titre}`;
    }
  }

  // Versions de la page dans les autres langues : <link rel="alternate" hreflang>
  function versionsPage() {
    const v = {};
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((l) => { v[l.getAttribute("hreflang")] = l.getAttribute("href"); });
    return v;
  }
  // Page affichée dans l'aperçu du gestionnaire
  // Bloc sans rien à afficher (liens vides, média introuvable) : retiré de
  // la page publiée, pour que les blocs voisins s'enchaînent normalement
  // (écarts entre blocs) ; dans le gestionnaire, seulement masqué
  function masquerBlocVide(section, vide) {
    if (!section) return;
    section.hidden = vide;
    const bloc = section.closest(".bloc");
    if (vide && bloc && !dansGestionnaire()) bloc.remove();
  }

  /* ---------- Site statique ----------
     ?export=1 : page ouverte par le gestionnaire pour l'export statique
     (construite comme sur le site, sans les outils du gestionnaire ni les
     comportements des scripts de la page, puis enregistrée telle quelle).
     <html data-statique> : page exportée ; tout est déjà dans le HTML :
     rien n'est reconstruit, seuls les comportements sont branchés (menu,
     carrousel, onglets, « Afficher plus », filtres, lecteur PDF…). */
  const EXPORT = /[?&]export=1\b/.test(location.search);
  const STATIQUE = document.documentElement.hasAttribute("data-statique");
  // Export : données lues par la page (le gestionnaire ne reconstruit
  // ensuite la page que si l'une d'elles a changé). « source#id » : une
  // seule entrée du fichier (la page créée elle-même)
  const DEPENDANCES = new Set();
  if (EXPORT) window.__isciDependances = DEPENDANCES;

  function dansGestionnaire() {
    if (EXPORT || STATIQUE) return false;
    try { return window.parent !== window && typeof window.parent.__isciDonneesApercu === "function"; } catch (e) { return false; }
  }
  function htmlLangues(edition = false) {
    const versions = versionsPage();
    return LANGUES.map((code) => {
      const libelle = esc(code.toUpperCase());
      if (code === LANGUE) return `<a href="#" class="langue is-active" aria-current="true" lang="${esc(code)}" data-langue="${esc(code)}">${libelle}</a>`;
      if (versions[code]) return `<a href="${esc(versions[code])}" class="langue" hreflang="${esc(code)}" lang="${esc(code)}" data-langue="${esc(code)}">${libelle}</a>`;
      // Page pas encore traduite : visible seulement dans l'éditeur (pour la traduire)
      return edition ? `<a href="#" class="langue langue--absente" data-langue="${esc(code)}" data-langue-absente="1" title="Page pas encore traduite">${libelle}</a>` : "";
    }).filter(Boolean).join("");
  }

  async function construireNavigation(options = {}) {
    const zSup = document.querySelector('[data-nav="superieure"]');
    const zMenu = document.querySelector('[data-nav="principale"]');
    const zFooter = document.querySelector('[data-nav="footer"]');
    if (!zSup && !zMenu && !zFooter) return;

    try {
      const nav = await charger("structure/navigation");
      const menu = (nav.menu || []).filter((cat) => options.edition || publie(cat));

      const colonnes = await Promise.all(menu.map((cat) =>
        colonnesCategorie(cat).catch((err) => {
          console.error(`[contenus] Sous-menu "${cat.titre}" :`, err);
          return [];
        })
      ));

      // Navigation supérieure (liens de la Structure du site) ; zone recréée
      // dans les pages générées pendant qu'elle était supprimée
      let zoneSup = zSup;
      const contenuHeader = document.querySelector(".header .header-content");
      if (!zoneSup && contenuHeader) {
        zoneSup = document.createElement("nav");
        zoneSup.className = "top-nav";
        zoneSup.setAttribute("aria-label", "Navigation supérieure");
        zoneSup.dataset.nav = "superieure";
        contenuHeader.prepend(zoneSup);
      }
      if (zoneSup) {
        // Site multilingue : sélecteur de langue « FR | EN » (langues où la
        // page existe ; toutes dans l'éditeur du gestionnaire, pour traduire)
        zoneSup.innerHTML = LANGUES.length ? htmlLangues(options.edition || dansGestionnaire())
          : (nav.navigationSuperieure || []).filter(publie).map((l) => lienHTML(l)).join("");
        if (LANGUES.length) zoneSup.setAttribute("aria-label", t("Langue"));
        zoneSup.classList.toggle("top-nav--langues", !!LANGUES.length);   // sélecteur de langue (visible aussi sur mobile)
        const header = zoneSup.closest(".header");
        if (header) header.classList.toggle("header--langues", !!LANGUES.length);
      }

      // Logos de l'en-tête définis dans la Structure du site
      const zLogos = document.querySelector(".header .institutions");
      if (zLogos) zLogos.innerHTML = htmlLogos((Array.isArray(nav.logos) ? nav.logos : LOGOS_DEFAUT).filter(publie));
      if (zLogos) zLogos.dataset.logosPrets = "1";
      appliquerIdentite(nav.site);

      if (zMenu) {
        zMenu.innerHTML = menu.map((cat, i) => htmlCategorieMenu(cat, colonnes[i])).join("");
      }

      if (zFooter) {
        const cols = menu
          .map((cat, i) => ({ cat, cols: colonnes[i] }))
          .filter(({ cat, cols }) => !cat.bouton && cat.footer !== false && cols.length);
        const reseaux = htmlColonneReseaux(nav.reseauxSociaux);
        zFooter.innerHTML = cols.map(({ cat, cols }) => htmlColonneFooter(cat, cols)).join("") + reseaux;
        zFooter.style.setProperty("--nb-colonnes-footer", cols.length + (reseaux ? 1 : 0));
      }

      if (!EXPORT) {
        surveillerHeader();
        document.dispatchEvent(new CustomEvent("navigation:prete"));
      }
    } catch (err) {
      console.error("[contenus] Impossible de charger data/structure/navigation.json :", err);
      // Logos d'origine
      const zLogos = document.querySelector(".header .institutions");
      if (zLogos) {
        if (!zLogos.children.length) zLogos.innerHTML = htmlLogos(LOGOS_DEFAUT);
        zLogos.dataset.logosPrets = "1";
      }
      surveillerHeader();
    }
  }

  /* ---------------------------------------------------------
     Carrousel de la page d'accueil (structure/accueil.json)
     ---------------------------------------------------------
     "carrousel": {
       "elements": ["id", ...],       ordre d'affichage ; chaque id
                                      est cherché dans actualites,
                                      publications puis projets
       "delai": 6000,                 ms entre 2 diapositives
       "texteBouton": "En savoir plus"
     }
     En cas d'id identique dans deux fichiers, préciser la source :
       { "source": "projets", "id": "jdid" }
     Liste vide ou absente : les 3 actualités les plus récentes.

     Contenu d'une diapositive selon le type :
       actualité / publication : surtitre = titre de la catégorie
       projet                  : surtitre = "Projet · <pays>"
       texte = description (1er paragraphe si c'est une liste)
     --------------------------------------------------------- */

  const SOURCES_CARROUSEL = ["actualites", "evenements", "publications", "projets"];

  function surtitreCarrousel(el, source) {
    if (source === "projets") {
      const pays = (el.pays || []).map(nomPays).join(", ");
      return pays ? `${t("Projet")} · ${pays}` : t("Projet");
    }
    return titreCategorie(el.categorie);
  }

  async function construireCarrousel(hero = document.querySelector("[data-carrousel]")) {
    if (!hero) return;

    try {
      const [accueil, ...listes] = await Promise.all([
        charger("structure/accueil"),
        ...SOURCES_CARROUSEL.map((src) => charger(src, false).catch((err) => {
          console.warn(`[contenus] Carrousel : data/contenus/${src}.json ignoré :`, err);
          return [];
        })),
        chargerCategories(),
      ]);
      const reglages = accueil.carrousel || {};

      // index : source -> Map(id -> élément)
      const index = {};
      SOURCES_CARROUSEL.forEach((src, i) => {
        // (toutes les versions d'un élément mènent à la version affichée)
        index[src] = new Map(listes[i].filter(publie).flatMap((el) => [el.id, ...(el._versions || [])].map((id) => [id, el])));
      });

      function trouver(ref) {
        const id = typeof ref === "string" ? ref : ref && ref.id;
        const sources = ref && ref.source ? [ref.source] : SOURCES_CARROUSEL;
        for (const src of sources) {
          if (index[src] && index[src].has(id)) return { el: index[src].get(id), source: src };
        }
        console.warn(`[contenus] Carrousel : "${id}" introuvable dans ${sources.join(", ")}`);
        return null;
      }

      // "elements" (ou l'ancien nom "actualites")
      const refs = reglages.elements || reglages.actualites;
      let slides;
      if (Array.isArray(refs) && refs.length) {
        const idsRefs = refs.map((r) => (typeof r === "string" ? r : r && r.id)).filter(Boolean).join(",");
        SOURCES_CARROUSEL.forEach((src) => dependre(src, "#" + idsRefs));
        slides = refs.map(trouver).filter(Boolean);
      } else {
        dependre("actualites");
        slides = trierParDate([...index.actualites.values()]).slice(0, 3)
          .map((el) => ({ el, source: "actualites" }));
      }
      if (!slides.length) return;

      const texteBouton = t(reglages.texteBouton || "En savoir plus");
      const points = hero.querySelector(".hero-dots");

      slides.forEach(({ el: a, source }, i) => {
        const surtitre = surtitreCarrousel(a, source);
        const description = resumeDe(a);

        const el = document.createElement("div");
        el.className = `hero-slide hero-slide--${source}`;
        // Adresse absolue : dans une variable CSS, url() serait résolue par
        // rapport à css/style.css (où la variable est utilisée), et non par
        // rapport à la page -> "images/x.jpg" deviendrait "css/images/x.jpg".
        if (a.image) {
          el.dataset.image = a.image;   // (site statique : adresse recalculée chez le visiteur)
          el.style.setProperty("--slide-image", `url("${new URL(encodeURI(a.image), document.baseURI).href}")`);
        }
        el.setAttribute("role", "group");
        el.setAttribute("aria-roledescription", "slide");
        el.setAttribute("aria-label", `${i + 1} sur ${slides.length}`);
        el.innerHTML = `
          <div class="hero-slide-content">
            ${surtitre ? `<span class="hero-eyebrow">${esc(surtitre)}</span>` : ""}
            <h2 class="hero-title">${esc(a.titre)}</h2>
            ${description ? `<p class="hero-description">${esc(description)}</p>` : ""}
            <a class="hero-link" href="${esc(a.lien || "#")}"${cible(a)}>${esc(texteBouton)}</a>
          </div>`;
        hero.insertBefore(el, points);

        const point = document.createElement("button");
        point.type = "button";
        point.className = "hero-dot";
        point.setAttribute("role", "tab");
        point.setAttribute("aria-label", `${t("Aller à la diapositive")} ${i + 1}`);
        points.appendChild(point);
      });

      hero.dataset.delai = String(Number(reglages.delai) || 6000);   // (site statique : même délai)
      if (!EXPORT) document.dispatchEvent(new CustomEvent("carrousel:pret", {
        detail: { delai: Number(reglages.delai) || 6000 },
      }));
    } catch (err) {
      console.error("[contenus] Carrousel : impossible de charger les données :", err);
    }
  }

  /* ---------------------------------------------------------
     DOCUMENTS PDF (bloc « Documents »)
     ---------------------------------------------------------
     data/structure/documents.json :
       { "relais": "https://…/", "documents": [{ "id", "titre", "date", "drive" }] }
     id : identifiant du fichier Google Drive ; le PDF est servi par le
     relais (relais + id ; « ?download=1 » pour le télécharger).
     « Consulter » ouvre une fenêtre de lecture (PDF.js : tous les
     navigateurs, y compris mobiles) : zoom (boutons, Ctrl + molette,
     pincement), texte sélectionnable, téléchargement.
     --------------------------------------------------------- */

  const RELAIS_PDF_DEFAUT = "https://pdf.gael-maignan.workers.dev/";
  const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";

  // Relais (worker) des médias : Paramètres du site (navigation.json,
  // site.relais), sans « /pdf » ni « /stream ». PDF : relais/pdf/ID ;
  // son ou vidéo : relais/stream/ID. Anciennes données : relais des PDF
  // de documents.json (relais + ID).
  async function donneesDocuments() {
    const [d, nav] = await Promise.all([
      charger("structure/documents").catch(() => null),
      charger("structure/navigation").catch(() => null),
    ]);
    const nettoyer = (r) => String(r || "").trim().replace(/\/+$/, "").replace(/\/(pdf|stream)$/i, "");
    const relais = nettoyer(nav && nav.site && nav.site.relais);
    const ancien = String((d && d.relais) || RELAIS_PDF_DEFAUT).replace(/\/?$/, "/");
    const base = relais || nettoyer(ancien);
    const liste = (d && Array.isArray(d.documents) ? d.documents : []).filter(publie);
    return {
      liste,
      videos: (d && Array.isArray(d.videos) ? d.videos : []).filter(publie),
      sons: (d && Array.isArray(d.sons) ? d.sons : []).filter(publie),
      url: (doc) => (relais ? `${relais}/pdf/${encodeURIComponent(doc.id)}` : ancien + encodeURIComponent(doc.id)),
      flux: (m) => `${base}/stream/${encodeURIComponent(m.id)}`,
    };
  }

  /* ---------------------------------------------------------
     VIDÉO et SON (blocs « Vidéo » et « Son »)
     ---------------------------------------------------------
     Fichier Google Drive du gestionnaire des médias (documents.json,
     "videos" / "sons"), lu par le relais (relais/stream/ID) : lecteur du
     navigateur (lecture, avance et retour rapides, plein écran).
     --------------------------------------------------------- */
  async function construireMedia(zone) {
    const cat = zone.dataset.media === "sons" ? "sons" : "videos";
    const id = zone.dataset.mediaId || "";
    const edition = zone.dataset.edition === "1";
    const vide = (texte) => `<div class="isci-media-vide" style="display:grid;place-items:center;min-height:${cat === "videos" ? 220 : 90}px;background:#eef0f6;color:#6b6f85;font:600 14px/1.4 Roboto,Arial,sans-serif;text-align:center;padding:20px;border-radius:6px;cursor:pointer">${texte}</div>`;
    try {
      const donnees = await donneesDocuments();
      const m = id ? donnees[cat].find((x) => x.id === id) : null;
      const section = zone.closest("section");
      if (!m) {
        if (edition) zone.innerHTML = vide(cat === "videos" ? "Cliquer pour choisir une vidéo" : "Cliquer pour choisir un son");
        else masquerBlocVide(section, true);   // rien à lire : bloc absent du site
        zone.setAttribute("aria-busy", "false");
        return;
      }
      if (section) section.hidden = false;
      const src = donnees.flux(m);
      const titre = zone.dataset.titre || m.titre || "";
      if (cat === "videos") {
        const affiche = zone.dataset.affiche ? ` poster="${esc(zone.dataset.affiche)}"` : "";
        zone.innerHTML = `<video class="bloc-video__lecteur" controls preload="metadata" playsinline${affiche} src="${esc(src)}"${titre ? ` aria-label="${esc(titre)}"` : ""}>
            <a href="${esc(src)}">${esc(titre || t("Vidéo"))}</a>
          </video>`;
      } else {
        zone.innerHTML = `<div class="bloc-son__carte">
            <span class="bloc-son__icone" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></span>
            <div class="bloc-son__corps">
              ${titre ? `<p class="bloc-son__titre">${esc(titre)}</p>` : ""}
              <audio class="bloc-son__lecteur" controls preload="metadata" src="${esc(src)}"${titre ? ` aria-label="${esc(titre)}"` : ""}></audio>
              ${zone.dataset.telechargement === "1" ? `<a class="bloc-son__telecharger" href="${esc(urlTelechargement(src))}" download>${esc(t("Télécharger"))}</a>` : ""}
            </div>
          </div>`;
      }
      zone.setAttribute("aria-busy", "false");
    } catch (err) {
      console.error("[contenus] Média :", err);
    }
  }

  const urlTelechargement = (u) => u + (u.includes("?") ? "&" : "?") + "download=1";

  async function construireDocuments(zone) {
    const ids = String(zone.dataset.documents || "").split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const { liste, url } = await donneesDocuments();
      const parId = new Map(liste.map((d) => [d.id, d]));
      const docs = ids.map((id) => parId.get(id)).filter(Boolean);
      zone.innerHTML = docs.length ? docs.map((d) => `
        <li class="document">
          <span class="document__icone" aria-hidden="true">PDF</span>
          <span class="document__texte">
            <span class="document__titre">${esc(d.titre || t("Document"))}</span>
            ${d.date ? `<time class="document__date" datetime="${esc(d.date)}">${formaterDate(d.date)}</time>` : ""}
          </span>
          <span class="document__actions">
            <button type="button" class="document__btn document__btn--lire" data-pdf="${esc(url(d))}" data-titre="${esc(d.titre || t("Document"))}">${esc(t("Consulter"))}</button>
            <a class="document__btn" href="${esc(urlTelechargement(url(d)))}" download>${esc(t("Télécharger"))}</a>
          </span>
        </li>`).join("") : `<li class="documents__vide">${esc(t("Aucun document pour le moment."))}</li>`;
      zone.setAttribute("aria-busy", "false");
    } catch (err) {
      console.error("[contenus] Documents :", err);
    }
  }

  // Un clic sur « Consulter » (dans n'importe quelle page) ouvre la fenêtre de lecture
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-pdf]");
    if (!b) return;
    e.preventDefault();
    LecteurPdf.ouvrir(b.dataset.pdf, b.dataset.titre || b.textContent.trim(), b);
  });

  const LecteurPdf = (() => {
    const ZOOM_MIN = 0.5, ZOOM_MAX = 5, PIXELS_MAX = 16000000;
    let fenetre = null, voile, lecteur, statut, titreEl, telecharger, fermerBtn, zoomBtn;
    let urlCourante = null, docCourant = null, vues = [], largeurBase = 0, zoom = 1, jeton = 0, declencheur = null;
    let pdfjs = null;

    // PDF.js chargé à la première ouverture seulement
    function chargerPdfJs() {
      if (pdfjs) return pdfjs;
      pdfjs = new Promise((resoudre, rejeter) => {
        if (window.pdfjsLib) return resoudre(window.pdfjsLib);
        const sc = document.createElement("script");
        sc.src = PDFJS + "pdf.min.js";
        sc.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js"; resoudre(window.pdfjsLib); };
        sc.onerror = () => { pdfjs = null; rejeter(new Error("PDF.js indisponible")); };
        document.head.append(sc);
      });
      return pdfjs;
    }

    function construire() {
      voile = document.createElement("div");
      voile.className = "pdf-voile";
      fenetre = document.createElement("div");
      fenetre.className = "pdf-fenetre";
      fenetre.setAttribute("role", "dialog");
      fenetre.setAttribute("aria-modal", "true");
      fenetre.setAttribute("aria-hidden", "true");
      fenetre.setAttribute("aria-labelledby", "pdf-fenetre-titre");
      fenetre.innerHTML = `
        <div class="pdf-fenetre__entete">
          <span class="pdf-fenetre__icone" aria-hidden="true">PDF</span>
          <h2 id="pdf-fenetre-titre" class="pdf-fenetre__titre">Document</h2>
          <div class="pdf-fenetre__zoom">
            <button type="button" data-zoom="moins" aria-label="${esc(t("Dézoomer"))}">−</button>
            <button type="button" data-zoom="ajuster" class="pdf-fenetre__niveau" aria-label="${esc(t("Ajuster à la largeur"))}">100 %</button>
            <button type="button" data-zoom="plus" aria-label="${esc(t("Zoomer"))}">+</button>
          </div>
          <a class="pdf-fenetre__telecharger" download aria-label="Télécharger">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>${esc(t("Télécharger"))}</span></a>
          <button type="button" class="pdf-fenetre__fermer" aria-label="${esc(t("Fermer"))}">×</button>
        </div>
        <div class="pdf-fenetre__lecteur"><p class="pdf-fenetre__statut"></p></div>`;
      document.body.append(voile, fenetre);
      lecteur = fenetre.querySelector(".pdf-fenetre__lecteur");
      statut = fenetre.querySelector(".pdf-fenetre__statut");
      titreEl = fenetre.querySelector(".pdf-fenetre__titre");
      telecharger = fenetre.querySelector(".pdf-fenetre__telecharger");
      fermerBtn = fenetre.querySelector(".pdf-fenetre__fermer");
      zoomBtn = fenetre.querySelector(".pdf-fenetre__niveau");
      fermerBtn.addEventListener("click", fermer);
      voile.addEventListener("click", fermer);
      fenetre.querySelector(".pdf-fenetre__zoom").addEventListener("click", (e) => {
        const z = e.target.closest("[data-zoom]");
        if (!z) return;
        if (z.dataset.zoom === "plus") changerZoom(zoom * 1.25);
        else if (z.dataset.zoom === "moins") changerZoom(zoom / 1.25);
        else changerZoom(1);
      });
      lecteur.addEventListener("wheel", (e) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        const r = lecteur.getBoundingClientRect();
        changerZoom(zoom * Math.exp(-e.deltaY * 0.01), e.clientX - r.left, e.clientY - r.top);
      }, { passive: false });
      let pincement = null;
      const infoDoigts = (t) => {
        const [a, b] = t, r = lecteur.getBoundingClientRect();
        return { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), x: (a.clientX + b.clientX) / 2 - r.left, y: (a.clientY + b.clientY) / 2 - r.top };
      };
      lecteur.addEventListener("touchstart", (e) => { if (e.touches.length === 2) pincement = { d: infoDoigts(e.touches).d, zoom }; }, { passive: true });
      lecteur.addEventListener("touchmove", (e) => {
        if (!pincement || e.touches.length !== 2) return;
        e.preventDefault();
        const i = infoDoigts(e.touches);
        changerZoom(pincement.zoom * (i.d / pincement.d), i.x, i.y);
      }, { passive: false });
      lecteur.addEventListener("touchend", (e) => { if (e.touches.length < 2) pincement = null; });
      document.addEventListener("keydown", (e) => {
        if (!fenetre.classList.contains("is-ouverte")) return;
        if (e.key === "Escape") return fermer();
        if (e.ctrlKey || e.metaKey) {
          if (e.key === "+" || e.key === "=") { e.preventDefault(); changerZoom(zoom * 1.25); }
          else if (e.key === "-") { e.preventDefault(); changerZoom(zoom / 1.25); }
          else if (e.key === "0") { e.preventDefault(); changerZoom(1); }
        }
      });
      let minuteurTaille;
      window.addEventListener("resize", () => {
        clearTimeout(minuteurTaille);
        minuteurTaille = setTimeout(() => {
          if (!docCourant || !fenetre.classList.contains("is-ouverte")) return;
          const ratio = lecteur.scrollTop / (lecteur.scrollHeight || 1);
          disposer();
          lecteur.scrollTop = ratio * lecteur.scrollHeight;
          planifierRendu();
        }, 200);
      });
    }

    const afficherStatut = (texte, erreur = false) => {
      statut.textContent = texte;
      statut.className = "pdf-fenetre__statut" + (erreur ? " is-erreur" : "");
      statut.hidden = false;
    };
    const largeurDispo = () => {
      const st = getComputedStyle(lecteur);
      return Math.min(lecteur.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight), 900);
    };
    const echelle = () => (largeurBase ? (largeurDispo() / largeurBase) * zoom : 1);

    // Taille des pages sans les redessiner (rapide, pendant le zoom)
    function disposer() {
      const e = echelle();
      vues.forEach((v) => {
        const vp = v.page.getViewport({ scale: e });
        v.cadre.style.width = Math.floor(vp.width) + "px";
        v.cadre.style.height = Math.floor(vp.height) + "px";
        v.cadre.style.setProperty("--scale-factor", e);
      });
      zoomBtn.textContent = Math.round(zoom * 100) + " %";
    }

    async function dessiner(v) {
      const e = echelle();
      if (v.echelle === e) return;
      v.tache?.cancel();
      v.tacheTexte?.cancel();
      v.echelle = e;
      const vp = v.page.getViewport({ scale: e });
      let ratio = window.devicePixelRatio || 1;
      if (vp.width * vp.height * ratio * ratio > PIXELS_MAX) ratio = Math.sqrt(PIXELS_MAX / (vp.width * vp.height));
      const toile = document.createElement("canvas");
      toile.width = Math.floor(vp.width * ratio);
      toile.height = Math.floor(vp.height * ratio);
      const tache = v.page.render({ canvasContext: toile.getContext("2d"), viewport: vp, transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : null });
      v.tache = tache;
      try { await tache.promise; } catch (err) {
        if (v.tache === tache) v.echelle = 0;
        return;
      }
      if (v.tache !== tache) return;
      const texte = document.createElement("div");
      texte.className = "textLayer";
      v.cadre.replaceChildren(toile, texte);
      const lib = await chargerPdfJs();
      const tacheTexte = lib.renderTextLayer({ textContentSource: v.page.streamTextContent(), container: texte, viewport: vp, textDivs: [] });
      v.tacheTexte = tacheTexte;
      try { await tacheTexte.promise; } catch (err) { /* annulé */ }
    }

    function liberer(v) {
      v.tache?.cancel();
      v.tacheTexte?.cancel();
      v.tache = v.tacheTexte = null;
      v.echelle = 0;
      v.cadre.replaceChildren();
    }

    const visibles = new Set();
    let observateur = null;
    let minuteurRendu;
    const planifierRendu = () => { clearTimeout(minuteurRendu); minuteurRendu = setTimeout(() => visibles.forEach(dessiner), 150); };

    function vider() {
      if (observateur) observateur.disconnect();
      visibles.clear();
      vues.forEach(liberer);
      vues.forEach((v) => v.cadre.remove());
      vues = [];
    }

    async function charger(url) {
      const j = ++jeton;
      urlCourante = url;
      zoom = 1;
      vider();
      if (docCourant) { docCourant.destroy(); docCourant = null; }
      lecteur.scrollTop = lecteur.scrollLeft = 0;
      afficherStatut(t("Chargement du document…"));
      try {
        const lib = await chargerPdfJs();
        const pdf = await lib.getDocument({ url }).promise;
        if (j !== jeton) return pdf.destroy();
        docCourant = pdf;
        observateur = new IntersectionObserver((entrees) => entrees.forEach((en) => {
          const v = en.target._vue;
          if (en.isIntersecting) { visibles.add(v); dessiner(v); } else { visibles.delete(v); liberer(v); }
        }), { root: lecteur, rootMargin: "150% 0px" });
        for (let n = 1; n <= pdf.numPages; n++) {
          const page = await pdf.getPage(n);
          if (j !== jeton) return;
          if (n === 1) largeurBase = page.getViewport({ scale: 1 }).width;
          const cadre = document.createElement("div");
          cadre.className = "pdf-page";
          cadre.setAttribute("aria-label", `${t("Page")} ${n} / ${pdf.numPages}`);
          const v = { page, cadre, echelle: 0, tache: null, tacheTexte: null };
          cadre._vue = v;
          vues.push(v);
          lecteur.append(cadre);
        }
        statut.hidden = true;
        disposer();
        vues.forEach((v) => observateur.observe(v.cadre));
      } catch (err) {
        if (j !== jeton) return;
        console.error("[contenus] PDF :", err);
        urlCourante = null;
        vider();
        afficherStatut(t("Impossible d'afficher le document. Vous pouvez essayer de le télécharger."), true);
      }
    }

    function changerZoom(nouveau, ax = lecteur.clientWidth / 2, ay = lecteur.clientHeight / 2) {
      if (!docCourant) return;
      nouveau = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nouveau));
      if (Math.abs(nouveau - zoom) < 0.001) return;
      const r = nouveau / zoom, x = lecteur.scrollLeft + ax, y = lecteur.scrollTop + ay;
      zoom = nouveau;
      disposer();
      lecteur.scrollLeft = x * r - ax;
      lecteur.scrollTop = y * r - ay;
      planifierRendu();
    }

    function ouvrir(url, titre, bouton) {
      if (!fenetre) construire();
      declencheur = bouton || null;
      titreEl.textContent = titre || t("Document");
      telecharger.href = urlTelechargement(url);
      fenetre.classList.add("is-ouverte");
      voile.classList.add("is-ouverte");
      fenetre.setAttribute("aria-hidden", "false");
      document.body.classList.add("pdf-sans-defilement");
      fermerBtn.focus();
      if (url !== urlCourante) requestAnimationFrame(() => charger(url));
      else { disposer(); planifierRendu(); }
    }

    function fermer() {
      if (!fenetre || !fenetre.classList.contains("is-ouverte")) return;
      fenetre.classList.remove("is-ouverte");
      voile.classList.remove("is-ouverte");
      fenetre.setAttribute("aria-hidden", "true");
      document.body.classList.remove("pdf-sans-defilement");
      if (declencheur) declencheur.focus();
    }

    return { ouvrir, fermer };
  })();

  /* ---------------------------------------------------------
     Agenda (contenus/evenements.json)
     ---------------------------------------------------------
     Fichier écrit par le gestionnaire à partir des pages créées dont
     la case « Ajouter à l'agenda » est cochée (une entrée par page).
     Une entrée :
       id, titre                    obligatoires
       dateDebut   "AAAA-MM-JJ"     obligatoire
       dateFin     "AAAA-MM-JJ"     évènement sur plusieurs jours
       heureDebut, heureFin "HH:MM" optionnels
       lieu, description            optionnels (description : résumé de la page)
       categorie   id de navigation.json (ex. "ateliers")
       lien        chemin de la page
       page        id de la page créée
     Évènement à venir : bouton « Ajouter au calendrier » qui ouvre
     Outlook (outlook.office.com) avec l'évènement pré-rempli.
       publie: false                brouillon masqué

     À venir : dateFin (ou dateDebut) >= aujourd'hui, du plus
     proche au plus lointain. Passés : du plus récent au plus
     ancien. « En cours » : aujourd'hui entre début et fin.
     --------------------------------------------------------- */

  const MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin",
                       "juil.", "août", "sept.", "oct.", "nov.", "déc."];

  const ICONES = {
    date: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    heure: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    lieu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  };

  // Date locale du visiteur au format AAAA-MM-JJ (pas l'heure UTC)
  function aujourdhuiISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function partiesDate(iso) {
    const [a, m, j] = String(iso).split("-").map(Number);
    return { annee: a, mois: m - 1, jour: j };
  }

  const MOIS_LONGS = ["janvier", "février", "mars", "avril", "mai", "juin",
                      "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const jourFr = (n) => (n === 1 ? "1er" : String(n));

  // "Jeudi 15 octobre 2026" / "Du 4 au 6 novembre 2026" / "Du 28 octobre au 2 novembre 2026"
  // Autre langue que le français : formats de la langue (Intl)
  const moisCourt = (m) => (LANGUE === "fr" ? MOIS_COURTS[m]
    : new Date(2000, m, 1).toLocaleDateString(LANGUE, { month: "short" }));
  function texteDates(debut, fin) {
    if (LANGUE !== "fr") {
      const a = new Date(debut + "T00:00:00"), b = fin && fin !== debut ? new Date(fin + "T00:00:00") : null;
      try {
        const f = new Intl.DateTimeFormat(LANGUE, b ? { day: "numeric", month: "long", year: "numeric" } : { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        const r = b && f.formatRange ? f.formatRange(a, b) : b ? `${f.format(a)} – ${f.format(b)}` : f.format(a);
        return r.charAt(0).toUpperCase() + r.slice(1);
      } catch (e) { /* langue inconnue : format français */ }
    }
    const d = partiesDate(debut);
    if (!fin || fin === debut) {
      const js = JOURS[new Date(d.annee, d.mois, d.jour).getDay()];
      return `${js.charAt(0).toUpperCase() + js.slice(1)} ${jourFr(d.jour)} ${MOIS_LONGS[d.mois]} ${d.annee}`;
    }
    const f = partiesDate(fin);
    const txtFin = `${jourFr(f.jour)} ${MOIS_LONGS[f.mois]} ${f.annee}`;
    let txtDebut = jourFr(d.jour);
    if (d.annee !== f.annee) txtDebut += ` ${MOIS_LONGS[d.mois]} ${d.annee}`;
    else if (d.mois !== f.mois) txtDebut += ` ${MOIS_LONGS[d.mois]}`;
    return `Du ${txtDebut} au ${txtFin}`;
  }

  // "09:30" -> "9 h 30"
  const heureFr = (h) => (LANGUE === "fr" ? String(h).replace(/^0?(\d{1,2}):(\d{2})$/, "$1 h $2") : String(h).replace(/^0(\d):/, "$1:"));

  // Pavé date (colonne de gauche)
  function htmlPaveDate(ev) {
    const d = partiesDate(ev.dateDebut);
    const f = ev.dateFin && ev.dateFin !== ev.dateDebut ? partiesDate(ev.dateFin) : null;
    let jour = String(d.jour);
    let mois = moisCourt(d.mois);
    let suite = "";
    if (f) {
      if (f.mois === d.mois && f.annee === d.annee) {
        jour = `${d.jour}–${f.jour}`;
      } else {
        suite = `<span class="evt__date-fin">→ ${f.jour} ${moisCourt(f.mois)}</span>`;
      }
    }
    return `
        <div class="evt__date" aria-hidden="true">
          <span class="evt__jour">${jour}</span>
          <span class="evt__mois">${mois}</span>
          ${suite || `<span class="evt__annee">${d.annee}</span>`}
        </div>`;
  }

  function htmlEvenement(ev, statut, masque) {
    const cat = titreCategorie(ev.categorie);
    const horaire = ev.heureDebut
      ? (ev.heureFin ? `${heureFr(ev.heureDebut)} – ${heureFr(ev.heureFin)}` : heureFr(ev.heureDebut))
      : "";
    const aLien = ev.lien && ev.lien !== "#";
    const titre = aLien
      ? `<a class="evt__lien" href="${esc(ev.lien)}"${cible(ev)}>${esc(ev.titre)}</a>`
      : esc(ev.titre);

    const actions = [];
    if (statut !== "passe") {
      actions.push(`<a class="evt__btn evt__btn--secondaire" href="${esc(lienOutlook(ev))}"
            target="_blank" rel="noopener" aria-label="${esc(t("Ajouter au calendrier"))} : ${esc(ev.titre)}">
            ${ICONES.date}<span>${esc(t("Ajouter au calendrier"))}</span></a>`);
    }

    return `
      <li class="evt evt--${statut}"${masque ? " hidden" : ""}>
        ${htmlPaveDate(ev)}
        <div class="evt__corps">
          <div class="evt__haut">
            ${cat ? `<span class="evt__cat">${esc(cat)}</span>` : ""}
            ${statut === "en-cours" ? `<span class="evt__badge">${esc(t("En cours"))}</span>` : ""}
          </div>
          <h3 class="evt__titre">${titre}</h3>
          <ul class="evt__meta">
            <li>${ICONES.date}<span>${esc(texteDates(ev.dateDebut, ev.dateFin))}</span></li>
            ${horaire ? `<li>${ICONES.heure}<span>${esc(horaire)}</span></li>` : ""}
            ${ev.lieu ? `<li>${ICONES.lieu}<span>${esc(ev.lieu)}</span></li>` : ""}
          </ul>
          ${ev.description ? `<p class="evt__desc">${esc(ev.description)}</p>` : ""}
        </div>
        ${actions.length ? `<div class="evt__actions">${actions.join("")}</div>` : ""}
      </li>`;
  }

  // Lien Outlook pré-rempli :
  // https://outlook.office.com/calendar/0/deeplink/compose?subject=…&startdt=…&enddt=…&location=…&body=…
  // - avec horaire (même jour) : startdt/enddt = AAAA-MM-JJTHH:MM:00
  // - sans horaire ou sur plusieurs jours : journée(s) entière(s), allday=true
  //   (enddt = lendemain du dernier jour, borne exclue)
  function lienOutlook(ev) {
    const fin = ev.dateFin || ev.dateDebut;
    const lendemain = (iso) => {
      const d = new Date(iso + "T00:00:00");
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };
    const heure = (h) => String(h).padStart(5, "0") + ":00";   // "9:30" -> "09:30:00"

    const params = [["subject", ev.titre]];
    if (ev.heureDebut && fin === ev.dateDebut) {
      params.push(["startdt", `${ev.dateDebut}T${heure(ev.heureDebut)}`]);
      params.push(["enddt", `${fin}T${heure(ev.heureFin || ev.heureDebut)}`]);
    } else {
      params.push(["startdt", ev.dateDebut], ["enddt", lendemain(fin)], ["allday", "true"]);
    }
    if (ev.lieu) params.push(["location", ev.lieu]);

    const corps = [ev.description, ev.lien && ev.lien !== "#" ? new URL(ev.lien, document.baseURI).href : ""]
      .filter(Boolean).join("\n\n");
    if (corps) params.push(["body", corps]);

    return "https://outlook.office.com/calendar/0/deeplink/compose?" +
      params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  }

  async function construireAgenda(zone = document.querySelector("[data-agenda]")) {
    if (!zone) return;

    try {
      const [evenements] = await Promise.all([charger("evenements"), chargerCategories()]);
      const valides = evenements.filter((ev) => publie(ev) && ev.dateDebut);
      rendreAgenda(zone, valides);
      // Export statique : évènements gardés dans la page, pour que « À venir »,
      // « En cours » et « Passés » suivent la date du jour chez le visiteur
      if (EXPORT) {
        const categories = {};
        valides.forEach((ev) => { if (ev.categorie) categories[ev.categorie] = titreCategorie(ev.categorie); });
        zone.append(donneesStatiques("agenda__donnees", { evenements: valides, categories }));
      }
    } catch (err) {
      console.error("[contenus] Agenda : impossible de charger data/contenus/evenements.json :", err);
    }
  }

  // <script type="application/json"> (données gardées dans une page exportée)
  function donneesStatiques(classe, valeur) {
    const s = document.createElement("script");
    s.type = "application/json";
    s.className = classe;
    s.textContent = JSON.stringify(valeur).replace(/</g, "\\u003c");
    return s;
  }
  const lireDonneesStatiques = (el) => { try { return el ? JSON.parse(el.textContent) : null; } catch (e) { return null; } };

  // Agenda (onglets « À venir » / « Passés ») d'après la date du jour
  function rendreAgenda(zone, valides) {
    {
      const auj = aujourdhuiISO();
      const aVenir = valides
        .filter((ev) => (ev.dateFin || ev.dateDebut) >= auj)
        .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut));
      const passes = valides
        .filter((ev) => (ev.dateFin || ev.dateDebut) < auj)
        .sort((a, b) => (b.dateFin || b.dateDebut).localeCompare(a.dateFin || a.dateDebut));

      const limites = {
        avenir: limiteDe(zone.dataset.limitAvenir, 6),
        passes: limiteDe(zone.dataset.limitPasses, 4),
      };

      const panneaux = [
        { cle: "avenir", titre: t("À venir"), liste: aVenir,
          vide: t("Aucun évènement programmé pour le moment.") },
        { cle: "passes", titre: t("Passés"), liste: passes,
          vide: t("Aucun évènement passé.") },
      ];
      // Onglet ouvert par défaut : « À venir », sauf s'il est vide
      const actif = aVenir.length || !passes.length ? "avenir" : "passes";

      const onglets = panneaux.map((p) => `
        <button type="button" role="tab" class="agenda__onglet"
                id="agenda-onglet-${p.cle}" aria-controls="agenda-panneau-${p.cle}"
                aria-selected="${p.cle === actif}" tabindex="${p.cle === actif ? 0 : -1}">
          ${p.titre}
        </button>`).join("");

      const contenus = panneaux.map((p) => {
        const limite = limites[p.cle];
        const items = p.liste.map((ev, i) => {
          const fin = ev.dateFin || ev.dateDebut;
          const statut = p.cle === "passes" ? "passe" : (ev.dateDebut <= auj && fin >= auj ? "en-cours" : "a-venir");
          return htmlEvenement(ev, statut, i >= limite);
        }).join("");
        const reste = p.liste.length - limite;
        return `
        <div role="tabpanel" class="agenda__panneau" id="agenda-panneau-${p.cle}"
             aria-labelledby="agenda-onglet-${p.cle}"${p.cle === actif ? "" : " hidden"} data-pas="${limite}">
          ${p.liste.length
            ? `<ol class="agenda__liste">${items}</ol>
               ${reste > 0 ? `<button type="button" class="agenda__plus">${esc(t("Afficher plus d'évènements"))} <span class="agenda__plus-nb">(${reste})</span></button>` : ""}`
            : `<p class="agenda__vide">${p.vide}</p>`}
        </div>`;
      }).join("");

      zone.innerHTML = `<div class="agenda__onglets" role="tablist" aria-label="${esc(t("Période"))}">${onglets}</div>${contenus}`;
      zone.setAttribute("aria-busy", "false");
      brancherAgenda(zone);
    }
  }

  // Onglets et « Afficher plus » de l'agenda (aussi sur le site statique)
  function brancherAgenda(zone) {
    {
      // --- Onglets (clic + flèches du clavier) ---
      const boutons = [...zone.querySelectorAll('[role="tab"]')];
      function activer(btn, focus) {
        boutons.forEach((b) => {
          const sel = b === btn;
          b.setAttribute("aria-selected", sel);
          b.tabIndex = sel ? 0 : -1;
          zone.querySelector("#" + b.getAttribute("aria-controls")).hidden = !sel;
        });
        if (focus) btn.focus();
      }
      boutons.forEach((b, i) => {
        b.addEventListener("click", () => activer(b));
        b.addEventListener("keydown", (e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          const suiv = boutons[(i + (e.key === "ArrowRight" ? 1 : -1) + boutons.length) % boutons.length];
          activer(suiv, true);
        });
      });

      // --- « Afficher plus » ---
      zone.querySelectorAll(".agenda__plus").forEach((btn) => {
        btn.addEventListener("click", () => {
          const panneau = btn.closest(".agenda__panneau");
          const pas = parseInt(panneau.dataset.pas, 10) || 4;
          const caches = [...panneau.querySelectorAll(".evt[hidden]")];
          caches.slice(0, pas).forEach((li) => { li.hidden = false; });
          const premier = caches[0] && caches[0].querySelector("a, button");
          if (premier) premier.focus({ preventScroll: true });
          const restants = caches.length - pas;
          if (restants > 0) btn.querySelector(".agenda__plus-nb").textContent = `(${restants})`;
          else btn.remove();
        });
      });
    }
  }

  /* ---------------------------------------------------------
     « Afficher plus » générique : les "pas" premiers enfants du
     conteneur sont visibles, chaque clic en révèle "pas" de plus.
     Utilisé par les actualités d'un projet et les catégories.
     --------------------------------------------------------- */

  // "initial" (optionnel) : nombre visible au départ, s'il diffère du lot
  function paginer(conteneur, pas = 5, libelle = t("Afficher plus"), initial = pas) {
    const items = [...conteneur.children];
    conteneur.setAttribute("data-pagine", "");
    conteneur.dataset.pas = String(pas);
    conteneur.dataset.initial = String(initial);
    // Bouton déjà présent (page du site statique) : remplacé
    const ancien = conteneur.nextElementSibling;
    if (ancien && ancien.classList.contains("bouton-plus")) ancien.remove();
    if (items.length <= initial) return;
    items.forEach((el, i) => { el.hidden = i >= initial; });

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bouton-plus";
    const majLibelle = () => {
      const reste = conteneur.querySelectorAll(":scope > [hidden]").length;
      btn.innerHTML = `${esc(libelle)} <span class="bouton-plus__nb">(${reste})</span>`;
      return reste;
    };
    majLibelle();

    btn.addEventListener("click", () => {
      const caches = [...conteneur.querySelectorAll(":scope > [hidden]")];
      caches.slice(0, pas).forEach((el) => { el.hidden = false; });
      const premier = caches[0] && caches[0].querySelector("a");
      if (premier) premier.focus({ preventScroll: true });
      if (!majLibelle()) btn.remove();
    });
    conteneur.after(btn);
  }

  // Branche la pagination sur tous les conteneurs [data-pagine-pas] d'une zone
  function brancherPagination(zone) {
    zone.querySelectorAll("[data-pagine-pas]").forEach((c) => {
      const pas = limiteDe(c.dataset.paginePas, 5);
      paginer(c, pas, t("Afficher plus"), limiteDe(c.dataset.pagineInitial, pas));
    });
  }

  /* ---------------------------------------------------------
     Volet de navigation (data-volet="id-navigation")
     ---------------------------------------------------------
     Construit à partir de navigation.json avec colonnesCategorie,
     la même fonction que le méga-menu et le footer : un sous-menu
     modifié dans navigation.json (ou un projet ajouté dans
     projets.json) apparaît partout à la fois.
     --------------------------------------------------------- */

  let compteurVolets = 0;   // identifiants uniques (plusieurs volets par page)

  // id de catégorie -> { cat, actif: null }
  // id d'élément de sous-menu -> { cat: sa catégorie, actif: cet id }
  async function resoudreNavigation(idNav) {
    const nav = await charger("structure/navigation");
    const menu = (nav.menu || []).filter(publie);
    const cat = menu.find((c) => c.id === idNav);
    if (cat) return { cat, actif: null };
    const parent = menu.find((c) => (c.sousMenu || []).some((s) => s.id === idNav));
    return parent ? { cat: parent, actif: idNav } : null;
  }

  // Le lien pointe-t-il vers la page affichée ? (ancres "#..." ignorées)
  // Les liens des JSON sont relatifs à la racine du site : on les résout
  // avec document.baseURI (<base href="../../"> dans les pages générées
  // en sous-dossier), comme le fait le navigateur pour les <a href>.
  function estPageCourante(lien) {
    if (!lien || lien.startsWith("#")) return false;
    try {
      const u = new URL(lien, document.baseURI);
      return u.origin === location.origin && u.pathname === location.pathname;
    } catch (e) {
      return false;
    }
  }

  // HTML du volet ("" si l'id est inconnu ou le sous-menu vide)
  // Bloc placé dans une page qui a son propre volet : pas de second volet
  const voletBloc = (zone, id) => (zone.closest(".page-volet") ? "aucun" : id);

  /* ---------------------------------------------------------
     Volet latéral d'une page créée (réglage « volet », activé par défaut)
     ---------------------------------------------------------
     L'en-tête de la page, ses blocs et ses liens passent dans une
     colonne principale ; le volet de navigation de sa rubrique est à
     droite, sur toute la hauteur (les blocs prennent la largeur
     restante). Les volets propres aux blocs ne sont alors plus affichés.
     --------------------------------------------------------- */
  async function appliquerVoletPage(page, actif) {
    let cadre = document.querySelector(".page-volet");
    if (!actif) {
      if (cadre) {
        const principal = cadre.querySelector(".page-volet__principal");
        while (principal.firstChild) cadre.before(principal.firstChild);
        cadre.remove();
      }
      return false;
    }
    const idNav = String((page && page.categorie) || "").split("/").filter(Boolean).pop();
    const volet = idNav ? await htmlVolet(idNav) : "";
    if (!volet) return false;
    if (!cadre) {
      const elements = [document.querySelector(".page-libre"), document.querySelector('[data-blocs^="page:"]'), document.querySelector(".page-libre-liens")].filter(Boolean);
      if (!elements.length) return false;
      cadre = document.createElement("div");
      cadre.className = "page-volet";
      cadre.innerHTML = '<div class="page-volet__principal"></div><aside class="page-volet__cote"></aside>';
      elements[0].before(cadre);
      elements.forEach((e) => cadre.firstChild.append(e));
    }
    cadre.querySelector(".page-volet__cote").innerHTML = volet;
    return true;
  }

  // Au chargement d'une page créée : ses réglages (volet, liens)
  // Titre de la page créée (écrit dans le HTML à l'enregistrement) : celui
  // des données, éventuellement pas encore enregistrées (aperçu)
  function majEntetePage(page) {
    const titre = document.getElementById("page-titre");
    if (titre && page.titre && titre.textContent !== page.titre) titre.textContent = page.titre;
    // Image d'aperçu en tête de la page (réglages de la page) : ajoutée,
    // changée ou retirée sans attendre que la page soit régénérée
    const conteneur = titre && titre.closest(".site-section__container");
    if (!conteneur || page.image === undefined && !conteneur.querySelector(".page-libre__image")) return;
    let figure = conteneur.querySelector(":scope > .page-libre__image");
    if (!page.image) { if (figure) figure.remove(); return; }
    if (!figure) {
      figure = document.createElement("figure");
      figure.className = "page-libre__image";
      figure.append(document.createElement("img"));
      conteneur.append(figure);
    }
    const img = figure.querySelector("img");
    const src = url(page.image);
    if (img.getAttribute("src") !== src) img.setAttribute("src", src);
    img.alt = altDe(page, "");
    const legende = page.imageLegende === true && img.alt;
    let cap = figure.querySelector("figcaption");
    if (legende) { if (!cap) { cap = document.createElement("figcaption"); cap.className = "legende"; figure.append(cap); } cap.textContent = img.alt; }
    else if (cap) cap.remove();
  }

  async function preparerPageCreee() {
    const meta = document.querySelector('meta[name="isci-page-generee"]');
    const [type, id] = String((meta && meta.content) || "").split(":");
    if (type !== "page" || !id) return;
    try {
      const page = (await charger("structure/pages-creees", "#" + id)).find((o) => o.id === id);
      if (!page) return;
      PAGE_COURANTE ||= { personnes: page.personnes || [], projets: page.projets || [], partenaires: page.partenaires || [] };
      majEntetePage(page);
      await appliquerVoletPage(page, page.volet !== false);
    } catch (err) {
      console.error("[contenus] Page créée :", err);
    }
  }

  async function htmlVolet(idNav, options = {}) {
    const res = await resoudreNavigation(idNav);
    if (!res) {
      console.warn(`[contenus] Volet : "${idNav}" introuvable dans data/structure/navigation.json`);
      return "";
    }
    const { cat } = res;
    const actif = options.actif || res.actif;
    const colonnes = (await colonnesCategorie(cat))
      .map((c) => ({ ...c, liens: c.liens.filter(publie) }))
      .filter((c) => c.liens.length);
    if (!colonnes.length) return "";

    const estActif = (l) => (actif ? l.id === actif : estPageCourante(l.lien));
    const idTitre = `volet-${++compteurVolets}-titre`;
    const titre = options.titre || cat.titre;
    const titreHTML = cat.lien && cat.lien !== "#"
      ? `<a href="${esc(cat.lien)}"${cible(cat)}>${esc(titre)}</a>`
      : esc(titre);

    return `
        <nav class="volet" aria-labelledby="${idTitre}">
          <h3 id="${idTitre}" class="volet__titre">${titreHTML}</h3>
          ${colonnes.map((col) => `
          <div class="volet__groupe">
            ${col.titre ? `<h4 class="volet__sous-titre">${esc(col.titre)}</h4>` : ""}
            <ul>
              ${col.liens.map((l) => estActif(l)
                ? `<li><a class="volet__lien is-actif" href="${esc(l.lien || "#")}"${cible(l)} aria-current="page">${esc(l.titre)}</a></li>`
                : `<li><a class="volet__lien" href="${esc(l.lien || "#")}"${cible(l)}>${esc(l.titre)}</a></li>`).join("")}
            </ul>
          </div>`).join("")}
        </nav>`;
  }

  // Conteneur générique : contenu existant -> colonne principale, volet à droite
  async function construireVolet(zone) {
    if (zone.closest(".page-volet")) return;   // la page a déjà son volet
    try {
      const volet = await htmlVolet(zone.dataset.volet, {
        actif: zone.dataset.voletActif,
        titre: zone.dataset.voletTitre,
      });
      if (!volet) return;
      const principal = document.createElement("div");
      principal.className = "volet-principal";
      while (zone.firstChild) principal.appendChild(zone.firstChild);
      zone.classList.add("volet-grille");
      zone.appendChild(principal);
      zone.insertAdjacentHTML("beforeend", volet);
    } catch (err) {
      console.error(`[contenus] Volet "${zone.dataset.volet}" :`, err);
    }
  }

  /* ---------------------------------------------------------
     Fiche projet (data-projet="id")
     ---------------------------------------------------------
     projets.json      titre, pays, image, description (liste de
                       paragraphes), "partenaires": ["id", ...]
     publications.json "projets": ["id-projet", ...]
     projets.json      "personnes": ["id-personne", ...] (équipe,
                       dans l'ordre d'affichage)
     partenaires.json  { "categories": [{ id, titre }, ...],
                         "<id-categorie>": [{ id, nom, image, lien,
                                              nouvelOnglet }, ...] }
     Un partenaire sans image est affiché par son nom ; sans lien,
     il n'est pas cliquable. Un bloc vide n'est pas affiché.
     --------------------------------------------------------- */

  // id -> partenaire (avec le titre de sa catégorie)
  function indexerPartenaires(donnees) {
    const index = new Map();
    if (!donnees || typeof donnees !== "object") return index;
    const categories = Array.isArray(donnees.categories) ? donnees.categories : [];
    const titres = new Map(categories.map((c) => [c.id, c.titre]));
    Object.keys(donnees)
      .filter((cle) => cle !== "categories" && Array.isArray(donnees[cle]))
      .forEach((cle) => {
        donnees[cle].filter(publie).forEach((p) => {
          index.set(p.id, { ...p, categorieTitre: titres.get(cle) || "" });
        });
      });
    return index;
  }

  const initiales = (nom) => String(nom || "")
    .split(/[\s-]+/).filter(Boolean).slice(0, 2)
    .map((m) => m.charAt(0).toUpperCase()).join("");

  function htmlBlocProjet(titre, modificateur, contenu) {
    if (!contenu) return "";
    return `
          <section class="pt-groupe projet__bloc projet__bloc--${modificateur}">
            <header class="pt-groupe__entete">
              <h3 class="pt-groupe__titre">${esc(titre)}</h3>
              <span class="pt-groupe__trait"></span>
            </header>
            ${contenu}
          </section>`;
  }

  // Équipe : seules les premières personnes sont visibles, les suivantes
  // sont révélées par « Afficher plus ». Le nombre dépend de la largeur
  // d'écran : 5 sur grand écran, 6 sur téléphone (grille de 2 colonnes,
  // donc 3 lignes complètes). Recalculé si l'écran change de taille.
  const ECRAN_MOBILE = window.matchMedia("(max-width: 600px)");

  function htmlEquipe(personnes, limites, options = {}) {
    const edition = FICHES_EDITION && options.edition;   // fiche projet dans le gestionnaire
    // options.gestion (bloc « Membres et partenaires » dans le gestionnaire) :
    // création d'une nouvelle personne (et de sa page)
    if (!personnes.length && !edition && !options.gestion) return "";
    const ajout = options.gestion
      ? `<li class="pt-ajout-li"><button type="button" class="pt-ajout" data-membre-action="ajouter" title="Crée la fiche et la page d'une nouvelle personne">+ Nouvelle personne</button></li>`
      : edition ? `<li class="pt-ajout-li">${boutonAjout("personnes", "+ Ajouter une personne")}</li>` : "";
    return `<ul class="projet__equipe" data-limite="${limites.grand}" data-limite-mobile="${limites.mobile}">${ajout}${personnes.map((p) => {
      const photo = p.image
        ? `<img class="projet__photo" src="${url(p.image)}" alt="" loading="lazy">`
        : `<span class="projet__photo projet__photo--initiales" aria-hidden="true">${esc(initiales(p.nom))}</span>`;
      const nom = `<span class="projet__nom">${esc(p.nom)}</span>`;
      const contenu = `${photo}${nom}${p.fonction ? `<span class="projet__fonction">${esc(p.fonction)}</span>` : ""}`;
      // Carte cliquable dès que la personne a un "lien" (page de profil)
      const li = `<li>${p.lien
        ? `<a class="projet__personne" href="${esc(p.lien)}"${cible(p)}>${contenu}</a>`
        : `<div class="projet__personne">${contenu}</div>`}</li>`;
      if (options.gestion) {
        const outils = `<span class="isci-partenaire-outils">`
          + `<button type="button" data-membre-action="modifier" data-membre-id="${esc(p.id)}" title="Modifier cette personne (nom, fonction, photo, biographie…)">✎ Modifier</button></span>`;
        return li.replace(/^<li>/, `<li class="isci-membre${publie(p) ? "" : " isci-membre--masque"}" data-membre-action="modifier" data-membre-id="${esc(p.id)}"${publie(p) ? "" : ' title="Personne masquée : pas affichée sur le site"'}>${outils}`);
      }
      return edition ? liEdition(li, "personnes", p.id) : li;
    }).join("")}</ul>${!edition && !options.gestion && personnes.length > Math.min(limites.grand, limites.mobile)
      ? `<button type="button" class="projet__plus">${esc(t("Afficher plus"))} <span class="projet__plus-nb"></span></button>`
      : ""}`;
  }

  // Masque les personnes au-delà de "nb" et met à jour le bouton
  function appliquerLimiteEquipe(liste, nb) {
    const items = [...liste.children];
    items.forEach((li, i) => { li.hidden = i >= nb; });
    liste.dataset.affiches = nb;
    const btn = liste.nextElementSibling;
    if (!btn || !btn.classList.contains("projet__plus")) return;
    const reste = items.length - nb;
    btn.hidden = reste <= 0;
    btn.querySelector(".projet__plus-nb").textContent = `(${reste})`;
  }

  const limiteEquipe = (liste) =>
    parseInt(ECRAN_MOBILE.matches ? liste.dataset.limiteMobile : liste.dataset.limite, 10) || 5;

  function brancherAfficherPlus(zone) {
    zone.querySelectorAll(".projet__equipe").forEach((liste) => {
      appliquerLimiteEquipe(liste, limiteEquipe(liste));

      const btn = liste.nextElementSibling;
      if (btn && btn.classList.contains("projet__plus")) {
        btn.addEventListener("click", () => {
          const avant = parseInt(liste.dataset.affiches, 10) || 0;
          liste.dataset.deplie = "1";
          appliquerLimiteEquipe(liste, avant + limiteEquipe(liste));
          const premier = liste.children[avant] && liste.children[avant].querySelector("a");
          if (premier) premier.focus({ preventScroll: true });
        });
      }

      // Passage grand écran <-> téléphone : tant que le visiteur n'a pas
      // cliqué sur « Afficher plus », on applique la limite du nouvel écran.
      ECRAN_MOBILE.addEventListener("change", () => {
        if (!liste.dataset.deplie) appliquerLimiteEquipe(liste, limiteEquipe(liste));
      });
    });
  }

  // options.categorie = false : n'affiche pas la catégorie sous le nom
  // (inutile quand les partenaires sont déjà groupés par catégorie)
  // options.gestion (id de catégorie, bloc « Membres et partenaires » dans le
  // gestionnaire) : partenaires ajoutés, modifiés, supprimés depuis la page
  function htmlPartenaires(partenaires, options = {}) {
    const edition = FICHES_EDITION && options.edition;
    const gestion = options.gestion !== undefined && options.gestion !== null;
    if (!partenaires.length && !edition && !gestion) return "";
    const avecCategorie = options.categorie !== false;
    const ajout = gestion
      ? `<li class="pt-ajout-li"><button type="button" class="pt-ajout" data-partenaire-action="ajouter" data-partenaire-categorie="${esc(options.gestion)}">+ Ajouter un partenaire</button></li>`
      : edition ? `<li class="pt-ajout-li">${boutonAjout("partenaires", "+ Ajouter un partenaire")}</li>` : "";
    return `<ul class="projet__partenaires">${ajout}${partenaires.map((p) => {
      const visuel = p.image
        ? `<img src="${url(p.image)}" alt="${esc(altDe(p, p.nom))}" loading="lazy">`
        : `<span class="projet__logo-texte">${esc(p.nom)}</span>`;
      const contenu = `
              <span class="projet__logo">${visuel}</span>
              <span class="projet__partenaire-nom">${esc(p.nom)}</span>
              ${avecCategorie && p.categorieTitre ? `<span class="projet__partenaire-cat">${esc(p.categorieTitre)}</span>` : ""}`;
      const li = `<li>${p.lien
        ? `<a class="projet__partenaire" href="${esc(p.lien)}"${cible(p)}>${contenu}</a>`
        : `<div class="projet__partenaire">${contenu}</div>`}</li>`;
      if (gestion) {
        const outils = `<span class="isci-partenaire-outils">`
          + `<button type="button" data-partenaire-action="modifier" data-partenaire-id="${esc(p.id)}" title="Modifier ce partenaire (nom, logo, lien, catégorie…)">✎ Modifier</button>`
          + `<button type="button" class="isci-partenaire-suppr" data-partenaire-action="supprimer" data-partenaire-id="${esc(p.id)}" title="Supprimer ce partenaire du site (retiré de toutes les pages)">✕</button></span>`;
        return li.replace(/^<li>/, `<li class="isci-partenaire${publie(p) ? "" : " isci-partenaire--masque"}" data-partenaire-action="modifier" data-partenaire-id="${esc(p.id)}"${publie(p) ? "" : ' title="Partenaire masqué : pas affiché sur le site"'}>${outils}`);
      }
      return edition ? liEdition(li, "partenaires", p.id) : li;
    }).join("")}</ul>`;
  }

  async function construireProjet(zone) {
    const id = zone.dataset.projet;
    try {
      const selLie = "@projets:" + id;
      const [projets, publications, personnes, partenaires, actualites, evenements] = await Promise.all([
        charger("projets", "#" + id),
        charger("publications", selLie).catch(() => []),
        charger("personnes", false).catch(() => []),
        charger("partenaires", false).catch((err) => {
          console.warn("[contenus] Projet : data/contenus/partenaires.json illisible :", err);
          return {};
        }),
        charger("actualites", selLie).catch(() => []),
        charger("evenements", selLie).catch(() => []),
        chargerCategories(),
      ]);
      dependre("personnes", "#" + (Array.isArray((projets.find((p) => p.id === id) || {}).personnes) ? projets.find((p) => p.id === id).personnes.join(",") : ""));
      dependre("partenaires", "#" + (Array.isArray((projets.find((p) => p.id === id) || {}).partenaires) ? projets.find((p) => p.id === id).partenaires.join(",") : ""));

      const tous = projets.filter(publie);
      const projet = tous.find((pr) => pr.id === id);
      if (!projet) {
        console.error(`[contenus] Projet : "${id}" introuvable dans data/contenus/projets.json`);
        return;
      }

      const lie = (el) => Array.isArray(el.projets) && el.projets.includes(id);
      const pubs = trierParDate(publications.filter((el) => publie(el) && lie(el)));
      // Équipe : ids listés dans "personnes" du projet, dans cet ordre
      const indexPers = new Map(personnes.filter(publie).map((p) => [p.id, p]));
      const equipe = [...new Set(Array.isArray(projet.personnes) ? projet.personnes : [])].map((pid) => {
        if (!indexPers.has(pid)) console.warn(`[contenus] Projet "${id}" : personne "${pid}" introuvable dans personnes.json`);
        return indexPers.get(pid);
      }).filter(Boolean);
      // Actualités et évènements du projet : un seul fil, du plus récent au plus ancien
      const actus = trierParDate([
        ...actualites.map((el) => (FICHES_EDITION ? { ...el, _src: "actualites" } : el)),
        ...evenements.map((el) => (FICHES_EDITION ? { ...el, _src: "evenements" } : el)),
      ].filter((el) => publie(el) && dansFil(el) && lie(el)));
      const limiteActus = parseInt(zone.dataset.limitActualites, 10) || 4;

      const indexPart = indexerPartenaires(partenaires);
      const parts = (Array.isArray(projet.partenaires) ? projet.partenaires : []).map((pid) => {
        if (!indexPart.has(pid)) console.warn(`[contenus] Projet "${id}" : partenaire "${pid}" introuvable dans partenaires.json`);
        return indexPart.get(pid);
      }).filter(Boolean);

      // Contenu de la page : ses blocs (anciennes données : image et description)
      const enBlocs = ficheEnBlocs(projet, "description");
      const paragraphes = enBlocs ? "" : (Array.isArray(projet.description) ? projet.description : [projet.description])
        .filter(Boolean).map((t) => `<p>${texteEnLigne(t)}</p>`).join("");
      // Pays : en édition, chacun peut être retiré et « + Pays » en ajoute un
      const pays = FICHES_EDITION
        ? (projet.pays || []).map((p) => `<span class="pt-tag" data-lien-source="pays" data-lien-id="${esc(p)}">${esc(nomPays(p))}<button type="button" class="isci-retirer isci-retirer--tag" title="Retirer ce pays">✕</button></span>`).join("")
          + `<button type="button" class="pt-tag pt-tag--ajout" data-ajout-source="pays">+ Pays</button>`
        : (projet.pays || []).map((p) => `<span class="pt-tag">${esc(nomPays(p))}</span>`).join("");
      // Aperçu du gestionnaire : toute l'équipe est affichée
      const limitesEquipe = FICHES_EDITION ? { grand: 999, mobile: 999 } : {
        grand: parseInt(zone.dataset.limitEquipe, 10) || 5,
        mobile: parseInt(zone.dataset.limitEquipeMobile, 10) || 6,
      };
      // Grille de cartes : en édition, carte « + Ajouter… » en premier
      const grilleProjet = (source, items, carte, texteAjout, attributs = "") => {
        if (!items.length && !FICHES_EDITION) return "";
        const cartes = FICHES_EDITION
          ? boutonAjout(source, texteAjout) + items.map((it) => marquerCarte(carte(it), it, source).replace("Retirer du profil", "Retirer du projet")).join("")
          : items.map(carte).join("");
        return `<div class="pt-grille pt-grille--${source}"${attributs}>${cartes}</div>`;
      };

      // Volet : même générateur que les volets data-volet (menu "projets")
      const volet = await htmlVolet(zone.dataset.volet || "projets", {
        actif: id,
        titre: zone.dataset.voletTitre || t("Tous les projets"),
      });

      const zoneBlocs = retenirBlocs(zone, `projet:${id}`);   // (sans attente avant de la remettre)
      zone.innerHTML = `
      <div class="projet__grille volet-grille">
        <article class="projet__principal volet-principal" aria-labelledby="projet-${esc(id)}-titre">
          <header class="projet__entete">
            ${pays ? `<div class="projet__tags">${pays}</div>` : ""}
            <h2 id="projet-${esc(id)}-titre" class="projet__titre">${esc(projet.titre)}</h2>
          </header>
          ${!enBlocs && projet.image ? `<figure class="projet__image${legendeDe(projet) ? " projet__image--legende" : ""}"><img src="${url(projet.image)}" alt="${esc(altDe(projet, projet.titre))}" loading="lazy">${legendeDe(projet)}</figure>` : ""}
          ${paragraphes ? `<div class="projet__texte">${paragraphes}</div>` : ""}
          ${enBlocs ? emplacementBlocs : ""}
          ${htmlBlocProjet(t("L'équipe du projet"), "equipe", htmlEquipe(equipe, limitesEquipe, { edition: true }))}
          ${htmlBlocProjet(t("Publications scientifiques"), "publications",
            grilleProjet("publications", pubs, carteArticle, "+ Ajouter une publication"))}
          ${htmlBlocProjet(t("Pour aller plus loin"), "actualites",
            grilleProjet("actualites", actus, carteFil, "+ Ajouter une actualité ou un évènement", FICHES_EDITION ? "" : ` data-pagine-pas="${limiteActus}"`))}
          ${htmlBlocProjet(t("Partenaires"), "partenaires", htmlPartenaires(parts, { edition: true }))}
        </article>
        ${volet}
      </div>`;
      placerBlocs(zone, zoneBlocs);
      zone.setAttribute("aria-busy", "false");
      brancherAfficherPlus(zone);
      brancherPagination(zone);
      zone.dispatchEvent(new CustomEvent("contenus:fiche", { bubbles: true }));
    } catch (err) {
      console.error(`[contenus] Projet "${id}" : impossible de charger les données :`, err);
    }
  }

  /* ---------------------------------------------------------
     Portrait(s) de personne(s) (data-personne="id" ou "id1, id2")
     --------------------------------------------------------- */

  async function construirePersonne(zone) {
    const ids = String(zone.dataset.personne || "").split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const [personnes] = await Promise.all([charger("personnes", "#" + ids.join(",")), chargerCategories()]);
      const parId = new Map(personnes.filter(publie).map((p) => [p.id, p]));
      const choisies = ids.map((id) => {
        if (!parId.has(id)) console.error(`[contenus] Personne : "${id}" introuvable dans data/contenus/personnes.json`);
        return parId.get(id);
      }).filter(Boolean);
      if (!choisies.length) return;

      const liens = await chargerLiensPersonnes(choisies);
      const portraits = choisies.map((p) => htmlPortrait(p, liens)).join("")
        .replace(choisies.length === 1 ? "" : /<div class="fiche__blocs-emplacement" data-emplacement-blocs><\/div>/g, "");

      // Volet : même générateur que pour les projets (menu "a-propos" par défaut)
      const idVolet = zone.dataset.volet === undefined ? "a-propos" : zone.dataset.volet;
      const volet = idVolet && idVolet !== "aucun"
        ? await htmlVolet(idVolet, { actif: zone.dataset.voletActif, titre: zone.dataset.voletTitre })
        : "";

      // Une seule personne (sa page) : ses blocs dans le portrait
      const zoneBlocs = choisies.length === 1 ? retenirBlocs(zone, `personne:${choisies[0].id}`) : null;
      zone.innerHTML = volet
        ? `<div class="volet-grille"><div class="volet-principal">${portraits}</div>${volet}</div>`
        : portraits;
      placerBlocs(zone, zoneBlocs);
      zone.setAttribute("aria-busy", "false");
      brancherPagination(zone);
      zone.dispatchEvent(new CustomEvent("contenus:fiche", { bubbles: true }));
    } catch (err) {
      console.error(`[contenus] Personne "${ids.join(", ")}" : impossible de charger les données :`, err);
    }
  }

  /* ---------------------------------------------------------
     Section partenaires (data-partenaires)
     Mêmes cartes que dans les fiches projet (htmlPartenaires),
     un bloc par catégorie de partenaires.json.
     --------------------------------------------------------- */

  async function construirePartenaires(zone) {
    const filtre = String(zone.dataset.partenaires || "").split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const choixDep = String(zone.dataset.membres || "").trim();
      const [donnees, personnes] = await Promise.all([
        charger("partenaires"),
        // Membres : les personnes choisies, sinon les champs des pastilles de toutes
        choixDep === "aucun" ? Promise.resolve([])
          : charger("personnes", choixDep ? "#" + choixDep.split(",").map((x) => x.trim()).join(",")
            : "~id,nom,image,imageAlt,fonction,lien,publie,nouvelOnglet,langue,traductions.nom,traductions.fonction,traductions.lien,@image1").catch(() => []),
        chargerCategories(),
      ]);
      const categories = (Array.isArray(donnees.categories) ? donnees.categories : [])
        .filter((c) => !filtre.length || filtre.includes(c.id));
      filtre.filter((id) => !categories.some((c) => c.id === id)).forEach((id) => {
        console.warn(`[contenus] Partenaires : catégorie "${id}" introuvable dans data/contenus/partenaires.json`);
      });

      // Gestionnaire, mode édition : « + Ajouter un partenaire » dans chaque
      // catégorie, modifier / supprimer sur chaque logo, partenaires masqués visibles
      const gestion = dansGestionnaire() && zone.dataset.isciEdition === "1";
      const blocs = categories.map((c) => {
        const membres = (Array.isArray(donnees[c.id]) ? donnees[c.id] : []).filter((p) => gestion || publie(p));
        return htmlBlocProjet(c.titre, `partenaires partenaires__groupe`, htmlPartenaires(membres, { categorie: false, gestion: gestion ? c.id : null }));
      }).join("") || (gestion ? htmlBlocProjet(t("Partenaires"), "partenaires partenaires__groupe", htmlPartenaires([], { gestion: "" })) : "");

      // --- Membres : pastilles rondes (même rendu que l'équipe d'un projet) ---
      const choixMembres = String(zone.dataset.membres || "").trim();
      let membres = [];
      if (choixMembres !== "aucun") {
        const toutes = personnes.filter((p) => gestion || publie(p));
        if (choixMembres) {
          const parId = new Map(toutes.map((p) => [p.id, p]));
          membres = choixMembres.split(",").map((t) => t.trim()).filter(Boolean).map((id) => {
            if (!parId.has(id)) console.warn(`[contenus] Membres : "${id}" introuvable dans data/contenus/personnes.json`);
            return parId.get(id);
          }).filter(Boolean);
        } else {
          membres = toutes;
        }
      }
      const limitesMembres = gestion ? { grand: 9999, mobile: 9999 } : {
        grand: parseInt(zone.dataset.limitMembres, 10) || 9999,
        mobile: parseInt(zone.dataset.limitMembresMobile, 10) || parseInt(zone.dataset.limitMembres, 10) || 9999,
      };
      const blocMembres = htmlBlocProjet(zone.dataset.titreMembres || t("Membres"), "equipe partenaires__membres",
        htmlEquipe(membres, limitesMembres, { gestion: gestion && choixMembres !== "aucun" }));

      const idTitre = `partenaires-${++compteurVolets}-titre`;
      // data-titre="aucun" (bloc du gestionnaire) : pas de titre affiché
      const sansTitre = zone.dataset.titre === "aucun";
      const contenu = `
        <section class="partenaires" ${sansTitre ? `aria-label="${esc(t("Membres et partenaires"))}"` : `aria-labelledby="${idTitre}"`}>
          ${sansTitre ? "" : `<h2 id="${idTitre}" class="projet__titre partenaires__titre">${esc(zone.dataset.titre || t("Nos membres et partenaires"))}</h2>`}
          ${blocMembres}
          ${blocs || (blocMembres ? "" : `<p class="categorie__vide">${esc(t("Aucun membre ni partenaire pour le moment."))}</p>`)}
        </section>`;

      const idVolet = voletBloc(zone, zone.dataset.volet === undefined ? "membres-partenaires" : zone.dataset.volet);
      const volet = idVolet && idVolet !== "aucun"
        ? await htmlVolet(idVolet, { actif: zone.dataset.voletActif, titre: zone.dataset.voletTitre })
        : "";

      zone.innerHTML = volet
        ? `<div class="volet-grille"><div class="volet-principal">${contenu}</div>${volet}</div>`
        : contenu;
      zone.setAttribute("aria-busy", "false");
      brancherAfficherPlus(zone);
    } catch (err) {
      console.error("[contenus] Partenaires : impossible de charger data/contenus/partenaires.json :", err);
    }
  }

  /* ---------------------------------------------------------
     Liste d'une catégorie (data-categorie="id-navigation")
     --------------------------------------------------------- */

  const SOURCES_CATEGORIE = ["actualites", "publications"];

  // Carte horizontale : image, catégorie (ou type) · date, titre, extrait
  function carteListe(item) {
    const estPublication = item._source === "publications";
    const meta = [estPublication ? (item.type ? `<span class="type-publication">${esc(item.type)}</span>` : "") : esc(titreCategorie(item.categorie)), esc(formaterDate(item.date))]
      .filter(Boolean).join(" · ");
    const desc = resumeDe(item);
    return `
      <article class="liste-cat__item liste-cat__item--${esc(item._source)}">
        <a class="liste-cat__lien" href="${esc(item.lien || "#")}"${cible(item)}>
          <div class="liste-cat__image${sansImage(item)}">
            ${imageCarte(item)}
          </div>
          <div class="liste-cat__corps">
            ${meta ? `<span class="pt-meta">${meta}</span>` : ""}
            <h3 class="liste-cat__titre">${esc(item.titre)}</h3>
            ${item.auteurs ? `<p class="liste-cat__auteurs">${esc(item.auteurs)}</p>` : ""}
            ${desc ? `<p class="liste-cat__desc">${esc(desc)}</p>` : ""}
            <span class="pt-projet__plus">${esc(t(estPublication ? "Lire la publication" : "Lire la suite"))}</span>
          </div>
        </a>
      </article>`;
  }

  async function construireCategorie(zone) {
    const idCat = zone.dataset.categorie;
    const sources = zone.dataset.sources
      ? zone.dataset.sources.split(",").map((t) => t.trim()).filter(Boolean)
      : SOURCES_CATEGORIE;
    try {
      const [nav, ...reste] = await Promise.all([
        charger("structure/navigation"),
        ...sources.map((src) => charger(src, false).catch((err) => {
          console.warn(`[contenus] Catégorie : data/contenus/${src}.json ignoré :`, err);
          return [];
        })),
        chargerCategories(),
      ]);
      const listes = reste.slice(0, sources.length);

      // Catégorie du menu -> elle-même + ses sous-menus ; sous-menu -> lui seul
      const menu = (nav.menu || []).filter(publie);
      const catMenu = menu.find((c) => c.id === idCat);
      const ids = new Set([idCat, ...(catMenu ? (catMenu.sousMenu || []).map((s) => s.id) : [])]);
      if (!catMenu && !menu.some((c) => (c.sousMenu || []).some((s) => s.id === idCat))) {
        console.warn(`[contenus] Catégorie : "${idCat}" introuvable dans data/structure/navigation.json`);
      }

      sources.forEach((src) => dependre(src, "@categorie:" + [...ids].join(",")));
      const elements = trierParDate(sources.flatMap((src, i) =>
        (Array.isArray(listes[i]) ? listes[i] : [])
          .filter((el) => publie(el) && dansCategories(el, ids))
          .map((el) => ({ ...el, _source: src }))
      ));

      const pas = limiteDe(zone.dataset.limit, 4);
      // data-titre="aucun" (blocs du gestionnaire) : pas de titre affiché
      const sansTitre = zone.dataset.titre === "aucun";
      const titre = zone.dataset.titre || titreCategorie(idCat) || idCat;
      const idTitre = `categorie-${esc(idCat)}-titre`;

      const idVolet = voletBloc(zone, zone.dataset.volet === undefined ? idCat : zone.dataset.volet);
      const volet = idVolet && idVolet !== "aucun"
        ? await htmlVolet(idVolet, { actif: zone.dataset.voletActif, titre: zone.dataset.voletTitre })
        : "";

      const contenu = `
        <section class="categorie" ${sansTitre ? `aria-label="${esc(titreCategorie(idCat) || idCat)}"` : `aria-labelledby="${idTitre}"`}>
          ${sansTitre ? "" : `<h2 id="${idTitre}" class="projet__titre categorie__titre">${esc(titre)}</h2>`}
          ${elements.length
            ? `<div class="liste-cat" data-pagine-pas="${pas}">${elements.map(carteListe).join("")}</div>`
            : `<p class="categorie__vide">${esc(t("Aucun contenu pour le moment."))}</p>`}
        </section>`;

      zone.innerHTML = volet
        ? `<div class="volet-grille"><div class="volet-principal">${contenu}</div>${volet}</div>`
        : contenu;
      zone.setAttribute("aria-busy", "false");
      brancherPagination(zone);
    } catch (err) {
      console.error(`[contenus] Catégorie "${idCat}" : impossible de charger les données :`, err);
    }
  }

  /* ---------------------------------------------------------
     Personnes et projets d'une page créée dans le gestionnaire
     ---------------------------------------------------------
     <div data-page-liens data-liens-personnes="id1, id2" data-liens-projets="id"
          data-liens-partenaires="id">
     (pas data-projets : réservé à la section « Tous les projets »)
     Affiche les personnes (pastilles, comme l'équipe d'un projet),
     les projets (cartes) et les partenaires (logos) liés à la page, à partir des données : un
     nom, une photo ou un projet modifié est donc toujours à jour.
     --------------------------------------------------------- */

  // Zone des personnes / projets / partenaires d'une page créée (hors bloc
  // « Liens ») ; créée après les blocs si la page n'en a pas encore
  // Zones qui affichent les personnes / projets / partenaires de la page :
  // blocs « Personnes, projets et partenaires » reliés à la page
  // (data-liens-page) et, pour les pages générées avant ces blocs, la
  // section placée après les blocs
  const zonesLiensPage = () => [...document.querySelectorAll("[data-page-liens]")].filter((z) => z.hasAttribute("data-liens-page") || !z.closest(".bloc"));

  // Page créée affichée : ses liens (données enregistrées, ou en cours
  // de modification dans le gestionnaire) ; modifiable = cartes « + Ajouter »
  let PAGE_COURANTE = null;

  async function construireLiensPage(zone, options = {}) {
    // Page en cours de modification dans le gestionnaire : le mode est retenu
    // sur la zone (un affichage lancé plus tôt ne doit pas l'annuler)
    if (options.edition !== undefined) zone.dataset.isciEdition = options.edition ? "1" : "0";
    const reliee = zone.hasAttribute("data-liens-page");
    if (reliee && PAGE_COURANTE) ["personnes", "projets", "partenaires"].forEach((k) => {
      zone.dataset["liens" + k[0].toUpperCase() + k.slice(1)] = (PAGE_COURANTE[k] || []).join(", ");
    });
    const edition = FICHES_EDITION && (zone.dataset.isciEdition === "1" || (reliee && !!(PAGE_COURANTE && PAGE_COURANTE.modifiable)));
    // Seul le dernier affichage demandé est appliqué
    const jeton = (zone.__rendu = (zone.__rendu || 0) + 1);
    const ids = (attr) => (zone.dataset[attr] || "").split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const [personnes, projets, partenaires] = await Promise.all([
        charger("personnes", "#" + ids("liensPersonnes").join(",")).catch(() => []),
        charger("projets", "#" + ids("liensProjets").join(",")).catch(() => []),
        charger("partenaires", "#" + ids("liensPartenaires").join(",")).catch(() => ({})),
      ]);
      const choisir = (liste, voulus) => {
        const parId = new Map(liste.filter(publie).map((o) => [o.id, o]));
        return voulus.map((id) => parId.get(id)).filter(Boolean);
      };
      const pers = choisir(personnes, ids("liensPersonnes"));
      const projs = choisir(projets, ids("liensProjets"));
      const indexPart = indexerPartenaires(partenaires);
      const parts = ids("liensPartenaires").map((id) => indexPart.get(id)).filter((p) => p && publie(p));
      if (jeton !== zone.__rendu) return;
      const cartesProjets = edition
        ? boutonAjout("projets", "+ Ajouter un projet") + projs.map((it) => marquerCarte(carteProjet(it), it, "projets").replace("Retirer du profil", "Retirer de la page")).join("")
        : projs.map(carteProjet).join("");
      zone.innerHTML =
        htmlBlocProjet(t("Personnes"), "equipe", htmlEquipe(pers, edition ? { grand: 999, mobile: 999 } : { grand: 5, mobile: 6 }, { edition })) +
        htmlBlocProjet(t("Projets"), "projets",
          cartesProjets ? `<div class="pt-grille pt-grille--projets">${cartesProjets}</div>` : "") +
        htmlBlocProjet(t("Partenaires"), "partenaires", htmlPartenaires(parts, { edition }));
      zone.setAttribute("aria-busy", "false");
      brancherAfficherPlus(zone);
      // Bloc sans personne, projet ni partenaire : section masquée sur le site
      const sectionBlocLiens = zone.closest(".bloc-liens");
      if (sectionBlocLiens) masquerBlocVide(sectionBlocLiens, !edition && !zone.innerHTML.trim());
      if (edition) zone.dispatchEvent(new CustomEvent("contenus:fiche", { bubbles: true }));
    } catch (err) {
      console.error("[contenus] Personnes et projets de la page :", err);
    }
  }

  /* ---------------------------------------------------------
     Tous les projets (data-projets)
     ---------------------------------------------------------
     Cartes des projets de projets.json, filtrables par pays,
     avec l'équipe (pastilles) et le nombre de contenus liés.
     --------------------------------------------------------- */

  function carteProjetListe(projet, personnes, nbPubs, nbActus) {
    const desc = resumeDe(projet);
    const pays = (projet.pays || []).map((p) => `<span class="pj-carte__pays">${esc(nomPays(p))}</span>`).join("");
    const equipe = personnes.slice(0, 4).map((p) => p.image
      ? `<img class="pj-carte__avatar" src="${url(p.image)}" alt="" title="${esc(p.nom)}" loading="lazy">`
      : `<span class="pj-carte__avatar pj-carte__avatar--initiales" title="${esc(p.nom)}">${esc(initiales(p.nom))}</span>`).join("");
    const reste = personnes.length > 4 ? `<span class="pj-carte__avatar pj-carte__avatar--reste">+${personnes.length - 4}</span>` : "";
    const stats = [
      personnes.length ? `${personnes.length} membre${personnes.length > 1 ? "s" : ""}` : "",
      nbPubs ? `${nbPubs} publication${nbPubs > 1 ? "s" : ""}` : "",
      nbActus ? `${nbActus} actualité${nbActus > 1 ? "s" : ""}` : "",
    ].filter(Boolean).join(" · ");

    return `
      <article class="pj-carte" data-pays="${esc((projet.pays || []).join(" "))}">
        <a class="pj-carte__lien" href="${esc(projet.lien || "#")}"${cible(projet)}>
          <div class="pj-carte__image${sansImage(projet)}">
            ${imageCarte(projet)}
            ${pays ? `<div class="pj-carte__tags">${pays}</div>` : ""}
          </div>
          <div class="pj-carte__corps">
            <h3 class="pj-carte__titre">${esc(projet.titre)}</h3>
            ${desc ? `<p class="pj-carte__desc">${esc(desc)}</p>` : ""}
            ${equipe || stats ? `<div class="pj-carte__pied">
              ${equipe ? `<span class="pj-carte__equipe" aria-hidden="true">${equipe}${reste}</span>` : ""}
              ${stats ? `<span class="pj-carte__stats">${stats}</span>` : ""}
            </div>` : ""}
            <span class="pj-carte__plus">${esc(t("En savoir plus"))}</span>
          </div>
        </a>
      </article>`;
  }

  // Filtres par pays et « Afficher plus » de la liste des projets
  function brancherFiltresProjets(zone, pas = limiteDe(zone.dataset.limit, 6)) {
      const grille = zone.querySelector(".pj-grille");
      if (!grille) return;
      const toutes = [...grille.children];

      // Affiche les cartes du pays choisi, puis « Afficher plus » par lots
      const appliquer = (pays) => {
        const suivant = grille.nextElementSibling;
        if (suivant && suivant.classList.contains("bouton-plus")) suivant.remove();
        grille.replaceChildren(...toutes.filter((c) => !pays || c.dataset.pays.split(" ").includes(pays)));
        grille.querySelectorAll(":scope > [hidden]").forEach((c) => { c.hidden = false; });
        paginer(grille, pas, t("Afficher plus"), pas);
      };
      appliquer("");

      zone.querySelectorAll(".pj-filtre").forEach((btn) => {
        btn.addEventListener("click", () => {
          zone.querySelectorAll(".pj-filtre").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
          appliquer(btn.dataset.filtre);
        });
      });
  }

  async function construireProjets(zone) {
    try {
      const [projets, personnes, publications, actualites] = await Promise.all([
        charger("projets"),
        charger("personnes", CHAMPS_LIEN).catch(() => []),
        charger("publications", "~id,projets,publie").catch(() => []),
        charger("actualites", "~id,projets,publie,groupe,langue,traductions.titre").catch(() => []),
        chargerCategories(),
      ]);

      const filtrePays = (zone.dataset.pays || "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
      const liste = projets.filter(publie).filter((p) =>
        !filtrePays.length || (p.pays || []).some((x) => filtrePays.includes(String(x).toLowerCase())));

      const parId = new Map(personnes.filter(publie).map((p) => [p.id, p]));
      const compter = (elements, id) => elements.filter((el) => publie(el) && Array.isArray(el.projets) && el.projets.includes(id)).length;
      const cartes = liste.map((p) => carteProjetListe(
        p,
        [...new Set(p.personnes || [])].map((id) => parId.get(id)).filter(Boolean),
        compter(publications, p.id),
        compter(actualites, p.id),
      ));

      // Pays présents, dans l'ordre d'apparition, avec leur nombre de projets
      const compteurs = new Map();
      liste.forEach((p) => (p.pays || []).forEach((x) => compteurs.set(x, (compteurs.get(x) || 0) + 1)));
      const avecFiltre = zone.dataset.filtres !== "non" && compteurs.size > 1;

      const pas = limiteDe(zone.dataset.limit, 6);
      const idTitre = `projets-${++compteurVolets}-titre`;
      // data-titre="aucun" (bloc du gestionnaire) : pas de titre (bloc « Titre » à part)
      const sansTitre = zone.dataset.titre === "aucun";
      const titre = zone.dataset.titre || t("Les projets de la Chaire");

      const filtres = avecFiltre ? `
        <div class="pj-filtres" role="group" aria-label="${esc(t("Filtrer par pays"))}">
          <button type="button" class="pj-filtre" data-filtre="" aria-pressed="true">${esc(t("Tous"))} <span>${liste.length}</span></button>
          ${[...compteurs].map(([x, n]) => `<button type="button" class="pj-filtre" data-filtre="${esc(x)}" aria-pressed="false">${esc(nomPays(x))} <span>${n}</span></button>`).join("")}
        </div>` : "";

      const contenu = `
        <section class="projets-liste" ${sansTitre ? `aria-label="${esc(t("Projets"))}"` : `aria-labelledby="${idTitre}"`}>
          ${sansTitre ? "" : `<h2 id="${idTitre}" class="projet__titre projets-liste__titre">${esc(titre)}</h2>`}
          ${filtres}
          ${liste.length
            ? `<div class="pj-grille">${cartes.join("")}</div>`
            : `<p class="categorie__vide">${esc(t("Aucun projet pour le moment."))}</p>`}
        </section>`;

      const idVolet = voletBloc(zone, zone.dataset.volet);
      const volet = idVolet && idVolet !== "aucun"
        ? await htmlVolet(idVolet, { actif: zone.dataset.voletActif, titre: zone.dataset.voletTitre })
        : "";
      zone.innerHTML = volet
        ? `<div class="volet-grille"><div class="volet-principal">${contenu}</div>${volet}</div>`
        : contenu;
      zone.setAttribute("aria-busy", "false");

      brancherFiltresProjets(zone, pas);
    } catch (err) {
      console.error("[contenus] Tous les projets : impossible de charger les données :", err);
    }
  }

  /* ---------------------------------------------------------
     Chargement (avec cache : un fichier n'est lu qu'une fois
     même s'il alimente plusieurs blocs de la page)
     --------------------------------------------------------- */

  const cache = {};

  /* ---------------------------------------------------------
     Textes alternatifs des images (data/structure/images.json,
     tenu par le gestionnaire d'images)
     ---------------------------------------------------------
     altDe(item)     : texte alternatif de l'image de l'élément
                       (répertoire des images, sinon "imageAlt" de
                       l'élément, sinon le texte par défaut)
     legendeDe(item) : <figcaption class="legende"> si l'élément a
                       "imageLegende": true et que l'image a un texte
                       alternatif ; "" sinon
     --------------------------------------------------------- */

  const ALTS = new Map();

  function cheminImage(v) {
    let c = String(v || "").trim().replace(/^\.?\//, "");
    try { c = decodeURI(c); } catch (e) { /* déjà décodé */ }
    return c;
  }

  function chargerAlts() {
    return charger("structure/images")
      .then((liste) => (Array.isArray(liste) ? liste : []).forEach((im) => {
        if (im && im.chemin && im.alt) ALTS.set(cheminImage(im.chemin), im.alt);
      }))
      .catch(() => { /* pas de répertoire d'images : textes des éléments */ });
  }

  function altDe(item, defaut = "", cle = "image") {
    if (!item) return defaut;
    return ALTS.get(cheminImage(item[cle])) || item[cle + "Alt"] || defaut;
  }

  function legendeDe(item, cle = "image") {
    if (!item || item[cle + "Legende"] !== true || !item[cle]) return "";
    const texte = ALTS.get(cheminImage(item[cle])) || item[cle + "Alt"];
    return texte ? `<figcaption class="legende">${esc(texte)}</figcaption>` : "";
  }

  // Données brutes du fichier (toutes langues)
  function chargerBrut(source) {
    if (!cache[source]) {
      // "structure/navigation" -> data/structure/navigation.json
      // "projets"              -> data/contenus/projets.json
      const chemin = source.includes("/") ? source : DOSSIER_CONTENUS + source;
      cache[source] = fetch(`${DOSSIER_DATA}${chemin}.json`, { cache: "no-cache" })
        .then((rep) => {
          if (!rep.ok) throw new Error(`HTTP ${rep.status}`);
          return rep.json();
        });
    }
    return cache[source];
  }

  // Projets et personnes sans image d'aperçu : la première image de leur
  // page (blocs « Image », « Texte et image ») sert d'image (cartes, listes,
  // carrousel), comme dans les réglages du gestionnaire (« automatique »)
  function premiereImageBlocs(blocs) {
    for (const b of Array.isArray(blocs) ? blocs : []) {
      if (b && b.publie !== false && (b.type === "image" || b.type === "texte-image") && b.image) return b;
    }
    return null;
  }
  function imagesParDefaut(source, d) {
    if ((source !== "projets" && source !== "personnes") || !Array.isArray(d)) return d;
    return d.map((o) => {
      if (!o || o.image) return o;
      const b = premiereImageBlocs(o.blocs);
      return b ? { ...o, image: b.image, ...(b.imageLegende ? { imageLegende: true } : {}), imageAuto: true } : o;
    });
  }

  // Données dans la langue de la page (voir SITE MULTILINGUE)
  const localises = new Map();   // source -> { brut, promesse }
  // sel : partie des données dont dépend la page (export statique) :
  //   "#id1,id2" ces éléments ; "@champ:v1,v2" les éléments dont le champ
  //   contient l'une des valeurs ; "~champ1,champ2" ces champs de tous les
  //   éléments ; false : rien (dependre() est appelé ensuite) ; absent : tout
  function dependre(source, sel) {
    if (EXPORT) DEPENDANCES.add(sel ? `${source}|${sel}` : source);
  }
  const CHAMPS_LIEN = "~id,titre,nom,lien,slug,categorie,groupe,pays,publie,nouvelOnglet,langue,traductions.titre,traductions.nom,traductions.slug,traductions.lien";
  function charger(source, sel) {
    if (sel !== false) dependre(source, sel);
    const brut = chargerBrut(source);
    const connu = localises.get(source);
    if (connu && connu.brut === brut) return connu.promesse;
    const promesse = determinerLangue().then(() => brut).then((d) => localiser(source, d)).then((d) => imagesParDefaut(source, d));
    localises.set(source, { brut, promesse });
    return promesse;
  }

  async function remplir(conteneur) {
    const source = conteneur.dataset.source;
    const rendu = RENDUS[source];
    const limite = limiteDe(conteneur.dataset.limit, Infinity);
    // data-limit-mobile (optionnel) : autre nombre sur téléphone (< 600 px)
    const limiteMobile = conteneur.dataset.limitMobile ? limiteDe(conteneur.dataset.limitMobile, limite) : limite;

    if (!rendu) {
      console.warn(`[contenus] Aucun gabarit défini pour "${source}".`);
      return;
    }

    try {
      const [donnees] = await Promise.all([charger(source), chargerCategories()]);

      const items = [...donnees]
        .filter((item) => item.publie !== false)          // "publie": false = brouillon masqué
        .sort((a, b) => String(b.date).localeCompare(String(a.date)))
        .slice(0, Math.max(limite, limiteMobile));

      conteneur.innerHTML = items.map((item, i) => rendu(item, i)).join("");
      // Éléments en trop selon l'écran : masqués par le CSS
      if (limiteMobile !== limite) {
        [...conteneur.children].forEach((el, i) => {
          el.classList.toggle("contenus-hors-mobile", i >= limiteMobile);
          el.classList.toggle("contenus-hors-ordinateur", i >= limite);
        });
      }
      conteneur.setAttribute("aria-busy", "false");
      conteneur.dispatchEvent(new CustomEvent("contenus:charges", { detail: { source, items } }));
    } catch (err) {
      console.error(`[contenus] Impossible de charger data/contenus/${source}.json :`, err);
      if (location.protocol === "file:") {
        console.error("[contenus] La page est ouverte en file:// — lancez un serveur local (ex. extension Live Server, ou `python -m http.server`).");
      }
      // En cas d'erreur, on laisse le contenu HTML de secours déjà présent.
    }
  }

  /* ---------------------------------------------------------
     BLOCS DE CONTENU (pages composées dans le gestionnaire)
     ---------------------------------------------------------
     <div class="blocs" data-blocs="CLE"></div> est rempli avec les
     blocs (sections) enregistrés par le gestionnaire :
       data-blocs="accueil"          data/structure/accueil.json, "blocs"
       data-blocs="page:ID"          data/structure/pages-creees.json
       data-blocs="personne:ID"      data/contenus/personnes.json
       data-blocs="projet:ID"        data/contenus/projets.json
     Chaque bloc est un objet { "type": "...", ...réglages } ; les
     types (gabarits) sont décrits dans BLOCS ci-dessous :
       texte, texte-image, image, bouton, citation, focus, html (contenu saisi) ;
       carrousel, actualites, publications, agenda, membres-partenaires,
       categorie, projets, liste, liens (données du site).
     "publie": false masque un bloc sans le supprimer.
     Aperçu du gestionnaire : les blocs en cours de modification sont
     reçus par postMessage ({ type: "isci-blocs", cle, blocs }) et
     affichés aussitôt, sans enregistrer.
     --------------------------------------------------------- */

  // Texte saisi -> HTML : **gras**, *italique*, [texte](adresse),
  // retours à la ligne (Ctrl + Entrée dans le gestionnaire) -> <br>
  function texteEnLigne(t) {
    return esc(String(t ?? "").replace(/\r/g, "").replace(/^\n+|\n+$/g, ""))
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<em>$2</em>")
      .replace(/(^|[^\w/])__(?=\S)(.+?)__(?![\w])/g, "$1<u>$2</u>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, texte, adresse) => {
        if (/^\s*javascript:/i.test(adresse)) adresse = "#";
        const externe = /^https?:/i.test(adresse);
        return `<a href="${adresse}"${externe ? ' target="_blank" rel="noopener"' : ""}>${texte}</a>`;
      })
      .replace(/\n/g, "<br>");
  }

  // Paragraphes : « ### Titre » = sous-titre ; lignes « - … » = liste
  function texteRiche(paragraphes) {
    return (Array.isArray(paragraphes) ? paragraphes : [paragraphes]).filter(Boolean).map((p) => {
      const t = String(p).trim();
      if (t.startsWith("### ")) return `<h3>${texteEnLigne(t.slice(4))}</h3>`;
      const lignes = t.split(/\n/);
      if (lignes.every((l) => /^\s*[-•]\s+/.test(l))) {
        return `<ul>${lignes.map((l) => `<li>${texteEnLigne(l.replace(/^\s*[-•]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      return `<p>${lignes.map(texteEnLigne).join("<br>")}</p>`;
    }).join("");
  }

  const aDuTexte = (p) => (Array.isArray(p) ? p : [p]).some((x) => x && String(x).trim());

  const FONDS_BLOCS = { gris: "bloc--gris", sombre: "site-section--dark" };

  function sectionBloc(b, classes, contenu, attributs = "") {
    return `<section class="site-section ${FONDS_BLOCS[b.fond] || ""} ${classes}"${attributs}>
      <div class="site-section__container">${contenu}</div>
    </section>`;
  }

  function enteteBloc(b, idTitre = "") {
    if (!b.titre && !b.description) return "";
    return `<header class="site-section__header">
      ${b.titre ? `<h2${idTitre ? ` id="${idTitre}"` : ""} class="site-section__title">${texteEnLigne(b.titre)}</h2><span class="site-section__line"></span>` : ""}
      ${b.description ? `<p class="site-section__desc">${texteEnLigne(b.description)}</p>` : ""}
    </header>`;
  }

  function boutonBloc(b) {
    if (!b.boutonTexte) return "";
    return `<div class="site-section__action">
      <a href="${esc(b.boutonLien || "#")}" class="site-button"${b.boutonNouvelOnglet ? ' target="_blank" rel="noopener"' : ""}>
        <span class="site-button__plus">+</span><span>${esc(b.boutonTexte)}</span>
      </a>
    </div>`;
  }

  function figureBloc(b, classe, ctx = {}) {
    // Aperçu du gestionnaire : emplacement cliquable tant qu'il n'y a pas d'image
    if (!b.image && ctx.edition) return `<figure class="${classe}"><div class="isci-image-vide" style="display:grid;place-items:center;min-height:220px;background:#eef0f6;color:#6b6f85;font:600 14px/1.4 Roboto,Arial,sans-serif;text-align:center;padding:20px">Cliquer pour choisir une image</div></figure>`;
    if (!b.image) return "";
    return `<figure class="${classe}"><img src="${url(b.image)}" alt="${esc(altDe(b))}" loading="lazy">${legendeDe(b)}</figure>`;
  }

  const attrBloc = (nom, valeur) => (valeur === undefined || valeur === null || valeur === "" ? "" : ` ${nom}="${esc(String(valeur))}"`);
  const listeIds = (v) => (Array.isArray(v) ? v.join(", ") : v || "");

  // Niveau d'un bloc « Titre » : h2 à h6 (h1 = titre de la page)
  const niveauTitre = (b) => Math.min(6, Math.max(2, parseInt(b.niveau, 10) || 2));

  // Anciennes données : titre du bloc Texte et bouton intégré à un bloc
  // affichés comme des blocs « Titre » et « Bouton » séparés (le gestionnaire
  // fait la même séparation dans les fichiers). Renvoie [bloc, index d'origine].
  function blocsSepares(blocs) {
    return (blocs || []).flatMap((b, i) => {
      if (!b || typeof b !== "object") return [];
      const commun = { ...(b.fond ? { fond: b.fond } : {}), ...(b.publie === false ? { publie: false } : {}) };
      const res = [];
      let bloc = b;
      // Titre de section d'un bloc -> bloc « Titre » (à gauche pour un texte
      // ou les projets, centré avec son trait pour les autres)
      const titreProjets = b.type === "projets" && b.titre !== "aucun" ? (b.titre || t("Les projets de la Chaire")) : "";
      if (b.type !== "titre" && (b.titre || titreProjets)) {
        const centre = !["texte", "projets"].includes(b.type);
        res.push([{ type: "titre", texte: titreProjets || b.titre, niveau: 2, ...(centre ? { alignement: "centre" } : {}), ...commun }, i]);
        bloc = { ...bloc };
        delete bloc.titre;
      }
      res.push([bloc, i]);
      if (b.type !== "bouton" && b.boutonTexte) {
        const { boutonTexte, boutonLien, boutonNouvelOnglet, ...reste } = bloc;
        res[res.length - 1] = [reste, i];
        res.push([{ type: "bouton", boutonTexte, boutonLien, ...(boutonNouvelOnglet ? { boutonNouvelOnglet } : {}), ...commun }, i]);
      }
      return res;
    });
  }

  const BLOCS = {
    // --- Contenu saisi ---
    // Titre, texte ou citation vides : rien sur le site ; dans l'aperçu du
    // gestionnaire, zone vide où s'affiche un texte indicatif en gris clair
    "titre": (b, ctx = {}) => {
      if (!String(b.texte || "").trim() && !ctx.edition) return "";
      const n = niveauTitre(b);
      const centre = b.alignement === "centre";
      return sectionBloc(b, "bloc-titre" + (centre ? " bloc-titre--centre" : ""),
        `<h${n} class="bloc-titre__texte bloc-titre__texte--h${n}">${texteEnLigne(b.texte || "")}</h${n}>${centre ? '<span class="site-section__line"></span>' : ""}`);
    },

    "texte": (b, ctx = {}) => !aDuTexte(b.paragraphes) && !ctx.edition ? "" : sectionBloc(b, "bloc-texte",
      `<div class="bloc-texte__contenu">${texteRiche(b.paragraphes)}</div>`),

    "texte-image": (b, ctx) => sectionBloc(b, "bloc-texte-image" + (b.position === "droite" ? " bloc-texte-image--droite" : ""),
      `${enteteBloc(b)}<div class="bloc-texte-image__grille">
        ${figureBloc(b, "bloc-texte-image__image", ctx)}
        <div class="bloc-texte-image__texte bloc-texte__contenu">${texteRiche(b.paragraphes)}</div>
      </div>`),

    // Largeur : 100 % du contenu (défaut), 75, 50 ou 25 % (centrée)
    "image": (b, ctx) => sectionBloc(b, "bloc-image" + (["75", "50", "25"].includes(String(b.largeur)) ? ` bloc-image--${b.largeur}` : ""), figureBloc(b, "bloc-image__figure", ctx)),

    "bouton": (b) => sectionBloc(b, "bloc-bouton", boutonBloc(b)),

    // Citation : texte (paragraphes) et, dessous, auteur et précision
    // (fonction, ouvrage, date…). Aperçu du gestionnaire : auteur et
    // précision toujours présents (vides) pour être saisis sur place.
    "citation": (b, ctx = {}) => {
      const auteur = String(b.auteur || "").trim();
      if (!aDuTexte(b.paragraphes) && !auteur && !ctx.edition) return "";
      const precision = String(b.precision || "").trim();
      const pied = auteur || precision || ctx.edition
        ? `<footer class="bloc-citation__source">
            ${auteur || ctx.edition ? `<span class="bloc-citation__auteur">${esc(auteur)}</span>` : ""}
            ${precision || ctx.edition ? `<span class="bloc-citation__precision">${esc(precision)}</span>` : ""}
          </footer>` : "";
      return sectionBloc(b, "bloc-citation",
        `<figure class="bloc-citation__figure">
          <blockquote class="bloc-citation__texte bloc-texte__contenu">${texteRiche(b.paragraphes)}</blockquote>
          ${pied}
        </figure>`);
    },

    "focus": (b) => sectionBloc(b, "focus-section", `${enteteBloc(b)}
      <div class="focus-grid">${(b.elements || []).map((x, i) => [x, i]).filter(([x]) => x && (x.icone || x.texte)).map(([x, i]) => `
        <article class="focus-item" data-element="${i}">
          ${x.icone ? `<div class="focus-icon"><img src="${url(x.icone)}" alt="${esc(altDe(x, "", "icone"))}"></div>` : ""}
          ${x.texte ? `<h4>${esc(x.texte)}</h4>` : ""}
        </article>`).join("")}
      </div>`),

    "html": (b) => String(b.html || ""),

    // --- Données du site ---
    "carrousel": (b) => `<section class="hero" aria-label="${esc(t("Dernières actualités"))}" data-carrousel>
      <div${b.fleches ? "" : ' style="display: none;"'}>
        <button class="hero-arrow hero-arrow--prev" type="button" aria-label="${esc(t("Actualité précédente"))}">&#10094;</button>
        <button class="hero-arrow hero-arrow--next" type="button" aria-label="${esc(t("Actualité suivante"))}">&#10095;</button>
      </div>
      <div class="hero-dots" role="tablist" aria-label="${esc(t("Choisir une actualité"))}"></div>
    </section>`,

    "actualites": (b) => sectionBloc(b, "news-section",
      `${enteteBloc(b)}<div class="news-grid" data-source="actualites"${attrBloc("data-limit", b.nombre || 5)} aria-busy="true"></div>`),

    "publications": (b) => sectionBloc(b, "publications",
      `${enteteBloc(b)}<div class="publications-grid" data-source="publications"${attrBloc("data-limit", b.nombre || 5)}${attrBloc("data-limit-mobile", b.nombreMobile)} aria-busy="true"></div>`),

    "agenda": (b, ctx) => sectionBloc(b, "agenda-section",
      `${enteteBloc(b, ctx.premierAgenda ? "agenda-titre" : "")}<div class="agenda" data-agenda${attrBloc("data-limit-avenir", b.nombreAvenir || 6)}${attrBloc("data-limit-passes", b.nombrePasses || 4)} aria-busy="true"></div>`,
      ctx.premierAgenda ? ' id="agenda"' : ""),

    "membres-partenaires": (b, ctx) => sectionBloc(b, "partenaires-section",
      // b.tous : toutes les personnes et toutes les catégories de partenaires
      // ctx.edition (gestionnaire, « Modifier le contenu ») : ajout, modification
      // et suppression des partenaires depuis le bloc
      `<div data-partenaires="${b.tous ? "" : esc(listeIds(b.categories))}" data-titre="aucun"${b.tous ? "" : attrBloc("data-membres", b.sansMembres ? "aucun" : listeIds(b.membres))} data-volet="aucun"${ctx && ctx.edition ? ' data-isci-edition="1"' : ""} aria-busy="true"></div>`),

    "categorie": (b) => (b.categorie ? sectionBloc(b, "categorie-section",
      `<div${attrBloc("data-categorie", b.categorie)} data-titre="aucun"${attrBloc("data-limit", b.nombre)} data-volet="aucun" aria-busy="true"></div>`) : ""),

    "projets": (b) => sectionBloc(b, "projets-section",
      `<div data-projets data-titre="aucun"${attrBloc("data-pays", listeIds(b.pays))}${b.filtres === false ? ' data-filtres="non"' : ""}${attrBloc("data-limit", b.nombre)} data-volet="aucun" aria-busy="true"></div>`),

    "liste": (b) => sectionBloc(b, "bloc-liste",
      `${enteteBloc(b)}<div data-liste="${esc(b.source || "publications")}"${attrBloc("data-liste-projets", listeIds(b.projets))}${attrBloc("data-liste-personnes", listeIds(b.personnes))}${attrBloc("data-liste-categorie", b.categorie)}${attrBloc("data-limit", b.nombre)} aria-busy="true"></div>`),

    // Documents PDF (data/structure/documents.json) : consulter ou télécharger
    // Vidéo, son : fichier du gestionnaire des médias, lu par le relais
    "video": (b, ctx = {}) => sectionBloc(b, "bloc-media bloc-video" + (["75", "50"].includes(String(b.largeur)) ? ` bloc-video--${b.largeur}` : ""),
      `<figure class="bloc-video__figure">
        <div class="bloc-video__cadre" data-media="videos"${attrBloc("data-media-id", b.media)}${attrBloc("data-affiche", b.affiche ? url(b.affiche) : "")}${ctx.edition ? ' data-edition="1"' : ""} aria-busy="true"></div>
        ${b.legende ? `<figcaption class="legende">${esc(b.legende)}</figcaption>` : ""}
      </figure>`),

    "son": (b, ctx = {}) => sectionBloc(b, "bloc-media bloc-son",
      `<div class="bloc-son__zone" data-media="sons"${attrBloc("data-media-id", b.media)}${attrBloc("data-titre", b.legende)}${b.telechargement ? ' data-telechargement="1"' : ""}${ctx.edition ? ' data-edition="1"' : ""} aria-busy="true"></div>`),

    "documents": (b) => sectionBloc(b, "bloc-documents",
      `<ul class="documents" data-documents="${esc(listeIds(b.documents))}" aria-busy="true"></ul>`),

    "liens": (b) => sectionBloc(b, "bloc-liens", b.depuisPage
      // Relié aux réglages de la page (personnes, projets, partenaires de la page)
      ? `${enteteBloc(b)}<div class="page-libre__liens" data-page-liens data-liens-page aria-busy="true"></div>`
      : `${enteteBloc(b)}<div class="page-libre__liens" data-page-liens${attrBloc("data-liens-personnes", listeIds(b.personnes))}${attrBloc("data-liens-projets", listeIds(b.projets))}${attrBloc("data-liens-partenaires", listeIds(b.partenaires))} aria-busy="true"></div>`),
  };

  // Liste filtrée (bloc « liste ») : actualités, publications, évènements
  // ou fil actualités + évènements, d'un projet, d'une personne ou d'une catégorie
  async function construireListe(zone) {
    const source = zone.dataset.liste || "publications";
    const ids = (attr) => (zone.dataset[attr] || "").split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const sources = source === "fil" ? ["actualites", "evenements"] : [source];
      const projets = ids("listeProjets"), personnes = ids("listePersonnes"), categorie = zone.dataset.listeCategorie;
      const selListe = projets.length ? "@projets:" + projets.join(",") : personnes.length ? "@personnes:" + personnes.join(",") : categorie ? "@categorie:" + categorie : undefined;
      const [listes] = await Promise.all([
        Promise.all(sources.map((s) => charger(s, selListe).catch(() => []))),
        chargerCategories(),
      ]);
      const elements = trierParDate(listes.flat().filter((el) => publie(el) && dansFil(el)
        && (!projets.length || (el.projets || []).some((id) => projets.includes(id)))
        && (!personnes.length || (el.personnes || []).some((id) => personnes.includes(id)))
        && (!categorie || dansCategories(el, new Set([categorie])))));
      const pas = limiteDe(zone.dataset.limit, 6);
      const carte = source === "publications" ? carteArticle : carteFil;
      const classe = source === "publications" ? "pt-grille--publications" : "pt-grille--actualites";
      zone.innerHTML = elements.length
        ? `<div class="pt-grille ${classe}" data-pagine-pas="${pas}">${elements.map(carte).join("")}</div>`
        : `<p class="categorie__vide">${esc(t("Aucun contenu pour le moment."))}</p>`;
      zone.setAttribute("aria-busy", "false");
      brancherPagination(zone);
    } catch (err) {
      console.error("[contenus] Liste :", err);
    }
  }

  // Blocs enregistrés pour une clé ("accueil", "page:id", "personne:id", "projet:id")
  async function sourceBlocs(cle) {
    const [type, id] = String(cle).split(":");
    if (type === "accueil") return (await charger("structure/accueil")).blocs || [];
    const fichier = { page: "structure/pages-creees", personne: "personnes", projet: "projets" }[type];
    if (!fichier) return [];
    const proprio = (await charger(fichier, "#" + id)).find((o) => o.id === id);
    return (proprio && proprio.blocs) || [];
  }

  const CLES_BLOCS = new WeakMap();   // élément -> réglages du bloc affiché (JSON)

  // Construit (ou met à jour) les blocs d'une zone ; seuls les blocs
  // nouveaux ou modifiés sont reconstruits (aperçu en direct)
  // options.edition : aperçu du gestionnaire en mode édition (blocs masqués
  // affichés en transparence, pour pouvoir les réafficher)
  const cleBloc = (b, edition) => JSON.stringify(b) + (edition ? "|edition" : "");

  async function construireBlocs(zone, blocs = null, activerNouveaux = true, options = {}) {
    if (!blocs) {
      try { blocs = await sourceBlocs(zone.dataset.blocs); }
      catch (err) { console.error(`[contenus] Blocs "${zone.dataset.blocs}" :`, err); blocs = []; }
    }
    const reserve = new Map();
    if (!options.forcer) [...zone.children].forEach((el) => {
      const cle = CLES_BLOCS.get(el);
      if (!reserve.has(cle)) reserve.set(cle, []);
      reserve.get(cle).push(el);
    });
    const ctx = { premierAgenda: !document.getElementById("agenda") || !!zone.querySelector("#agenda"), edition: !!options.edition };
    const nouveaux = [];
    const elements = [];
    blocsSepares(blocs).forEach(([b, i]) => {
      if (!b || !BLOCS[b.type] || (b.publie === false && !options.edition)) return;
      const cle = cleBloc(b, options.edition);
      let el = (reserve.get(cle) || []).shift();
      if (!el) {
        let html = "";
        try { html = BLOCS[b.type](b, ctx); }
        catch (err) { console.error(`[contenus] Bloc ${b.type} :`, err); }
        // Bloc sans contenu (titre ou texte vide) : absent du site
        if (!html && !options.edition) return;
        el = document.createElement("div");
        el.className = `bloc bloc--${b.type}` + (b.publie === false ? " bloc--masque" : "");
        el.innerHTML = html;
        CLES_BLOCS.set(el, cle);
        nouveaux.push(el);
      }
      if (b.type === "agenda") ctx.premierAgenda = false;
      el.dataset.blocIndex = String(i);
      elements.push(el);
    });
    zone.replaceChildren(...elements);
    zone.setAttribute("aria-busy", "false");
    if (activerNouveaux) nouveaux.forEach(activer);
    return elements;
  }

  // Interface utilisée par le gestionnaire (aperçu en mode édition)
  window.__isciBlocs = {
    pret: () => sectionsPretes || Promise.resolve(),
    zone: (cle) => [...document.querySelectorAll("[data-blocs]")].find((z) => z.dataset.blocs === cle) || null,
    construire(cle, blocs, options = {}) {
      const zone = this.zone(cle);
      return zone ? construireBlocs(zone, blocs, true, options) : Promise.resolve([]);
    },
    // Bloc modifié directement dans l'aperçu : ne pas le reconstruire
    accepter: (el, bloc, edition = true) => CLES_BLOCS.set(el, cleBloc(bloc, edition)),
    // Langue de la page affichée (site multilingue)
    langue: () => LANGUE,
    // En-tête d'une page créée (titre, image d'aperçu) avec les réglages en cours
    entete: (page) => majEntetePage(page || {}),
    // Texte alternatif / légende modifié dans le gestionnaire (avant enregistrement)
    alt: (chemin, texte) => {
      const c = cheminImage(chemin);
      if (String(texte || "").trim()) ALTS.set(c, String(texte).trim()); else ALTS.delete(c);
    },
    // Données non enregistrées du gestionnaire (personnes, projets…)
    donnees: (source, valeur) => { cache[source] = Promise.resolve(valeur); },
    // Menu reconstruit avec la navigation en cours de modification
    navigation: (nav, options = {}) => { cache["structure/navigation"] = Promise.resolve(nav); return construireNavigation(options); },
    // Listes des pages hors blocs (membres et partenaires, projets) reconstruites
    listes: (options = {}) => Promise.all([...document.querySelectorAll("[data-partenaires], [data-projets]:not([data-page-liens])")]
      .filter((z) => !z.closest("[data-blocs]"))
      .map((z) => { if (options.edition && z.matches("[data-partenaires]")) z.dataset.isciEdition = "1"; return z; })
      .map((z) => (z.matches("[data-partenaires]") ? construirePartenaires(z) : construireProjets(z)))),
    // Ordre modifié dans le gestionnaire (simple aperçu) : blocs, fiches et
    // listes reconstruits avec les données transmises par donnees()
    async reordonner() {
      await Promise.all([...document.querySelectorAll("[data-blocs]")].map((zone) => construireBlocs(zone, null, true, { forcer: true })));
      const meta = document.querySelector('meta[name="isci-page-generee"]');
      const idPage = meta && meta.content.startsWith("page:") ? meta.content.slice(5) : null;
      const page = idPage ? ((await charger("structure/pages-creees")) || []).find((o) => o.id === idPage) : null;
      if (page) {
        PAGE_COURANTE = { personnes: page.personnes || [], projets: page.projets || [], partenaires: page.partenaires || [] };
        majEntetePage(page);
      }
      await this.fiches(page ? { page: { ...PAGE_COURANTE, volet: page.volet !== false, categorie: page.categorie } } : {});
      await this.listes();
    },
    // Portrait / fiche projet de la page reconstruits
    fiches: (options = {}) => {
      FICHES_EDITION = !!options.edition;
      // Page créée : personnes, projets et partenaires liés (valeurs en cours)
      let liensPage = [];
      if (options.page) {
        PAGE_COURANTE = { ...options.page };
        liensPage = zonesLiensPage();
        liensPage.forEach((z) => ["personnes", "projets", "partenaires"].forEach((k) => {
          z.dataset["liens" + k[0].toUpperCase() + k.slice(1)] = (options.page[k] || []).join(", ");
        }));
      }
      const volet = options.page && options.page.volet !== undefined ? appliquerVoletPage(options.page, options.page.volet) : Promise.resolve();
      return volet.then(() => Promise.all([
      ...liensPage.map((z) => construireLiensPage(z, { edition: !!options.page.modifiable })),
      ...[...document.querySelectorAll("[data-projet]")].map(construireProjet),
      ...[...document.querySelectorAll("[data-personne]")].map(construirePersonne),
    ])); },
  };

  // Aperçu du gestionnaire : blocs non enregistrés, bloc en cours de modification
  let sectionsPretes = null;   // promesse : première construction de la page terminée

  window.addEventListener("message", async (e) => {
    if (e.origin !== location.origin || !e.data || typeof e.data !== "object") return;
    if (sectionsPretes) await sectionsPretes;
    const zone = e.data.cle ? [...document.querySelectorAll("[data-blocs]")].find((z) => z.dataset.blocs === e.data.cle) : null;
    if (e.data.type === "isci-blocs" && zone) construireBlocs(zone, Array.isArray(e.data.blocs) ? e.data.blocs : []);
    if (e.data.type === "isci-bloc-focus" && zone) {
      const el = zone.querySelector(`[data-bloc-index="${Number(e.data.index)}"]`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.style.outline = "3px solid #06ADD5";
      el.style.outlineOffset = "-3px";
      setTimeout(() => { el.style.outline = ""; }, 1600);
    }
  });

  // Page créée : personnes / projets / partenaires liés après les blocs
  // (pages générées avant ce placement : déplacés à l'affichage)
  function liensApresBlocs() {
    const liens = document.querySelector(".page-libre .page-libre__liens");
    const zone = document.querySelector('[data-blocs^="page:"]');
    if (!liens || !zone || !(liens.compareDocumentPosition(zone) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
    const section = document.createElement("section");
    section.className = "site-section page-libre-liens";
    section.innerHTML = '<div class="site-section__container"></div>';
    section.firstChild.append(liens);
    zone.after(section);
  }

  // Page générée avant l'arrivée des blocs : zone ajoutée avant le pied de page
  function zoneBlocsManquante() {
    if (document.querySelector("[data-blocs]")) return;
    const meta = document.querySelector('meta[name="isci-page-generee"]');
    const pied = document.querySelector(".site-footer");
    if (!meta || !pied || !/^(page|personne|projet):/.test(meta.content)) return;
    const zone = document.createElement("div");
    zone.className = "blocs";
    zone.dataset.blocs = meta.content;
    pied.before(zone);
  }

  // Les textes alternatifs (petit fichier) sont lus avant de construire les sections
  // Page du site statique : comportements seulement (le contenu est déjà là)
  function activerStatique() {
    sectionsPretes = Promise.resolve();
    // Langue et textes de la page (gardés à l'export)
    const infos = lireDonneesStatiques(document.getElementById("isci-statique")) || {};
    const meta = document.querySelector('meta[name="isci-langue"]');
    LANGUE = infos.langue || (meta && meta.content) || document.documentElement.lang || LANGUE;
    TEXTES = infos.textes || {};
    // Images des diapositives : adresse complète (une variable CSS se lit
    // depuis css/style.css, une adresse relative n'y mènerait pas)
    document.querySelectorAll(".hero-slide[data-image]").forEach((el) => {
      el.style.setProperty("--slide-image", `url("${new URL(encodeURI(el.dataset.image), document.baseURI).href}")`);
    });
    // Agenda : évènements répartis selon la date du jour du visiteur
    document.querySelectorAll("[data-agenda]").forEach((zone) => {
      const donnees = zone.querySelector(":scope > .agenda__donnees");
      const d = lireDonneesStatiques(donnees);
      if (!d || !Array.isArray(d.evenements)) return brancherAgenda(zone);
      Object.entries(d.categories || {}).forEach(([id, titre]) => TITRES_CATEGORIES.set(id, titre));
      rendreAgenda(zone, d.evenements);
      zone.append(donnees);
    });
    surveillerHeader();
    document.dispatchEvent(new CustomEvent("navigation:prete"));
    const hero = document.querySelector("[data-carrousel]");
    if (hero && hero.querySelector(".hero-slide")) {
      document.dispatchEvent(new CustomEvent("carrousel:pret", { detail: { delai: Number(hero.dataset.delai) || 6000 } }));
    }
    document.querySelectorAll("[data-projets]:not([data-page-liens])").forEach((z) => { if (z.querySelector(".pj-grille")) brancherFiltresProjets(z); });
    document.querySelectorAll("[data-pagine]:not(.pj-grille)").forEach((c) => {
      paginer(c, limiteDe(c.dataset.pas, 5), t("Afficher plus"), limiteDe(c.dataset.initial, limiteDe(c.dataset.pas, 5)));
    });
    brancherAfficherPlus(document);
  }

  function init() {
    if (STATIQUE) return activerStatique();
    // Aperçu du gestionnaire : modifications pas encore enregistrées
    try {
      const enCours = !EXPORT && window.parent !== window && window.parent.__isciDonneesApercu;
      const donnees = typeof enCours === "function" ? enCours() : null;
      if (donnees) Object.entries(donnees).forEach(([source, valeur]) => { cache[source] = Promise.resolve(valeur); });
    } catch (e) { /* page ouverte hors du gestionnaire */ }
    // Langue de la page d'abord (racine du site multilingue : redirection)
    sectionsPretes = determinerLangue().then(redirigerRacine).then((redirige) => {
      if (redirige) return new Promise(() => {});
      return chargerAlts().then(construireTout);
    });
  }

  // Navigation, puis blocs des pages composées, puis toutes les sections
  async function construireTout() {
    const navigation = construireNavigation();
    zoneBlocsManquante();
    liensApresBlocs();
    await preparerPageCreee();
    await Promise.all([...document.querySelectorAll("[data-blocs]")].map((zone) => construireBlocs(zone, null, false)));
    activer(document);
    await navigation;   // page « prête » une fois le menu construit (éditeur du gestionnaire)
    if (EXPORT && !document.getElementById("isci-statique")) {
      const s = donneesStatiques("", { langue: LANGUE, textes: TEXTES || {} });
      s.id = "isci-statique";
      document.body.append(s);
    }
  }

  // Remplit les sections d'une partie de la page (document entier, ou bloc ajouté)
  function activer(racine) {
    const trouver = (sel) => [...(racine.matches && racine.matches(sel) ? [racine] : []), ...racine.querySelectorAll(sel)];
    trouver("[data-source]").forEach(remplir);
    trouver("[data-carrousel]").forEach(construireCarrousel);
    trouver("[data-agenda]").forEach(construireAgenda);
    trouver("[data-documents]").forEach(construireDocuments);
    trouver("[data-media]").forEach(construireMedia);
    trouver("[data-projet]").forEach(construireProjet);
    trouver("[data-personne]").forEach(construirePersonne);
    trouver("[data-categorie]").forEach(construireCategorie);
    trouver("[data-partenaires]").forEach(construirePartenaires);
    trouver("[data-projets]:not([data-page-liens])").forEach(construireProjets);
    trouver("[data-page-liens]").forEach(construireLiensPage);
    trouver("[data-liste]").forEach(construireListe);
    trouver("[data-volet]:not([data-projet]):not([data-personne]):not([data-categorie]):not([data-partenaires]):not([data-projets])").forEach(construireVolet);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();