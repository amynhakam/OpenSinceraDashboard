# OpenSincera Dashboard - Implementation Plan

## Architecture Overview

### Option A: Client-Side Only (Simple)
```
[Browser] --> [JavaScript] --> [OpenSincera API]
```
- Pros: Simple, no server needed
- Cons: API key exposed in browser, CORS may be an issue

### Option B: Server-Side Proxy (Recommended)
```
[Browser] --> [Node.js Server] --> [OpenSincera API]
```
- Pros: API key secured, no CORS issues, can add caching
- Cons: Requires running a server

## Project Structure
```
OpenSinceraDashboard/
├── index.html              # Main dashboard HTML
├── server.js               # Node.js proxy server
├── package.json            # Dependencies
├── css/
│   └── styles.css          # Dashboard styling
├── js/
│   └── app.js              # Frontend JavaScript
└── api/
    └── proxy.js            # API proxy endpoints (for Vercel/serverless)
```

## Phase 1: Project Setup
- [ ] Initialize Node.js project with package.json
- [ ] Set up Express server for API proxy
- [ ] Create basic HTML structure
- [ ] Add CSS framework/styling

## Phase 2: API Integration
- [ ] Create server-side proxy endpoint for `/publishers`
- [ ] Handle authentication with Bearer token
- [ ] Implement error handling for API failures
- [ ] Add rate limiting awareness

## Phase 3: Frontend Development
- [ ] Build search form (ID input, Domain input)
- [ ] Create results display area
- [ ] Design metric cards for each data point:
  - Status indicator
  - Domain display
  - avg_ads_in_view
  - avg_ad_refresh
  - total_unique_gpids
  - avg_page_weight
  - avg_cpu
  - total_supply_paths
  - reseller_count
  - categories (list)
  - pub_description
  - primary_supply_type
- [ ] Implement loading states
- [ ] Implement error states

## Phase 4: UI Polish
- [ ] Add responsive design
- [ ] Implement data visualization (charts/graphs for metrics)
- [ ] Add color coding for status indicators
- [ ] Style categories as tags/badges

## Phase 5: Testing & Deployment
- [ ] Test with various publisher IDs
- [ ] Test error scenarios
- [ ] Deploy (local server or cloud platform)

## API Endpoints to Implement

### GET /api/publishers
**Query Parameters:**
- `id` (optional) - Publisher ID
- `domain` (optional) - Publisher domain

**Response:** Proxied OpenSincera response

### GET /api/ecosystem (Optional)
**Response:** Ecosystem statistics

## Dependencies
- `express` - Web server
- `node-fetch` or `axios` - HTTP client for API calls
- `cors` - CORS handling
- `dotenv` - Environment variable management (for API key)

## Environment Variables
```
OPENSINCERA_API_KEY=c54dc3e17898500ecab43e76ba24bf
```

## Estimated Timeline
- Phase 1: 1 hour
- Phase 2: 1-2 hours
- Phase 3: 2-3 hours
- Phase 4: 1-2 hours
- Phase 5: 1 hour

**Total: ~6-9 hours**

## Risk Mitigation
| Risk | Mitigation |
|------|------------|
| API rate limits | Add caching layer, display rate limit warnings |
| CORS issues | Use server-side proxy |
| API key exposure | Store in environment variables, never commit |
| API downtime | Graceful error handling, retry logic |
