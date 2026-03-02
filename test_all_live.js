import fs from 'node:fs';

const apiKey = '4e01684e4469425c84f0304777aa36c8';

async function test() {
    try {
        // Chercher tous les matchs en direct sur toutes les compétitions supportées par le plan gratuit
        // (WC, CL, BL1, DED, BSA, PD, FL1, ELC, PPL, EC, SA, PL)
        const response = await fetch('https://api.football-data.org/v4/matches?status=LIVE,IN_PLAY,PAUSED', {
            headers: { 'X-Auth-Token': apiKey }
        });
        const data = await response.json();
        fs.writeFileSync('debug_all_live.json', JSON.stringify(data, null, 2), 'utf8');
        console.log(`Found ${data.matches ? data.matches.length : 0} live matches.`);
    } catch (e) {
        console.error(e.message);
    }
}
test();
