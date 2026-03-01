// game.js - Handles logic and "Blocker" mechanic
let gameState = {
    playerHand: [],
    dealerUpcard: null,
    handType: '',
    handKey: null,
    attempts: 0,
    correctMove: null
};

function dealNewHand() {
    gameState.attempts = 0;
    document.getElementById('reveal-btn').classList.add('hidden');
    document.getElementById('feedback').innerText = "Make your move!";
    
    // Generate Cards (11 = Ace)
    const card1 = getRandomCard();
    const card2 = getRandomCard();
    gameState.dealerUpcard = getRandomCard();
    gameState.playerHand = [card1, card2];

    // Determine Hand Type
    if (card1 === card2) {
        gameState.handType = 'pairs';
        gameState.handKey = (card1 === 11) ? "A,A" : `${card1},${card1}`;
    } else if (card1 === 11 || card2 === 11) {
        gameState.handType = 'soft';
        gameState.handKey = (card1 === 11) ? card2 : card1;
    } else {
        gameState.handType = 'hard';
        gameState.handKey = card1 + card2;
        if (gameState.handKey < 8) gameState.handKey = 8; // Chart starts at 8
        if (gameState.handKey > 17) gameState.handKey = 17;
    }

    gameState.correctMove = getCorrectMove(gameState.handType, gameState.handKey, gameState.dealerUpcard);
    updateUI();
}

function handleUserMove(userMove) {
    // Basic validation logic
    const isCorrect = (userMove === gameState.correctMove) || 
                      (gameState.correctMove === 'Ds' && userMove === 'S') ||
                      (gameState.correctMove === 'D' && userMove === 'H') ||
                      (gameState.correctMove === 'YN' && userMove === 'Y');

    saveStat(isCorrect, gameState.handKey, gameState.handType, gameState.dealerUpcard);

    if (isCorrect) {
        showFeedback("✅ Correct!", "text-green-400");
        setTimeout(dealNewHand, 1000); // Only proceed on correct move
    } else {
        gameState.attempts++;
        if (gameState.attempts >= 2) {
            document.getElementById('reveal-btn').classList.remove('hidden');
            showFeedback("❌ Wrong. Click 'Reveal' to see logic.", "text-red-400");
        } else {
            showFeedback("❌ Try again!", "text-yellow-400");
        }
    }
}

function getRandomCard() {
    const cards = [2,3,4,5,6,7,8,9,10,10,10,10,11];
    return cards[Math.floor(Math.random() * cards.length)];
}

function showReveal() {
    const moveNames = {'H':'Hit', 'S':'Stand', 'D':'Double', 'Y':'Split', 'Ds':'Double/Stand', 'YN':'Split/No'};
    alert(`Correct move: ${moveNames[gameState.correctMove]}`);
}