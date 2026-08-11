import { Actor, log } from 'apify';
import { fetchRecalls } from './openfda.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const { category = 'all', keyword, classification = 'all', state, daysBack = 30, maxResults = 25 } = input;

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const RECALL_SEARCH_EVENT = 'recall-search';

const endDate = new Date();
const startDate = new Date(endDate.getTime() - daysBack * 24 * 60 * 60 * 1000);

const categories = category === 'all' ? ['drug', 'food', 'device'] : [category];

let allRecalls = [];
for (const cat of categories) {
    try {
        const recalls = await fetchRecalls(cat, {
            startDate,
            endDate,
            keyword,
            classification,
            state,
            limit: Math.min(maxResults, 100),
        });
        allRecalls = allRecalls.concat(recalls);
    } catch (err) {
        log.warning(`Failed to fetch ${cat} recalls`, { error: err.message });
    }
}

allRecalls.sort((a, b) => (b.reportDate ?? '').localeCompare(a.reportDate ?? ''));
const toPush = allRecalls.slice(0, maxResults);

for (const recall of toPush) {
    await Actor.pushData(recall);
}

await Actor.charge({ eventName: RECALL_SEARCH_EVENT });

log.info(`Pushed ${toPush.length} recall(s) from ${categories.join(', ')}`);

await Actor.exit();
