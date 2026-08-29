# RankAI - Project Explanation

## Overview

**RankAI** is a full-stack web application designed to help website owners and digital marketers analyze their website's SEO (Search Engine Optimization) performance and track their keyword rankings on Google. It combines modern web technologies with AI-powered analysis to provide detailed SEO audit reports and automated keyword tracking.

In simple terms: **RankAI helps you understand how well your website is optimized for search engines and monitors how your target keywords rank on Google over time.**

---

## What Does RankAI Do?

RankAI provides two main features:

### 1. **SEO Analysis & Auditing**
- Users submit a website URL
- The system scrapes the page and analyzes it
- AI (Google Gemini) generates a detailed SEO audit report
- Users receive a score (0-100) and recommendations for improvement

### 2. **Keyword Rank Tracking**
- Users add a keyword they want to track (e.g., "best pizza in New York")
- The system checks Google's search results to find where their website ranks
- Daily automated checks refresh the ranking position
- Users can see rank history, competitors, and position changes

---

## How It's Built - Architecture

RankAI is a **client-server application** split into two main parts:

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│      User Interface & Dashboard         │
└──────────────┬──────────────────────────┘
               │ HTTP Requests/Responses
               │
┌──────────────▼──────────────────────────┐
│      Backend (Express.js + Node.js)     │
│       API, Logic & Orchestration        │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┬──────────────┐
    │                     │              │
┌───▼────┐         ┌────▼─────┐   ┌────▼────┐
│ MongoDB│         │Browserbase│   │ Gemini  │
│Database│         │  +        │   │   AI    │
└────────┘         │ Playwright   │
                   └──────────┘   └─────────┘
```

---

## Technology Stack

### **Frontend (Client)**
- **React 19**: UI framework for building interactive components
- **TypeScript**: Adds type safety to JavaScript
- **Vite**: Fast development server and build tool
- **React Router**: Handles navigation between pages
- **Tailwind CSS**: Styling framework for modern UI
- **Axios**: Makes HTTP requests to the backend API
- **React Hot Toast**: Shows notifications to users

### **Backend (Server)**
- **Node.js**: Runtime environment for JavaScript on the server
- **Express.js**: Web framework for building REST APIs
- **MongoDB**: NoSQL database for storing user data and analysis results
- **Mongoose**: Object modeling for MongoDB
- **JWT (JSON Web Tokens)**: Secure user authentication
- **bcrypt**: Password hashing for security
- **CORS**: Allows frontend to communicate with backend

### **Analysis & Scraping**
- **Browserbase**: Cloud browser service for rendering JavaScript-heavy pages
- **Playwright Core**: Browser automation tool for extracting page data
- **Google Gemini API**: AI model for analyzing SEO data and generating insights
- **node-cron**: Scheduler for automated daily rank tracking

---

## Project Structure

```
rankai-main/
├── client/                          # React Frontend Application
│   ├── src/
│   │   ├── App.tsx                 # Main app with routing
│   │   ├── main.tsx                # Entry point
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.tsx          # Navigation bar
│   │   │   ├── ProtectedRoute.tsx  # Auth protection wrapper
│   │   │   ├── AnalysesCard.tsx    # Card displaying analysis
│   │   │   ├── IssueCard.tsx       # Card showing issues
│   │   │   ├── Loading.tsx         # Loading spinner
│   │   │   └── ScoreGauge.tsx      # Visual score display
│   │   ├── pages/                  # Full page components
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Login.tsx           # Login/Register page
│   │   │   ├── Dashboard.tsx       # User dashboard
│   │   │   ├── Analyze.tsx         # Start new analysis
│   │   │   ├── Report.tsx          # View analysis results
│   │   │   ├── History.tsx         # Past analyses
│   │   │   ├── RankTracker.tsx     # Manage keywords
│   │   │   └── RankDetail.tsx      # Detailed rank history
│   │   ├── context/
│   │   │   ├── AppContext.tsx      # Global auth & API state
│   │   │   └── ThemeContext.tsx    # Theme settings
│   │   └── assets/
│   │       ├── assets.tsx          # Images/icons
│   │       └── gemini-assets.ts    # Gemini-related assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vercel.json
│
├── server/                          # Express Backend Application
│   ├── server.js                   # Main server entry point
│   ├── config/
│   │   └── db.js                   # MongoDB connection setup
│   ├── models/                     # Database schemas
│   │   ├── User.js                 # User schema
│   │   ├── Analysis.js             # Analysis results schema
│   │   └── keywordTracking.js      # Rank tracking schema
│   ├── controllers/                # Business logic handlers
│   │   ├── authController.js       # Login/Register logic
│   │   ├── analysisController.js   # SEO analysis logic
│   │   └── rankController.js       # Rank tracking logic
│   ├── routes/                     # API endpoint definitions
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── analysisRoutes.js       # Analysis endpoints
│   │   └── rankRoute.js            # Rank tracking endpoints
│   ├── services/                   # External integrations
│   │   ├── scrapperService.js      # Extracts page data
│   │   ├── geminiService.js        # AI analysis
│   │   ├── rankTrackerService.js   # Google search queries
│   │   └── keywordTrackingService.js # Rank update logic
│   ├── middleware/
│   │   └── auth.js                 # JWT verification
│   ├── cron/
│   │   └── rankTrackingCron.js     # Daily auto-refresh job
│   ├── package.json
│   └── vercel.json
│
├── dev.js                           # Script to run both apps together
├── package.json                     # Root package config
└── README.md                        # Documentation
```

---

## Database Models

### **User Model**
Stores user account information:
```
- name: User's full name
- email: Email address (unique)
- password: Hashed password
- plan: "free" or "pro" subscription tier
- analysisCount: Number of analyses run
- lastAnalysisDate: When they last ran an analysis
- timestamps: Created/updated dates
```

### **Analysis Model**
Stores results of SEO audits:
```
- userId: Which user ran this analysis
- url: The website URL that was analyzed
- overallScore: 0-100 score
- categories:
  - seo: SEO score
  - performance: Page speed score
  - accessibility: Accessibility score
  - bestPractices: Code quality score
- metadata: Page title, description, meta tags, etc.
- headings: Count and text of H1-H6 tags
- links: Internal, external, and broken link counts
- images: Total images and alt text stats
- keywords: Top keywords found on the page
- issues: List of problems with severity levels
- loadTime: How long the page takes to load
- pageSize: Size of the page in bytes
- wordCount: Total words on the page
- status: "pending" → "processing" → "completed" or "failed"
```

### **KeywordTracking Model**
Stores keyword rank information:
```
- userId: Which user is tracking this
- keyword: The search term (e.g., "best SEO tools")
- url: The target website URL
- domain: Extracted domain name
- currentPosition: Current Google rank (1-100+)
- currentPage: Which page in Google results (page 1, 2, etc.)
- bestPosition: Best rank ever achieved
- positionChange: How the rank changed since last check
- rankHistory: Array of historical position snapshots
- competitors: List of competing websites in top results
- active: Is this keyword being tracked?
- lastChecked: When was it last updated?
- status: "pending" → "checking" → "completed" or "failed"
```

---

## How Each Component Works

### **Frontend (Client-Side) Flow**

#### 1. **Authentication Pages (Login/Register)**
- User enters email and password
- Frontend sends credentials to `/api/auth/register` or `/api/auth/login`
- Backend verifies and returns a JWT token
- Token is stored in browser and sent with future requests
- User is redirected to dashboard

#### 2. **Dashboard Page**
- Displays welcome message and recent analyses
- Shows average SEO score of completed analyses
- Has a quick URL input form
- Fetches last 6 analyses from `/api/analysis/list`
- Click "Analyze URL" redirects to `/analyze` page

#### 3. **Analyze Page**
- User enters a URL to analyze
- Frontend sends request to `/api/analysis/analyze`
- Backend creates a database record and starts processing
- **Frontend polls** the API every 2-3 seconds checking status
- Once status changes to "completed", redirects to report page
- While waiting, shows loading spinner

#### 4. **Report Page**
- Fetches full analysis details from `/api/analysis/:id`
- Displays:
  - Overall score (0-100) with color coding
  - Category breakdown (SEO, Performance, Accessibility, Best Practices)
  - Metadata (title, description, Open Graph tags)
  - Link analysis (internal, external, broken)
  - Image analysis (total, missing alt text)
  - Keywords found on page
  - Issues list organized by severity (critical/warning/info)
  - Page stats (load time, size, word count)

#### 5. **History Page**
- Lists all past analyses
- Can search by URL
- Can filter by status (completed/failed)
- Can sort by date, score
- Can delete analyses
- Clicking an analysis opens its report

#### 6. **Rank Tracker Page**
- Shows all tracked keywords
- Can add new keywords to track
- Displays current rank for each keyword
- Shows rank change (improved/declined/no change)
- Shows best position ever achieved
- Can manually refresh or delete tracking

#### 7. **Rank Detail Page**
- Shows detailed history of one keyword
- Displays chart of rank changes over time
- Shows list of competing websites
- Shows when each rank was captured
- Can manually refresh the rank check

### **Backend (Server-Side) Flow**

#### **Authorization & Authentication**
1. User registers with email/password
2. Password is hashed using bcrypt (one-way encryption)
3. User record is saved to MongoDB
4. JWT token is generated and sent back
5. Every protected endpoint checks if JWT token is valid
6. If invalid/expired, request is rejected

#### **SEO Analysis Workflow** (Step-by-step)

```
User submits URL
    ↓
1. VALIDATION
   - Check URL format is correct
   - Create database record with "processing" status
   - Return analysisId to frontend immediately
   - Respond to user (non-blocking)
    ↓
2. SCRAPING (Browserbase + Playwright)
   - Launch headless browser using Browserbase
   - Navigate to the URL
   - Wait for page to fully load (DOM + network requests)
   - Extract using JavaScript evaluation:
     * Page title, meta tags, Open Graph tags
     * All headings (H1-H6) and their text
     * All links (internal/external/broken)
     * All images and their alt text
     * Total page text
   - Capture page load time and size
    ↓
3. AI ANALYSIS (Google Gemini)
   - Send scraped data to Gemini API
   - Gemini analyzes the data and returns:
     * Overall score (0-100)
     * Category scores (SEO, Performance, etc.)
     * Top keywords found
     * Issues with severity levels
   - Structured response ensures consistent format
    ↓
4. SAVE RESULTS
   - Update database record with all analysis data
   - Change status to "completed" (or "failed" if error)
   - Store everything for future reference
    ↓
Frontend polls and displays results
```

#### **Rank Tracking Workflow**

**Manual Check (User-Triggered):**
```
User clicks "Add Keyword" with keyword="pizza near me" and url="example.com"
    ↓
1. VALIDATION
   - Create KeywordTracking record with "pending" status
   ↓
2. GOOGLE SEARCH (Browserbase + Playwright)
   - Launch browser, visit Google.com
   - Accept cookie consent
   - Search for the keyword
   - Loop through first 5 pages of results (50 results total)
   - Extract title, URL, snippet for each result
   - Find which result matches the target domain
   ↓
3. EXTRACT RANKING DATA
   - Find position (1-100+) where target domain appears
   - Extract competitor info (top 10 competitors)
   - Record the date/time
   ↓
4. UPDATE DATABASE
   - Update currentPosition, currentPage
   - Add new entry to rankHistory
   - Update competitors list
   - Change status to "completed"
    ↓
Frontend displays results with visual chart
```

**Automated Daily Check (Cron Job):**
```
Every day at 6:00 AM (UTC):
    ↓
1. Find all active keywords being tracked
    ↓
2. For each keyword:
   - Change status to "checking"
   - Run same Google search process
   - Update position, history, competitors
   - Add 10-15 second delay between checks (avoid Google rate limits)
    ↓
3. Complete
   - All keywords now have fresh rank data
   - Available when users check their dashboard
```

### **API Endpoints Reference**

#### **Authentication**
```
POST /api/auth/register
├─ Body: { name, email, password }
└─ Returns: { success, _id, name, email, token }

POST /api/auth/login
├─ Body: { email, password }
└─ Returns: { success, _id, name, email, token }

GET /api/auth/user
├─ Headers: Authorization: Bearer {token}
└─ Returns: { success, user }
```

#### **SEO Analysis**
```
POST /api/analysis/analyze
├─ Body: { url }
├─ Headers: Authorization: Bearer {token}
└─ Returns: { success, analysisId }
   (Real processing happens in background)

GET /api/analysis/list
├─ Query: ?limit=10 (optional)
├─ Headers: Authorization: Bearer {token}
└─ Returns: { success, analyses: [{ _id, url, overallScore, status, ... }] }

GET /api/analysis/:id
├─ Headers: Authorization: Bearer {token}
└─ Returns: { success, analysis: { ...full details... } }

DELETE /api/analysis/:id
├─ Headers: Authorization: Bearer {token}
└─ Returns: { success, message }
```

#### **Rank Tracking**
```
POST /api/rank/add
├─ Body: { keyword, url }
├─ Headers: Authorization: Bearer {token}
└─ Returns: { success, trackingId }

GET /api/rank/list
├─ Headers: Authorization: Bearer {token}
└─ Returns: { success, rankings: [{ keyword, currentPosition, ... }] }

GET /api/rank/:id
├─ Headers: Authorization: Bearer {token}
└─ Returns: { success, ranking: { ...detailed history... } }

POST /api/rank/:id/refresh
├─ Headers: Authorization: Bearer {token}
└─ Returns: { success, updatedRanking }
   (Manually trigger immediate rank check)

PUT /api/rank/:id/toggle
├─ Body: { active: true/false }
├─ Headers: Authorization: Bearer {token}
└─ Returns: { success, ranking }
   (Enable/disable automatic daily updates)

DELETE /api/rank/:id
├─ Headers: Authorization: Bearer {token}
└─ Returns: { success, message }
```

---

## Key Features Explained

### **1. Protected Routes**
- Some pages (dashboard, analyze, history, rank tracker) require login
- ProtectedRoute component checks if user is authenticated
- If not authenticated, redirects to login page
- Uses JWT tokens from backend for verification

### **2. Real-time Analysis Status**
- Instead of waiting for analysis to complete (could take 30+ seconds)
- Frontend submits URL and gets an analysisId immediately
- Frontend polls `/api/analysis/:id` every 2-3 seconds
- When status changes from "processing" to "completed", shows results

### **3. Background Processing**
- Server doesn't wait for scraping/AI analysis to finish
- Returns response to client immediately
- Continues processing in background
- This prevents timeout errors and makes UX responsive

### **4. Automated Daily Updates**
- Cron job runs at 6 AM UTC every day
- Finds all active keyword trackings
- Updates each one automatically
- When user opens app, they see fresh data

### **5. AI-Powered Insights**
- Google Gemini AI analyzes raw page data
- Returns structured recommendations
- Categorizes issues by severity (critical/warning/info)
- Provides actionable improvement suggestions

### **6. Browser Automation**
- Browserbase provides cloud-based browsers
- Playwright controls the browser automatically
- Can render JavaScript-heavy websites
- Extracts data that regular HTTP requests can't get

### **7. Google Search Scraping**
- Ranks can't be retrieved from an API
- Application visits Google.com like a real user
- Uses headless browser to execute JavaScript
- Finds where target website appears in results
- Extracts competitor information automatically

---

## How Data Flows Through the System

### **Example: User Analyzes a Website**

```
1. USER SUBMITS URL
   ├─ Frontend: User types "example.com" and clicks "Analyze"
   └─ React component: handleAnalyze() function fires

2. FRONTEND SENDS REQUEST
   ├─ axios.post('/api/analysis/analyze', { url: 'example.com' })
   └─ Includes JWT token in Authorization header

3. BACKEND RECEIVES REQUEST
   ├─ Express route handler: analysisController.analyzeUrl()
   ├─ Validates URL format
   ├─ Creates MongoDB document (status: "processing")
   ├─ Returns response with analysisId
   └─ Non-blocking: continues processing in background

4. BACKEND PROCESSES (Background)
   ├─ Calls scrapperService.scrapUrl()
   │  ├─ Launches Browserbase session
   │  ├─ Opens page with Playwright
   │  ├─ Waits for page to load
   │  └─ Extracts: metadata, headings, links, images, text, etc.
   │
   ├─ Calls geminiService.analyzeSEOData()
   │  ├─ Sends scraped data to Google Gemini API
   │  ├─ Gemini analyzes and scores the page
   │  └─ Returns: overall score, categories, keywords, issues
   │
   └─ Updates MongoDB record with results (status: "completed")

5. FRONTEND POLLS FOR STATUS
   ├─ Every 2 seconds: axios.get('/api/analysis/:analysisId')
   ├─ Checks status field
   └─ When status === "completed", proceeds to next step

6. FRONTEND DISPLAYS RESULTS
   ├─ Fetches full analysis details
   ├─ Renders Report component
   └─ Shows: score, categories, metadata, links, images, issues, etc.

7. DATA PERSISTS IN DATABASE
   └─ MongoDB stores the entire analysis
      (User can revisit it anytime from History page)
```

---

## Environment Variables Required

To run this application, you need these in a `.env` file in the server directory:

```
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rankai

# Authentication
JWT_SECRET=your_secret_key_here

# External APIs
BROWSERBASE_API_KEY=your_browserbase_key
GEMINI_API_KEY=your_google_gemini_key

# Server
PORT=5000

# Optional DNS servers (useful for some MongoDB configurations)
DNS_SERVERS=1.1.1.1,8.8.8.8
```

Frontend reads backend URL from:
```
VITE_BACKEND_URL=http://localhost:5000
```

---

## How to Run Locally

### **Installation**
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### **Running Both Apps**
```bash
# From project root
npm run dev
```

This runs:
- **Frontend**: Vite dev server at http://localhost:5173
- **Backend**: Express server at http://localhost:5000
- Automatic reload on file changes

### **Running Separately**
```bash
# Terminal 1: Client
cd client
npm run dev

# Terminal 2: Server
cd server
npm run server
```

---

## User Workflow Example

### **Scenario: SEO Agency Worker Analyzing Client Website**

```
1. MORNING
   └─ Opens RankAI dashboard at 9 AM
      └─ Sees "Rank Tracker" showing their tracked keywords
      └─ Sees that "best web design" is now ranking #5 (improved from #7)
         └─ This data was auto-updated by cron job at 6 AM
      └─ Sees that "cheap website builder" dropped to #12 (was #10)

2. RUN NEW ANALYSIS
   └─ Client calls asking about website SEO
   └─ Copy/paste client's URL into dashboard
   └─ Get analysisId immediately
   └─ Dashboard refreshes every 2 seconds
   └─ After 45 seconds, report is ready
   └─ Shows:
      - Overall score: 72/100
      - SEO score: 65 (needs work)
      - Performance score: 82 (good)
      - Issues found:
        * Missing alt text on 12 images (Warning)
        * No H1 tag on homepage (Critical)
        * Page load time 3.2 seconds (Warning)

3. TRACK NEW KEYWORD
   └─ Client wants to rank for "graphic design services"
   └─ Add to rank tracker with client's domain
   └─ Current rank: Not found (outside top 100)
   └─ Set to auto-track (daily updates)
   └─ Over next weeks, watch rank improve as they implement changes

4. REPORT TO CLIENT
   └─ Send them the analysis report (share URL or screenshot)
   └─ Provide actionable recommendations from Gemini AI
   └─ Create content plan to improve "graphic design services" ranking
   └─ Follow up in 2 weeks to see progress
```

---

## Summary

**RankAI** is an intelligent SEO analysis and keyword tracking platform that:

1. **Analyzes websites** - Uses AI to score SEO quality and identify issues
2. **Tracks keywords** - Monitors where you rank on Google daily
3. **Automates monitoring** - Daily checks keep data fresh without manual work
4. **Provides insights** - AI-powered recommendations for improvement
5. **Stores history** - Complete audit trail of changes over time

The system combines:
- **Frontend** (React) for user interface
- **Backend** (Express) for logic and API
- **Database** (MongoDB) for persistence
- **Web Scraping** (Playwright) for extracting page data
- **Google Search** (Playwright) for finding rankings
- **AI Analysis** (Gemini) for intelligent recommendations

All working together to help users understand and improve their website's search engine performance.
