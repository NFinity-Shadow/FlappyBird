const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// Utilisation du conteneur_jeu pour le rendre flou lorsque nous afficherons le menu de fin
const conteneur_jeu = document.getElementById('game-container');

const Image_oiseau = new Image();
Image_oiseau.src = 'assets/Flappy.png';

//Constantes du jeu
const VITESSE_OISEAU = -5;
const LARGEUR_OISEAU = 40;
const HAUTEUR_OISEAU = 30;
const LARGEUR_TUYAU = 50;
const ECART_TUYAU = 125;

// Variables de l'oiseau
let X_oiseau = 50;
let Y_oiseau = 50;
let VELOCITE_oiseau = 0;
let ACCELERATION_oiseau = 0.1;

// Variables des tuyaux
let X_tuyau = 400;
let Y_tuyau = canvas.height - 200;

// Variables des Score et Highscore 
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

// On ajoute une variable bool, afin de pouvoir vérifier quand le flappy passe et on augmente la valeur du score
let point_marque = false;

// Contrôle de l'oiseau avec la touche espace
document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        VELOCITE_oiseau = VITESSE_OISEAU;
    }
}

// Relance le jeu avec le bouton de fin de partie en cas de Game Over
document.getElementById('restart-button').addEventListener('click', function() {
    Menu_Fin_cache();
    Relancer_partie();
    boucle();
})



function augmenter_score() {
    // Augementer le score si le flappy passe entre les tuyaux
    if(X_oiseau > X_tuyau + LARGEUR_TUYAU && 
        (Y_oiseau < Y_tuyau + ECART_TUYAU || 
          Y_oiseau + HAUTEUR_OISEAU > Y_tuyau + ECART_TUYAU) && 
          !point_marque) {
        score++;
        scoreDiv.innerHTML = score;
        point_marque = true;
    }

    // Remet le bool à false si le flappy est passé entre les tuyaux
    if (X_oiseau < X_tuyau + LARGEUR_TUYAU) {
        point_marque = false;
    }
}

function verification_collisions() {
    // Creation des boites de collision pour l'oiseau et les tuyaux

    const Collibox_oiseau = {
        x: X_oiseau,
        y: Y_oiseau,
        width: LARGEUR_OISEAU,
        height: HAUTEUR_OISEAU
    }

    const Collibox_tuyauHaut = {
        x: X_tuyau,
        y: Y_tuyau - ECART_TUYAU + HAUTEUR_OISEAU,
        width: LARGEUR_TUYAU,
        height: Y_tuyau
    }

    const Collibox_tuyauBas = {
        x: X_tuyau,
        y: Y_tuyau + ECART_TUYAU + HAUTEUR_OISEAU,
        width: LARGEUR_TUYAU,
        height: canvas.height - Y_tuyau - ECART_TUYAU
    }

    // Vérification de collision avec la partie haute des tuyaux
    if (Collibox_oiseau.x + Collibox_oiseau.width > Collibox_tuyauHaut.x &&
        Collibox_oiseau.x < Collibox_tuyauHaut.x + Collibox_tuyauHaut.width &&
        Collibox_oiseau.y < Collibox_tuyauHaut.y) {
            return true;
    }

    // Vérification de collision avec la partie basse des tuyaux
    if (Collibox_oiseau.x + Collibox_oiseau.width > Collibox_tuyauBas.x &&
        Collibox_oiseau.x < Collibox_tuyauBas.x + Collibox_tuyauBas.width &&
        Collibox_oiseau.y + Collibox_oiseau.height > Collibox_tuyauBas.y) {
            return true;
    }

    // Vérification de collision avec le cadre du jeu
    if (Y_oiseau < 0 || Y_oiseau + HAUTEUR_OISEAU > canvas.height) {
        return true;
    }


    return false;
}

function Menu_Fin_cache () {
    document.getElementById('end-menu').style.display = 'none';
    conteneur_jeu.classList.remove('backdrop-blur');
}

function Montrer_menuFin () {
    document.getElementById('end-menu').style.display = 'block';
    conteneur_jeu.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // Cela mettra toujours à jour notre highscore à la fin de notre jeu si l'on a un meilleur score que le précédent.
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

// On remet les valeurs de base pour le jeu
function Relancer_partie() {
    X_oiseau = 50;
    Y_oiseau = 50;
    VELOCITE_oiseau = 0;
    ACCELERATION_oiseau = 0.1;

    X_tuyau = 400;
    Y_tuyau = canvas.height - 200;

    score = 0;
}

function Fin_partie() {
    Montrer_menuFin();
}

function boucle() {
    // Remet le ctx après chaque itération de boucle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Affiche l'oiseau
    ctx.drawImage(Image_oiseau, X_oiseau, Y_oiseau);

    // Affiche les tuyaux
    ctx.fillStyle = '#333';
    ctx.fillRect(X_tuyau, -100, LARGEUR_TUYAU, Y_tuyau);
    ctx.fillRect(X_tuyau, Y_tuyau + ECART_TUYAU, LARGEUR_TUYAU, canvas.height - Y_tuyau);

    // On ajouter un contrôle de collision pour afficher notre menu de fin et mettre fin au jeu le verification_collisions nous renverra true
    // si nous avons une collision sinon false
    if (verification_collisions()) {
        Fin_partie();
        return;
    }

    // Déplace les tuyaux
    X_tuyau -= 1.5;
    // Si les tuyaux sortent de l'écran, on les remet à la position de départ
    if (X_tuyau < -50) {
        X_tuyau = 400;
        Y_tuyau = Math.random() * (canvas.height - ECART_TUYAU) + LARGEUR_TUYAU;
    }

    // Gravité de l'oiseau
    VELOCITE_oiseau += ACCELERATION_oiseau;
    Y_oiseau += VELOCITE_oiseau;

    augmenter_score()
    requestAnimationFrame(boucle);
}

boucle();