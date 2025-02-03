const greetings = {
    morning: "Bonjour! Que Dieu te bénisse ce matin.",
    afternoon: "Bon après-midi! Que la paix de Dieu soit avec toi.",
    evening: "Bonsoir! Que Dieu te garde ce soir.",
    night: "Bonne nuit! Que Dieu te protège pendant votre sommeil."
};

let synth = window.speechSynthesis;
let currentVoice = null;

// Fonction pour récupérer un verset aléatoire via l'API Bible (avec fallback)
async function getRandomVerse() {
    try {
        const response = await fetch('https://bible-api.com/?random=verse');
        const data = await response.json();
        return `${data.text} <br> ${data.reference}`;
    } catch (error) {
        console.warn("Erreur lors de la récupération du verset, utilisation du verset par défaut");
        return "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle. <br> - Jean 3:16";
    }
}

// Fonction pour déterminer la salutation
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return greetings.morning;
    if (hour >= 12 && hour < 18) return greetings.afternoon;
    if (hour >= 18 && hour < 21) return greetings.evening;
    return greetings.night;
}

// Fonction pour afficher le contenu
async function displayContent() {
    const greetingElement = document.getElementById('greeting');
    const verseElement = document.getElementById('verse');
    const socialShareElement = document.querySelector('.social-share');

    greetingElement.textContent = getGreeting();
    verseElement.innerHTML = await getRandomVerse();

    greetingElement.style.marginBottom = '2rem';
    socialShareElement.style.marginTop = '2rem';
    
    setTimeout(() => {
        verseElement.classList.add('visible');
        greetingElement.style.marginBottom = '1rem';
        socialShareElement.style.marginTop = '1rem';
    }, 1000);
}

// Fonctions de partage (Facebook, Twitter, WhatsApp)
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${getGreeting()} ${document.getElementById('verse').textContent}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${getGreeting()} ${document.getElementById('verse').textContent}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnWhatsApp() {
    const text = encodeURIComponent(`${getGreeting()} ${document.getElementById('verse').textContent}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

// Fonction de partage générique
function shareSite() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: `${getGreeting()} ${document.getElementById('verse').textContent}`,
            url: window.location.href
        }).catch(console.error);
    } else {
        alert('Votre navigateur ne supporte pas le partage Web.');
    }
}

// Fonction pour copier le verset
function copyVerseToClipboard() {
    const verseText = document.getElementById('verse').textContent;
    navigator.clipboard.writeText(verseText).then(() => {
        alert('Verset copié avec succès !');
    });
}

// Fonction de lecture à haute voix
function toggleTextToSpeech() {
    const verseText = document.getElementById('verse').textContent;
    const speakButton = document.getElementById('speakButton');

    if (synth.speaking) {
        synth.cancel();
        speakButton.innerHTML = '<i class="fas fa-volume-up"></i> Lire à haute voix';
        return;
    }

    const utterance = new SpeechSynthesisUtterance(verseText);
    utterance.lang = 'en-EN';
    
    utterance.onstart = () => {
        speakButton.innerHTML = '<i class="fas fa-volume-mute"></i> Arrêter';
    };
    
    utterance.onend = () => {
        speakButton.innerHTML = '<i class="fas fa-volume-up"></i> Lire à haute voix';
    };

    synth.speak(utterance);
}

// Fonction pour basculer les options de partage
function toggleShareOptions() {
    const shareOptions = document.getElementById('shareOptions');
    shareOptions.classList.toggle('visible');
}

// Charger le contenu au démarrage
window.onload = displayContent;