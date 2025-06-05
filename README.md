# ✈️ Flight Details Viewer (Ixigo Public API Integration)

## 📌 Project Purpose

This project is designed to display detailed flight information for a specific date using Ixigo's publicly accessible API. It fetches key details such as airline, fare, departure, arrival times, baggage, and more — simulating browser behavior to bypass API restrictions.

---

## 🔍 Project Approach

- **Flight Listing:** Fetches all available flights between origin and destination for a selected date.
- **Flight Detail View:** Uses `searchId`, `providerId`, and `airlineCode` to retrieve complete flight information.
- **Bypassing Restrictions:** Since tools like Postman get blocked on some endpoints, we use PHP with appropriate headers to mimic real browser requests.
- **Web Scraping (Optional):** For deeper data scraping (if necessary), Puppeteer and Node.js can be integrated.

---

## 🧰 Tech Stack

| Layer    | Technology       | Description                                                      |
|----------|------------------|------------------------------------------------------------------|
| Backend  | PHP              | Handles API requests, simulates browser headers, avoids CORS     |
| Frontend | HTML + JavaScript| Builds the interface, handles events and communicates with PHP   |
| Optional | Node.js + Puppeteer | (For scraping) Retrieves UI-protected flight information         |

---

## 🧠 Concepts Covered

- REST APIs & request headers
- CORS proxying with PHP
- Real-browser behavior simulation
- Optional web scraping

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/flight-details-viewer.git
cd flight-details-viewer

2. Start Local PHP Server

php -S localhost:8000

3. Open in Browser

Navigate to:

http://localhost:8000/test_poll.html


⸻

🔧 Example Parameters

Use sample values like:
	•	searchToken: 04062025235327000
	•	searchProvider: 1026

These can be manually entered in the frontend fields to fetch specific flight information.

⸻

📌 Notes
	•	Ensure you have a stable internet connection — data is fetched live.
	•	This project is for educational and demo purposes only.
	•	Ixigo’s public endpoints are used, respecting their usage via browser headers.
	•	Future scope includes filter UI, pagination, or scraping with Puppeteer/Express.js.

⸻

🛠️ License

MIT – Use it freely, modify and extend for learning or internal tools.

