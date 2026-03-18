# OpenSincera Dashboard

A dark-mode dashboard for viewing publisher intelligence data from The Trade Desk's OpenSincera API.

## Features

- 🔍 **Smart Search**: Auto-detects Publisher ID vs Domain
- 📊 **Visual Metrics**: Progress bars and formatted numbers
- 🌐 **Ecosystem Overview**: Global statistics
- 🌙 **Dark Mode**: Easy on the eyes
- 📱 **Responsive**: Works on desktop and mobile

## Publisher Metrics Displayed

| Metric | Description |
|--------|-------------|
| Status | Website availability status |
| Domain | Publisher's base domain |
| Primary Supply Type | Platform type (web, ctv, etc.) |
| Avg Ads in View | Average ads visible in viewport |
| Avg Ad Refresh | Time before ad refreshes (seconds) |
| Total Unique GPIDs | Global Placement Identifiers |
| Avg Page Weight | Page file size (MB) |
| Avg CPU Usage | CPU usage metric (seconds) |
| Total Supply Paths | Ad delivery intermediaries |
| Reseller Count | Associated resellers |
| Categories | IAB content taxonomy |

## Quick Start

### Option 1: Open Directly
Simply open `index.html` in your browser.

> ⚠️ **Note**: Due to CORS restrictions, this may not work when opening the file directly. Use Option 2 if you encounter errors.

### Option 2: Local Server (Recommended)
Using Python:
```bash
cd OpenSinceraDashboard
python -m http.server 8080
```
Then open: http://localhost:8080

Using Node.js:
```bash
npx serve .
```

Using VS Code:
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

## Usage

1. Enter a **Publisher ID** (e.g., `1`) or **Domain** (e.g., `businessinsider.com`)
2. Click **Search** or press Enter
3. View the publisher metrics and categories

## API Configuration

The API key is stored in `js/app.js`. To update:

```javascript
const CONFIG = {
    API_BASE: 'https://open.sincera.io/api',
    API_KEY: 'your-api-key-here'
};
```

## File Structure

```
OpenSinceraDashboard/
├── index.html          # Main HTML
├── README.md           # This file
├── css/
│   └── styles.css      # Dark mode styles
└── js/
    └── app.js          # Application logic
```

## Deploying to GitHub Pages

1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch and save
4. Access at `https://yourusername.github.io/repo-name`

## Limitations

- **CORS**: Client-side only; may require local server
- **Rate Limits**: API has rate limiting; avoid excessive requests
- **API Key Exposure**: Key is visible in browser; for production, use a server proxy

## Credits

- Data provided by [OpenSincera](https://open.sincera.io) / The Trade Desk
