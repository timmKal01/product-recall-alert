const UA = 'ProductRecallAlert/0.1 (+contact: product-recall-alert-admin@example.com)';

function isoToFdaDate(d) {
    return d.toISOString().slice(0, 10).replace(/-/g, '');
}

function buildSearchQuery({ startDate, endDate, keyword, classification, state }) {
    const clauses = [`report_date:[${isoToFdaDate(startDate)}+TO+${isoToFdaDate(endDate)}]`];
    if (keyword) {
        const escaped = keyword.replace(/"/g, '');
        clauses.push(`(product_description:"${escaped}"+OR+reason_for_recall:"${escaped}")`);
    }
    if (classification && classification !== 'all') {
        clauses.push(`classification:"${classification}"`);
    }
    if (state) {
        clauses.push(`state:"${state.toUpperCase()}"`);
    }
    return clauses.join('+AND+');
}

/** Fetches recall enforcement reports for one FDA category (drug/food/device). */
export async function fetchRecalls(category, { startDate, endDate, keyword, classification, state, limit }) {
    const search = buildSearchQuery({ startDate, endDate, keyword, classification, state });
    const url = `https://api.fda.gov/${category}/enforcement.json?search=${search}&limit=${limit}&sort=report_date:desc`;

    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 404) return []; // openFDA returns 404 when a search matches zero records
    if (!res.ok) throw new Error(`openFDA request failed (${category}): ${url} (${res.status})`);

    const data = await res.json();
    return (data.results ?? []).map((r) => ({
        category,
        recallNumber: r.recall_number,
        eventId: r.event_id,
        status: r.status,
        classification: r.classification,
        recallingFirm: r.recalling_firm,
        brandName: r.openfda?.brand_name?.[0] ?? null,
        productDescription: r.product_description,
        productQuantity: r.product_quantity,
        reasonForRecall: r.reason_for_recall,
        distributionPattern: r.distribution_pattern,
        voluntaryMandated: r.voluntary_mandated,
        city: r.city,
        state: r.state,
        country: r.country,
        recallInitiationDate: r.recall_initiation_date,
        reportDate: r.report_date,
    }));
}
