// stats.js - Tracks performance in LocalStorage
function saveStat(isCorrect, hand, type, dealer) {
    let stats = JSON.parse(localStorage.getItem('bj_stats')) || [];
    stats.push({
        time: Date.now(),
        isCorrect,
        hand,
        type,
        dealer
    });
    localStorage.setItem('bj_stats', JSON.stringify(stats));
}

function loadStats(days = 1) {
    const stats = JSON.parse(localStorage.getItem('bj_stats')) || [];
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const filtered = stats.filter(s => s.time >= cutoff);
    
    const correct = filtered.filter(s => s.isCorrect).length;
    const accuracy = filtered.length ? Math.round((correct / filtered.length) * 100) : 0;
    
    // Analyze most common mistake
    const mistakes = filtered.filter(s => !s.isCorrect);
    const counts = {};
    mistakes.forEach(m => counts[m.hand] = (counts[m.hand] || 0) + 1);
    const topMistake = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];

    return { total: filtered.length, accuracy, topMistake };
}

// Add this to stats.js
async function sendDataToSheet(summary) {
    const scriptURL = "https://script.google.com/macros/s/AKfycbwQ-k7sn3sPj_MnRHLqYqoWrHPM4dGw9H3ePqPBoJdaNLlCOMxTb4tDPKTCYM0jFw_hAg/exec";
    await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(summary)
    });
}