let gameState = {
    companion: 'jackson',
    isAudioPlaying: false,
    playerUsername: 'Dia',
    playerEmail: ''
};

const companionData = {
    jackson: { name: 'JACKSON', sprite: '3336-removebg-preview.png' },
    emily: { name: 'EMILY', sprite: '3349-removebg-preview.png' }
};

// Listen for the first user interaction anywhere on the page to trigger audio as early as allowed
document.addEventListener('click', () => {
    playAudio();
}, { once: true });

function playAudio() {
    const audio = document.getElementById('bgm');
    if (!gameState.isAudioPlaying) {
        audio.play().then(() => {
            gameState.isAudioPlaying = true;
        }).catch(e => console.log("Audio waiting for user interaction"));
    }
}

function goToSetup() {
    playAudio();
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('setup-screen').classList.add('active');
}

function selectCompanion(choice) {
    gameState.companion = choice;
    
    // Update Dashboard Profile Area with the enlarged companion sprite
    const profile = companionData[choice];
    document.getElementById('dash-companion-img').src = profile.sprite;
    document.getElementById('dash-companion-name').textContent = profile.name;

    // Transition to Dashboard screen
    document.getElementById('setup-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');
}

function toggleAudio() {
    const audio = document.getElementById('bgm');
    const icon = document.getElementById('audio-icon');
    if (audio.paused) {
        audio.play();
        gameState.isAudioPlaying = true;
        icon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    } else {
        audio.pause();
        gameState.isAudioPlaying = false;
        icon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    }
}

function openLeaderboard() {
    document.getElementById('leaderboard-modal').style.display = 'flex';
}

function closeLeaderboard() {
    document.getElementById('leaderboard-modal').style.display = 'none';
}

function openEmailModal() {
    document.getElementById('email-modal').style.display = 'flex';
}

function closeEmailModal() {
    document.getElementById('email-modal').style.display = 'none';
}

function submitPlayerAccount() {
    const usernameVal = document.getElementById('player-username-input').value.trim();
    const emailVal = document.getElementById('player-email-input').value.trim();
    
    if (!usernameVal) {
        alert("Please enter a leaderboard username.");
        return;
    }
    if (!emailVal || !emailVal.includes('@')) {
        alert("Please enter a valid email address.");
        return;
    }

    gameState.playerUsername = usernameVal;
    gameState.playerEmail = emailVal;
    
    document.getElementById('lb-current-player').textContent = `125. ${usernameVal} (You)`;
    
    alert(`Account linked successfully! Welcome, ${usernameVal}.`);
    closeEmailModal();
}

function startMiniGame(gameName) {
    alert(`Loading mini-game: ${gameName.toUpperCase()}! Ready to test your focus, Dia.`);
}
