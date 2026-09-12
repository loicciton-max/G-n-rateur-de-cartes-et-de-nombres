// ============================================================
// GÉNÉRATEUR — VERSION SITE SANS ÉCRAN PIN
// ============================================================


// ============================================================
// ÉCRAN GÉNÉRATEUR
// ============================================================

function allerVersEcran(idEcran) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('actif');
  });

  document.getElementById(idEcran).classList.add('actif');
}


// ============================================================
// FORÇAGE
// ============================================================

// Le système de forçage est conservé.
// Sur le site, il n'y a simplement plus de PIN pour définir
// les valeurs forcées.
// Les variables restent présentes pour conserver la mécanique.

let carteForcee = null;
let nombreForce = null;

let forcageActif = false;
let carteForceeUtilisee = false;
let nombreForceUtilise = false;

const zoneForcage = document.getElementById('zone-forcage');

let minuteurForcage = null;

function demarrerAppuiForcage() {
  minuteurForcage = setTimeout(() => {
    forcageActif = !forcageActif;

    if (forcageActif) {
      carteForceeUtilisee = false;
      nombreForceUtilise = false;
    }
  }, 300);
}

function annulerAppuiForcage() {
  clearTimeout(minuteurForcage);
}

if (zoneForcage) {
  zoneForcage.addEventListener('pointerdown', demarrerAppuiForcage);
  zoneForcage.addEventListener('pointerup', annulerAppuiForcage);
  zoneForcage.addEventListener('pointercancel', annulerAppuiForcage);
}


// ============================================================
// CARTES
// ============================================================

const COULEURS = [
  {
    nom: 'pique',
    symbole: '♠',
    rouge: false
  },
  {
    nom: 'coeur',
    symbole: '♥',
    rouge: true
  },
  {
    nom: 'carreau',
    symbole: '♦',
    rouge: true
  },
  {
    nom: 'trefle',
    symbole: '♣',
    rouge: false
  }
];

const RANGS = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'V',
  'D',
  'R'
];

const grilleCartes = document.getElementById('grille-cartes');
const valeurCarteEl = document.getElementById('valeur-carte');

let carteSelectionnee = null;
let carteArmee = null;


// ------------------------------------------------------------
// Trouver une couleur par son nom
// ------------------------------------------------------------

function obtenirCouleurParNom(nom) {
  return COULEURS.find(c => c.nom === nom);
}


// ------------------------------------------------------------
// Construire la grille des 52 cartes
// ------------------------------------------------------------

function construireGrilleCartes() {

  grilleCartes.innerHTML = '';
  carteArmee = null;

  COULEURS.forEach(couleur => {

    RANGS.forEach(rang => {

      const btn = document.createElement('button');

      btn.className =
        'mini-carte' +
        (couleur.rouge ? ' rouge' : '');

      btn.dataset.rang = rang;
      btn.dataset.couleur = couleur.nom;

      btn.innerHTML = `
        <div class="mini-carte-interieur">

          <div class="mini-carte-face mini-carte-avant">

            <span class="carte-centre">

              <span class="carte-centre-rang">
                ${rang}
              </span>

              <span class="carte-centre-symbole">
                ${couleur.symbole}
              </span>

            </span>

          </div>

          <div class="mini-carte-face mini-carte-arriere"></div>

        </div>
      `;


      // --------------------------------------------------------
      // CLIC SUR UNE CARTE
      // --------------------------------------------------------

      btn.addEventListener('click', () => {

        const dejaVisible =
          !btn.classList.contains('retournee');


        // ------------------------------------------------------
        // Si la carte est actuellement face visible
        // ------------------------------------------------------

        if (dejaVisible) {

          const rangVisible = btn.dataset.rang;
          const couleurVisibleNom = btn.dataset.couleur;

          const couleurVisible =
            obtenirCouleurParNom(couleurVisibleNom);


          grilleCartes
            .querySelectorAll('.mini-carte.selectionnee')
            .forEach(c => {
              c.classList.remove('selectionnee');
            });

          btn.classList.add('selectionnee');

          carteArmee = null;

          carteSelectionnee = {
            rang: rangVisible,
            couleur: couleurVisibleNom,
            symbole: couleurVisible.symbole
          };

          valeurCarteEl.textContent =
            `${rangVisible} ${couleurVisible.symbole}`;

          return;
        }


        // ------------------------------------------------------
        // Deuxième appui sur la même carte
        // ------------------------------------------------------

        if (carteArmee === btn) {

          const rangActuel = btn.dataset.rang;
          const couleurActuelleNom = btn.dataset.couleur;


          // ----------------------------------------------------
          // Détermination de la carte affichée
          // ----------------------------------------------------

          const forcageUtilisable =
            forcageActif &&
            carteForcee &&
            !carteForceeUtilisee;


          const carteAffichee =
            forcageUtilisable
              ? carteForcee
              : {
                  rang: rangActuel,
                  couleur: couleurActuelleNom
                };


          if (forcageUtilisable) {

            carteForceeUtilisee = true;

            if (
              carteForceeUtilisee &&
              nombreForceUtilise
            ) {
              forcageActif = false;
            }

          }


          const couleurAffichee =
            obtenirCouleurParNom(
              carteAffichee.couleur
            );


          // ----------------------------------------------------
          // Si une carte est forcée, on échange les identités
          // ----------------------------------------------------

          if (forcageUtilisable) {

            const identiteOriginale = {
              rang: rangActuel,
              couleur: couleurActuelleNom
            };


            btn.classList.toggle(
              'rouge',
              couleurAffichee.rouge
            );


            const centre =
              btn.querySelector(
                '.mini-carte-avant .carte-centre'
              );


            centre.innerHTML = `
              <span class="carte-centre-rang">
                ${carteAffichee.rang}
              </span>

              <span class="carte-centre-symbole">
                ${couleurAffichee.symbole}
              </span>
            `;


            btn.dataset.rang =
              carteAffichee.rang;

            btn.dataset.couleur =
              carteAffichee.couleur;


            // --------------------------------------------------
            // Recherche du doublon pour conserver les 52 cartes
            // --------------------------------------------------

            const doublon =
              Array.from(
                grilleCartes.querySelectorAll(
                  '.mini-carte'
                )
              ).find(el =>
                el !== btn &&
                el.dataset.rang === carteAffichee.rang &&
                el.dataset.couleur === carteAffichee.couleur
              );


            if (doublon) {

              const couleurOriginale =
                obtenirCouleurParNom(
                  identiteOriginale.couleur
                );


              doublon.classList.toggle(
                'rouge',
                couleurOriginale.rouge
              );


              const centreDoublon =
                doublon.querySelector(
                  '.mini-carte-avant .carte-centre'
                );


              centreDoublon.innerHTML = `
                <span class="carte-centre-rang">
                  ${identiteOriginale.rang}
                </span>

                <span class="carte-centre-symbole">
                  ${couleurOriginale.symbole}
                </span>
              `;


              doublon.dataset.rang =
                identiteOriginale.rang;

              doublon.dataset.couleur =
                identiteOriginale.couleur;

            }

          }


          // ----------------------------------------------------
          // Mise à jour du résumé
          // ----------------------------------------------------

          carteSelectionnee = {
            rang: carteAffichee.rang,
            couleur: carteAffichee.couleur,
            symbole: couleurAffichee.symbole
          };


          valeurCarteEl.textContent =
            `${carteAffichee.rang} ${couleurAffichee.symbole}`;


          // ----------------------------------------------------
          // Retournement
          // ----------------------------------------------------

          btn.classList.toggle('retournee');


          grilleCartes
            .querySelectorAll('.mini-carte')
            .forEach(carte => {

              if (carte !== btn) {
                carte.classList.add('retournee');
              }

            });


          carteArmee = null;

          return;
        }


        // ------------------------------------------------------
        // Premier appui
        // ------------------------------------------------------

        grilleCartes
          .querySelectorAll('.mini-carte.selectionnee')
          .forEach(c => {
            c.classList.remove('selectionnee');
          });


        btn.classList.add('selectionnee');

        carteArmee = btn;

      });


      grilleCartes.appendChild(btn);

    });

  });
}



// Construire les cartes au démarrage
construireGrilleCartes();


// ============================================================
// NAVIGATION CARTES
// ============================================================

document
  .getElementById('btn-choisir-carte')
  .addEventListener('click', () => {

    allerVersEcran('ecran-carte');

  });


document
  .getElementById('btn-retour-carte')
  .addEventListener('click', () => {

    allerVersEcran('ecran-generateur');

  });


// ============================================================
// FACE CACHÉE / FACE VISIBLE
// ============================================================

function creerBasculeFaceCachee(
  grilleEl,
  boutonEl
) {

  let cachees = false;


  boutonEl.addEventListener('click', () => {

    cachees = !cachees;


    grilleEl
      .querySelectorAll('.mini-carte')
      .forEach(el => {

        el.classList.toggle(
          'retournee',
          cachees
        );

      });


    boutonEl.innerHTML = cachees

      ? `
        <span class="btn-action-icone">
          🂡
        </span>
        Face visible
      `

      : `
        <span class="btn-action-icone">
          🂠
        </span>
        Face cachée
      `;

  });

}


// ============================================================
// MÉLANGE
// ============================================================

function creerMelangeur(grilleEl) {

  let enTrainDeMelanger = false;


  return function melanger() {

    if (enTrainDeMelanger) return;

    enTrainDeMelanger = true;


    const elements =
      Array.from(grilleEl.children);


    const conteneurRect =
      grilleEl.getBoundingClientRect();


    const centreX =
      conteneurRect.left +
      conteneurRect.width / 2;


    const centreY =
      conteneurRect.top +
      conteneurRect.height / 2;


    // --------------------------------------------------------
    // Étape 1 : convergence vers le centre
    // --------------------------------------------------------

    elements.forEach((el, i) => {

      const rect =
        el.getBoundingClientRect();


      const dx =
        centreX -
        (rect.left + rect.width / 2);


      const dy =
        centreY -
        (rect.top + rect.height / 2);


      const rotation =
        Math.random() * 70 - 35;


      el.style.transition =
        'transform 0.38s cubic-bezier(.4,0,.2,1)';


      el.style.transform =
        `translate(${dx}px, ${dy}px) scale(0.35) rotate(${rotation}deg)`;


      el.style.zIndex =
        100 + i;

    });


    setTimeout(() => {


      // ------------------------------------------------------
      // Étape 2 : mélange réel
      // ------------------------------------------------------

      for (
        let i = elements.length - 1;
        i > 0;
        i--
      ) {

        const j =
          Math.floor(
            Math.random() * (i + 1)
          );


        [
          elements[i],
          elements[j]
        ] =
        [
          elements[j],
          elements[i]
        ];

      }


      elements.forEach(el => {

        grilleEl.appendChild(el);

      });


      // ------------------------------------------------------
      // Repositionnement
      // ------------------------------------------------------

      elements.forEach(el => {

        const rect =
          el.getBoundingClientRect();


        const dx =
          centreX -
          (rect.left + rect.width / 2);


        const dy =
          centreY -
          (rect.top + rect.height / 2);


        const rotation =
          Math.random() * 70 - 35;


        el.style.transition = 'none';


        el.style.transform =
          `translate(${dx}px, ${dy}px) scale(0.35) rotate(${rotation}deg)`;

      });


      void grilleEl.offsetHeight;


      // ------------------------------------------------------
      // Étape 3 : dispersion
      // ------------------------------------------------------

      requestAnimationFrame(() => {

        elements.forEach(el => {

          el.style.transition =
            'transform 0.5s cubic-bezier(.2,.85,.25,1)';


          el.style.transform =
            'translate(0, 0) scale(1) rotate(0deg)';

        });


        setTimeout(() => {

          elements.forEach(el => {

            el.style.zIndex = '';

          });


          enTrainDeMelanger = false;

        }, 520);

      });


    }, 400);

  };

}


// ============================================================
// ACTIVATION CARTES
// ============================================================

creerBasculeFaceCachee(
  grilleCartes,
  document.getElementById('btn-face-cachee')
);


document
  .getElementById('btn-melanger')
  .addEventListener(
    'click',
    creerMelangeur(grilleCartes)
  );


// ============================================================
// NOMBRES
// ============================================================

const grilleNombres =
  document.getElementById('grille-nombres');

const valeurNombreEl =
  document.getElementById('valeur-nombre');

let nombreSelectionne = null;
let nombreArme = null;


// ------------------------------------------------------------
// Construire les nombres 1 à 52
// ------------------------------------------------------------

function construireGrilleNombres() {

  grilleNombres.innerHTML = '';
  nombreArme = null;


  for (let n = 1; n <= 52; n++) {

    const btn =
      document.createElement('button');


    btn.className =
      'mini-carte';


    btn.dataset.nombre = n;


    btn.innerHTML = `
      <div class="mini-carte-interieur">

        <div class="mini-carte-face mini-carte-avant">

          <span class="carte-centre">

            <span class="carte-centre-rang">
              ${n}
            </span>

          </span>

        </div>

        <div class="mini-carte-face mini-carte-arriere"></div>

      </div>
    `;


    // --------------------------------------------------------
    // CLIC SUR UN NOMBRE
    // --------------------------------------------------------

    btn.addEventListener('click', () => {

      const dejaVisible =
        !btn.classList.contains('retournee');


      // ------------------------------------------------------
      // Nombre actuellement visible
      // ------------------------------------------------------

      if (dejaVisible) {

        const nombreVisible =
          parseInt(
            btn.dataset.nombre,
            10
          );


        grilleNombres
          .querySelectorAll(
            '.mini-carte.selectionnee'
          )
          .forEach(c => {

            c.classList.remove(
              'selectionnee'
            );

          });


        btn.classList.add(
          'selectionnee'
        );


        nombreArme = null;


        nombreSelectionne =
          nombreVisible;


        valeurNombreEl.textContent =
          `${nombreVisible}`;


        return;

      }


      // ------------------------------------------------------
      // Deuxième appui
      // ------------------------------------------------------

      if (nombreArme === btn) {

        const nombreActuel =
          parseInt(
            btn.dataset.nombre,
            10
          );


        // ----------------------------------------------------
        // Forçage éventuel
        // ----------------------------------------------------

        const forcageUtilisable =
          forcageActif &&
          nombreForce &&
          !nombreForceUtilise;


        const nombreAffiche =
          forcageUtilisable
            ? nombreForce
            : nombreActuel;


        if (forcageUtilisable) {

          nombreForceUtilise = true;


          if (
            carteForceeUtilisee &&
            nombreForceUtilise
          ) {
            forcageActif = false;
          }

        }


        // ----------------------------------------------------
        // Échange si nombre forcé
        // ----------------------------------------------------

        if (forcageUtilisable) {

          const identiteOriginale =
            nombreActuel;


          const centre =
            btn.querySelector(
              '.mini-carte-avant .carte-centre'
            );


          centre.innerHTML = `
            <span class="carte-centre-rang">
              ${nombreAffiche}
            </span>
          `;


          btn.dataset.nombre =
            nombreAffiche;


          const doublon =
            Array.from(
              grilleNombres.querySelectorAll(
                '.mini-carte'
              )
            ).find(el =>
              el !== btn &&
              parseInt(
                el.dataset.nombre,
                10
              ) === nombreAffiche
            );


          if (doublon) {

            const centreDoublon =
              doublon.querySelector(
                '.mini-carte-avant .carte-centre'
              );


            centreDoublon.innerHTML = `
              <span class="carte-centre-rang">
                ${identiteOriginale}
              </span>
            `;


            doublon.dataset.nombre =
              identiteOriginale;

          }

        }


        // ----------------------------------------------------
        // Résumé
        // ----------------------------------------------------

        nombreSelectionne =
          nombreAffiche;


        valeurNombreEl.textContent =
          `${nombreAffiche}`;


        // ----------------------------------------------------
        // Retournement
        // ----------------------------------------------------

        btn.classList.toggle(
          'retournee'
        );


        grilleNombres
          .querySelectorAll('.mini-carte')
          .forEach(carte => {

            if (carte !== btn) {

              carte.classList.add(
                'retournee'
              );

            }

          });


        nombreArme = null;

        return;

      }


      // ------------------------------------------------------
      // Premier appui
      // ------------------------------------------------------

      grilleNombres
        .querySelectorAll(
          '.mini-carte.selectionnee'
        )
        .forEach(c => {

          c.classList.remove(
            'selectionnee'
          );

        });


      btn.classList.add(
        'selectionnee'
      );


      nombreArme = btn;

    });


    grilleNombres.appendChild(btn);

  }

}


// Construire les nombres au démarrage
construireGrilleNombres();


// ============================================================
// NAVIGATION NOMBRES
// ============================================================

document
  .getElementById('btn-choisir-nombre')
  .addEventListener('click', () => {

    allerVersEcran('ecran-nombre');

  });


document
  .getElementById('btn-retour-nombre')
  .addEventListener('click', () => {

    allerVersEcran('ecran-generateur');

  });


// ============================================================
// ACTIVATION NOMBRES
// ============================================================

creerBasculeFaceCachee(
  grilleNombres,
  document.getElementById(
    'btn-face-cachee-nombre'
  )
);


document
  .getElementById('btn-melanger-nombre')
  .addEventListener(
    'click',
    creerMelangeur(grilleNombres)
  );