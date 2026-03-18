# OpenSincera Dashboard - Product Requirements Document

## Overview
A web-based dashboard that integrates with The Trade Desk's OpenSincera API to display publisher metadata, ecosystem data, and ad system information for digital advertising supply chain analysis.

## Target Users
- Digital advertising analysts
- Media buyers and planners
- Supply chain transparency researchers
- Ad tech professionals

## Core Features

### 1. Publisher Search & Filtering
- **Search by Publisher ID**: Allow users to enter a publisher ID to retrieve detailed publisher metadata
- **Search by Domain**: Allow users to search by publisher domain name
- **Filter capabilities**: Display filtered results based on user criteria

### 2. Publisher Data Display
The dashboard will display the following publisher metrics:
| Field | Description |
|-------|-------------|
| `status` | Website status as seen by OpenSincera synthetic users |
| `domain` | Base domain for the publisher website |
| `avg_ads_in_view` | Average number of ads in view at viewport level |
| `avg_ad_refresh` | Average time in seconds before ad unit refreshes |
| `total_unique_gpids` | Total number of unique Global Placement IDs |
| `avg_page_weight` | Average file size in MB for a given URL |
| `avg_cpu` | Average CPU usage for a given URL (in seconds) |
| `total_supply_paths` | Total number of supply paths for ad delivery |
| `reseller_count` | Number of resellers associated with the publisher |
| `categories` | IAB 3.0 Content Taxonomy and manual categories |
| `pub_description` | Description of the publisher |
| `primary_supply_type` | Type of platform (web, ctv, etc.) |

### 3. Ecosystem Overview (Optional Enhancement)
- Display general ecosystem statistics
- Show number of known ad systems
- Display global GPIDs count
- Show Prebid version distribution

### 4. Ad Systems Reference (Optional Enhancement)
- List of ad systems with names and canonical domains
- Ad system descriptions

## Technical Requirements

### API Integration
- **Base URL**: `https://open.sincera.io/api`
- **Authentication**: Bearer token authentication
- **Endpoints**:
  - `/publishers?id={id}` - Get publisher by ID
  - `/publishers?domain={domain}` - Get publisher by domain
  - `/ecosystem` - Get ecosystem data
  - `/adsystems` - Get ad system list

### Security Considerations
- API key should not be exposed in client-side code
- Consider server-side proxy for API calls
- Rate limiting awareness (API has rate limits)

### UI/UX Requirements
- Clean, modern interface
- Responsive design for desktop and tablet
- Data visualization for numeric metrics
- Clear error handling and loading states
- Export capabilities (optional)

## Success Metrics
- Users can successfully search for publishers by ID or domain
- All requested metrics are displayed clearly
- Dashboard loads within 3 seconds
- Error states are handled gracefully

## Out of Scope (Initial Release)
- Real-time data updates
- Historical data comparison
- User authentication/accounts
- Data export to external systems
- Prebid module mappings display

## Future Enhancements
- Compare multiple publishers side-by-side
- Historical trend analysis
- Custom dashboards/saved searches
- Integration with other ad tech platforms
