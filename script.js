const greetings = {
    morning: "Bonjour! Que Dieu te bénisse ce matin.",
    afternoon: "Bon après-midi! Que la paix de Dieu soit avec toi.",
    evening: "Bonsoir! Que Dieu te garde ce soir.",
    night: "Bonne nuit! Que Dieu te protège pendant votre sommeil."
};

// Fonction pour récupérer un verset aléatoire via l'API Bible
async function getRandomVerse() {
    try {
        const response = await fetch('https://bible-api.com/?random=verse');
        const data = await response.json();
        return `${data.text} <br> ${data.reference}`;
    } catch (error) {
        console.error("Erreur lors de la récupération du verset :", error);
        return "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle. <br> - Jean 3:16";
    }
}

// Fonction pour déterminer la salutation en fonction de l'heure
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
        return greetings.morning;
    } else if (hour >= 12 && hour < 18) {
        return greetings.afternoon;
    } else if (hour >= 18 && hour < 22) {
        return greetings.evening;
    } else {
        return greetings.night;
    }
}

// Fonction pour afficher la salutation et le verset
async function displayContent() {
    const greetingElement = document.getElementById('greeting');
    const verseElement = document.getElementById('verse');
    const socialShareElement = document.querySelector('.social-share');

    greetingElement.textContent = getGreeting();
    verseElement.innerHTML = await getRandomVerse();

    // Ajouter une transition pour les éléments
    greetingElement.style.marginBottom = '2rem';
    socialShareElement.style.marginTop = '2rem';
    setTimeout(() => {
        verseElement.classList.add('visible');
        greetingElement.style.marginBottom = '1rem';
        socialShareElement.style.marginTop = '1rem';
    }, 1000); // Durée de la transition
}

// Fonction pour partager sur Facebook
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${getGreeting()} ${document.getElementById('verse').textContent}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
}

// Fonction pour partager sur Twitter
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${getGreeting()} ${document.getElementById('verse').textContent}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

// Fonction pour partager sur WhatsApp
function shareOnWhatsApp() {
    const text = encodeURIComponent(`${getGreeting()} ${document.getElementById('verse').textContent}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

// Fonction pour partager le site
function shareSite() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: `${getGreeting()} ${document.getElementById('verse').textContent}`,
            url: window.location.href
        }).then(() => {
            console.log('Partage réussi');
        }).catch((error) => {
            console.error('Erreur lors du partage :', error);
        });
    } else {
        alert('Votre navigateur ne supporte pas le partage Web.');
    }
}

// Fonction pour basculer l'affichage des options de partage
function toggleShareOptions() {
    const shareOptions = document.getElementById('shareOptions');
    if (shareOptions.classList.contains('visible')) {
        shareOptions.classList.remove('visible');
        setTimeout(() => {
            shareOptions.style.display = 'none';
        }, 1000); // Durée de la transition
    } else {
        shareOptions.style.display = 'block';
        setTimeout(() => {
            shareOptions.classList.add('visible');
        }, 0);
    }
}

// Charger le contenu au démarrage
window.onload = displayContent;
