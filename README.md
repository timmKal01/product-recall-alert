# Product Recall Alert — FDA Drug, Food & Device Recalls

Search recent FDA recall enforcement reports across drugs, food, and medical
devices by keyword, severity class, or state. Get back the recalling firm,
what was recalled, why, how severe, and how it was distributed — one query
instead of checking three separate FDA report pages.

Built for compliance and quality teams tracking recalls in their supply
chain, retailers/distributors screening what they carry, and risk/insurance
teams monitoring a sector or region.

## Input

```json
{
  "category": "all",
  "keyword": "salmonella",
  "classification": "Class I",
  "state": "CA",
  "daysBack": 30,
  "maxResults": 25
}
```

| Field | Type | Description |
|---|---|---|
| `category` | string | `all`, `drug`, `food`, or `device`. Default `all`. |
| `keyword` | string | Free-text search across the product description and recall reason. Leave blank to skip. |
| `classification` | string | FDA severity tier: `all`, `Class I` (most severe), `Class II`, or `Class III` (least severe). |
| `state` | string | Two-letter US state code — limits to recalls from firms based there. |
| `daysBack` | number | How many days back from today to search, by FDA report date. Default `30`, max `365`. |
| `maxResults` | number | Max recalls to return, most recent first. Default `25`, max `100`. |

## Output

One record per recall:

```json
{
  "category": "food",
  "recallNumber": "H-1180-2026",
  "eventId": "99387",
  "status": "Ongoing",
  "classification": "Class I",
  "recallingFirm": "Green Jeeva LLC",
  "brandName": null,
  "productDescription": "Organic Moringa Powder; 15kg/bag (bulk); Product code: GJ96",
  "productQuantity": "2,490 kg",
  "reasonForRecall": "Moringa Powder ingredient positive for salmonella",
  "distributionPattern": "Product was distributed to 4 different consignees...",
  "voluntaryMandated": "Voluntary: Firm initiated",
  "city": "Cerritos",
  "state": "CA",
  "country": "United States",
  "recallInitiationDate": "20260708",
  "reportDate": "20260729"
}
```

## How it works

Direct calls to the official [openFDA](https://open.fda.gov/) enforcement
API (`api.fda.gov`) — the same public dataset behind FDA.gov's own recall
search, covering drugs, food, and medical devices with one consistent
schema. No proxy, no login, no scraping.

## Pricing note

Billed per **search**, not per recall returned — one charge whether the
search returns 1 recall or 100.

## Related products

Looking for other risk-monitoring signals?

- [Federal Contract Award Tracker](https://github.com/timmKal01/federal-contract-award-tracker) — who just won government contracts
- [Field Operations Risk Briefing](https://github.com/timmKal01/field-operations-risk-briefing) — weather + space-weather conditions by location
