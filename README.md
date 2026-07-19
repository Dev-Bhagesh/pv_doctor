# 🌞 GHI Irradiance Tracker

A full-stack data visualization dashboard for monitoring **Global Horizontal Irradiance (GHI)** data. The application fetches solar irradiance data from a FastAPI backend, processes it in React, and displays interactive charts with filtering, statistics, and theme customization.

## 🚀 Features

* 📈 Interactive GHI line chart visualization
* 📊 Time range filtering:

  * 1 Day
  * 7 Days
  * 1 Month
  * All Data
* 📌 Real-time calculation of:

  * Maximum GHI value
  * Minimum GHI value
  * Average GHI value
* 🌙 Dark / Light mode toggle
* 🎨 Responsive modern UI
* 📍 Interactive chart tooltips
* ⚡ FastAPI backend API
* 🔄 Dynamic data fetching from CSV dataset

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Chart.js
* react-chartjs-2

## Backend

* FastAPI
* Python
* Pandas
* Uvicorn

## Data

* CSV dataset containing GHI measurements

---

# 📂 Project Structure

```
GHI-Irradiance-Tracker/

│
├── backend/
│   ├── main.py
│   ├── combined_GHI.csv
│   ├── requirements.txt
│
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── ghiApi.js
│   │   │
│   │   ├── components/
│   │   │   └── LineChart.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone the repository

```bash
git clone <repository-url>

cd GHI-Irradiance-Tracker
```

---

# Backend Setup

Navigate to backend:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI server:

```bash
uvicorn main:app --reload
```

Backend will run at:

```
http://localhost:8000
```

API endpoint:

```
GET /data
```

Example response:

```json
[
  {
    "Date": "2022-03-24",
    "GHI": 5.12505
  }
]
```

---

# Frontend Setup

Open another terminal.

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React development server:

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# 🔗 Application Flow

```
CSV Dataset
     |
     |
 Pandas
     |
     |
 FastAPI Endpoint
     |
     |
 React Fetch API
     |
     |
 Chart.js Visualization
```

---

# 📊 Data Processing

The backend loads the CSV file using Pandas:

```python
df = pd.read_csv("combined_GHI.csv")
```

The data is converted into JSON format and sent to the React frontend.

The frontend extracts:

* Date → X-axis labels
* GHI → Chart values

Example:

```javascript
const labels = data.map(item => item.Date);

const values = data.map(item => item.GHI);
```

---

# 🎯 Future Improvements

* Add multiple chart types (Line, Bar, Area)
* Add date range picker
* Add data export feature
* Add user authentication
* Deploy backend and frontend
* Add database storage instead of CSV

---

# 👨‍💻 Author

Developed as a full-stack internship assessment project.

Technologies used:
React + FastAPI + Pandas + Chart.js
