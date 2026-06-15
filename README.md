# CinePulse 🎬🍿

CinePulse is a premium, modern, and highly responsive Movie Search & Index web application. It features a dark-themed UI (Netflix/Spotify style), crisp filled icons, a quick-access Genre Index filter bar, and an interactive deep-data modal popup powered by asynchronous JavaScript and the live OMDb API.



---

## 🚀 Features

- **Live Movie Search:** Instantly queries the OMDb database for movies, series, or anime.
- **Featured Showcase:** Automatically populates the home screen with high-rated global catalog hits upon initial page load.
- **Dynamic Detail Modals:** Click on any movie card to initiate an on-demand secondary fetch revealing a deep metadata block (Full Plot, Director, Cast, Runtime, Parental Ratings, Box Office, and Awards).
- **Client-Side Genre Index:** A smooth, fast filter panel that instantly updates visibility settings locally using DOM datasets without hammering your API request limit.
- **Defensive Error Handling:** Graceful visual states for "No Results Found", network interruptions, and automated image-fallbacks for broken poster assets.
- **Fully Responsive Architecture:** Optimized using CSS Grid and Flexbox for seamless browsing across desktops, tablets, and smartphones.

---

## 🛠️ Tech Stack

- **Frontend:** Semantic HTML5, CSS3 (Custom Variables, Glassmorphism, CSS Animations), Vanilla JavaScript (ES6+)
- **API Integration:** OMDb (Open Movie Database) REST API via `fetch`
- **Iconography:** Font Awesome v6.4.0 (Filled Icons Suite)
- **Typography:** Google Fonts (Poppins)

---

## 📂 Project Structure

```text
├── index.html       # Application markup structural layout & modal containers
├── style.css        # Premium dark-theme stylings & responsive breakpoints
├── script.js        # Asynchronous API data management & layout injectors
└── README.md        # Documentation
