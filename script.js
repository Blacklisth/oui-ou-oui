/* ============================================
   CONFIGURATION PERSONNALISABLE
   ============================================ */

const CONFIG = {
    // Personnalisez votre question
    questionTitle: "Veux-tu être ma Valentine ?",
    
    // Description sous la question
    questionDescription: "Cette question ne nécessite qu'une seule réponse possible...",
    
    // Emoji de la question (💍, 💝, 💖, 🌹, etc.)
    questionIcon: "💍",
    
    // Message de célébration final
    celebrationMessage: "Tu viens de rendre cette journée encore plus spéciale. Je t'aime plus que tout au monde !",
    
    // Date cible pour le compte à rebours (format: "YYYY-MM-DD")
    targetDate: "2026-02-14", // Saint-Valentin 2026
    
    // Textes pour les boutons
    yesButtonText: "OUI ! 💖",
    noButtonText: "Euh... 🤔",
    
    // Messages d'encouragement quand on essaie de cliquer sur Non
    noButtonHints: [
        "Essaie encore... 😊",
        "Tu es sûr(e) de ton choix ? 🤨",
        "Le bouton OUI est juste à côté ! 👉",
        "Allez, tu sais que tu veux dire oui ! 💕",
        "Dernier essai... après c'est trop tard ! 😱",
        "Je sais que tu m'aimes ! ❤️"
    ],
    
    // Nombre de fois que le bouton Non peut fuir avant de disparaître
    maxNoAttempts: 6
};

/* ============================================
   VARIABLES GLOBALES
   ============================================ */

let noButtonClickCount = 0;
let countdownInterval;

/* ============================================
   INITIALISATION
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    startIntroAnimation();
    initializeContent();
    setupEventListeners();
});

/* ============================================
   PERSONNALISATION DU CONTENU
   ============================================ */

function initializeContent() {
    // Mettre à jour le titre de la question
    const questionTitle = document.getElementById('questionTitle');
    if (questionTitle) {
        questionTitle.textContent = CONFIG.questionTitle;
    }
    
    // Mettre à jour la description
    const questionDescription = document.getElementById('questionDescription');
    if (questionDescription) {
        questionDescription.textContent = CONFIG.questionDescription;
    }
    
    // Mettre à jour l'icône
    const questionIcon = document.querySelector('.question-icon');
    if (questionIcon) {
        questionIcon.textContent = CONFIG.questionIcon;
    }
    
    // Mettre à jour le texte des boutons
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    if (btnYes) btnYes.innerHTML = CONFIG.yesButtonText;
    if (btnNo) btnNo.innerHTML = CONFIG.noButtonText;
    
    // Mettre à jour le message de célébration
    const celebrationText = document.getElementById('celebrationText');
    if (celebrationText) {
        celebrationText.textContent = CONFIG.celebrationMessage;
    }
}

/* ============================================
   ANIMATION D'INTRODUCTION
   ============================================ */

function startIntroAnimation() {
    const progressFill = document.getElementById('progressFill');
    const percentage = document.getElementById('percentage');
    const introScreen = document.getElementById('introScreen');
    const mainScreen = document.getElementById('mainScreen');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (percentage) {
            percentage.textContent = progress + '%';
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Transition vers l'écran principal
            setTimeout(() => {
                if (introScreen) {
                    introScreen.classList.add('hidden');
                }
                if (mainScreen) {
                    mainScreen.classList.add('active');
                    startCountdown();
                }
            }, 500);
        }
    }, 30); // Durée totale: 3 secondes
}

/* ============================================
   COMPTE À REBOURS
   ============================================ */

function startCountdown() {
    const targetDate = new Date(CONFIG.targetDate).getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            // Si la date est passée, afficher des zéros
            updateCountdownDisplay(0, 0, 0, 0);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        updateCountdownDisplay(days, hours, minutes, seconds);
    }
    
    function updateCountdownDisplay(days, hours, minutes, seconds) {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    // Mise à jour immédiate
    updateCountdown();
    
    // Mise à jour chaque seconde
    countdownInterval = setInterval(updateCountdown, 1000);
}

/* ============================================
   GESTION DES ÉVÉNEMENTS
   ============================================ */

function setupEventListeners() {
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    const restartBtn = document.getElementById('restartBtn');
    
    if (btnYes) {
        btnYes.addEventListener('click', handleYesClick);
    }
    
    if (btnNo) {
        btnNo.addEventListener('click', handleNoClick);
        btnNo.addEventListener('mouseenter', handleNoHover);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartExperience);
    }
}

/* ============================================
   CLIC SUR "OUI"
   ============================================ */

function handleYesClick() {
    // Arrêter le compte à rebours
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Vibration si disponible
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100]);
    }
    
    // Afficher l'écran de célébration
    const celebrationScreen = document.getElementById('celebrationScreen');
    if (celebrationScreen) {
        celebrationScreen.classList.add('active');
        createMassiveHeartExplosion();
        createConfetti();
    }
}

/* ============================================
   INTERACTION AVEC LE BOUTON "NON"
   ============================================ */

function handleNoClick(e) {
    e.preventDefault();
    noButtonClickCount++;
    
    const btnNo = document.getElementById('btnNo');
    const hintText = document.getElementById('hintText');
    
    // Afficher un message d'encouragement
    if (hintText && noButtonClickCount <= CONFIG.noButtonHints.length) {
        hintText.textContent = CONFIG.noButtonHints[noButtonClickCount - 1];
    }
    
    // Si on atteint le maximum, faire disparaître le bouton Non
    if (noButtonClickCount >= CONFIG.maxNoAttempts) {
        if (btnNo) {
            btnNo.style.transition = 'all 0.5s ease';
            btnNo.style.opacity = '0';
            btnNo.style.transform = 'scale(0)';
            
            setTimeout(() => {
                btnNo.style.display = 'none';
            }, 500);
        }
        
        if (hintText) {
            hintText.textContent = "Il n'y a plus qu'une seule option maintenant ! 😊";
            hintText.style.color = 'var(--primary)';
            hintText.style.fontWeight = 'bold';
        }
    }
}

function handleNoHover() {
    const btnNo = document.getElementById('btnNo');
    if (!btnNo || noButtonClickCount >= CONFIG.maxNoAttempts) return;
    
    // Faire fuir le bouton
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    
    // Position aléatoire dans le conteneur
    const maxX = window.innerWidth - btnNo.offsetWidth - 40;
    const maxY = window.innerHeight - btnNo.offsetHeight - 40;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    btnNo.classList.add('running');
    btnNo.style.position = 'fixed';
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
    
    // Vibration subtile
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

/* ============================================
   EXPLOSION DE CŒURS MASSIVE
   ============================================ */

function createMassiveHeartExplosion() {
    const container = document.getElementById('explosionContainer');
    if (!container) return;
    
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞'];
    const numberOfHearts = 50;
    
    for (let i = 0; i < numberOfHearts; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.position = 'fixed';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = (20 + Math.random() * 40) + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            
            container.appendChild(heart);
            
            const angle = (Math.PI * 2 * i) / numberOfHearts;
            const velocity = 150 + Math.random() * 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            heart.animate([
                {
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 1
                },
                {
                    transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1) rotate(${Math.random() * 360}deg)`,
                    opacity: 1
                },
                {
                    transform: `translate(calc(-50% + ${tx * 1.5}px), calc(-50% + ${ty * 1.5}px)) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 2000 + Math.random() * 1000,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            }).onfinish = () => heart.remove();
        }, i * 20);
    }
}

/* ============================================
   CONFETTIS
   ============================================ */

function createConfetti() {
    const container = document.getElementById('explosionContainer');
    if (!container) return;
    
    const colors = ['#ff1744', '#ff4081', '#ff80ab', '#ffd1dc', '#ffeb3b', '#4caf50'];
    const numberOfConfetti = 100;
    
    for (let i = 0; i < numberOfConfetti; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-20px';
            confetti.style.width = (5 + Math.random() * 10) + 'px';
            confetti.style.height = (5 + Math.random() * 10) + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            container.appendChild(confetti);
            
            const fallDuration = 3000 + Math.random() * 2000;
            const swing = (Math.random() - 0.5) * 200;
            
            confetti.animate([
                {
                    transform: 'translateY(0) translateX(0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translateY(${window.innerHeight + 50}px) translateX(${swing}px) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ], {
                duration: fallDuration,
                easing: 'cubic-bezier(.25, .46, .45, .94)'
            }).onfinish = () => confetti.remove();
        }, i * 30);
    }
}

/* ============================================
   REDÉMARRER L'EXPÉRIENCE
   ============================================ */

function restartExperience() {
    // Réinitialiser les variables
    noButtonClickCount = 0;
    
    // Masquer l'écran de célébration
    const celebrationScreen = document.getElementById('celebrationScreen');
    if (celebrationScreen) {
        celebrationScreen.classList.remove('active');
    }
    
    // Réafficher et réinitialiser le bouton Non
    const btnNo = document.getElementById('btnNo');
    if (btnNo) {
        btnNo.style.display = '';
        btnNo.style.opacity = '1';
        btnNo.style.transform = 'scale(1)';
        btnNo.style.position = 'relative';
        btnNo.style.left = '';
        btnNo.style.top = '';
        btnNo.classList.remove('running');
    }
    
    // Effacer le texte d'indice
    const hintText = document.getElementById('hintText');
    if (hintText) {
        hintText.textContent = '';
    }
    
    // Nettoyer le conteneur d'explosion
    const explosionContainer = document.getElementById('explosionContainer');
    if (explosionContainer) {
        explosionContainer.innerHTML = '';
    }
    
    // Redémarrer le compte à rebours
    startCountdown();
}

/* ============================================
   EASTER EGGS
   ============================================ */

// Double-clic sur le titre pour un effet spécial
document.querySelector('.question-title')?.addEventListener('dblclick', function() {
    this.style.animation = 'none';
    setTimeout(() => {
        this.style.animation = '';
    }, 10);
    
    // Créer quelques cœurs
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = '30px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        
        document.body.appendChild(heart);
        
        const angle = (Math.PI * 2 * i) / 10;
        const distance = 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        heart.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => heart.remove();
    }
});