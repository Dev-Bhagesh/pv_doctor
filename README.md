# GHI Irradiance Tracker

A small full-stack app built for the PV Doctor Frontend Intern assignment. It merges daily solar irradiance (GHI) CSV files into one dataset, serves them through a local API, and displays them in a React dashboard with a line/area/bar/scatter chart, date-range toggle, and Max/Min/Avg stats.

## Project Structure


project-folder/
├── data-processing/       # Python script that merges the raw CSVs
│   ├── merge_ghi.py
│   └── merged_ghi.csv     # generated after running the script
│
└── frontend/               # React app (Vite)
    ├── src/
    │   ├── api/ghiApi.js
    │   └── components/LineChart.jsx
    └── public/
        └── data.json        # data the React app fetches


## 1. Setting up the data (Python)

**Install dependencies:**

pip install pandas --break-system-packages


**Run the merge script:**

cd data-processing
python merge_ghi.py


This reads every CSV inside the `GHI/` folder (organized by year-month), combines them into one file, and saves it as `merged_ghi.csv`.

## 2. Running the backend (local API)

If you're serving the data through a small local server instead of a static JSON file:


cd backend
pip install fastapi uvicorn --break-system-packages
uvicorn main:app --reload --port 8000


The API will be available at `http://localhost:8000`.

## 3. Running the frontend (React)

**Install dependencies:**

cd frontend
npm install


**Start the dev server:**

npm run dev


The app will open at `http://localhost:5173` (or whichever port Vite prints in the terminal).

## Features

- Line, Area, Bar, and Scatter chart views for the GHI data
- Toggle between 1 Day / 7 Day / 30 Day / All time ranges
- Live Max / Min / Avg stats for the selected range
- Dark / Light theme toggle
- Loading spinner and error handling with a Retry button
- Fully responsive (checked on mobile view)

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Chart.js + react-chartjs-2
- **Data processing:** Python, pandas
- **Backend (if used):** FastAPI

## Notes

- No UI component libraries were used (no Material UI, no Bootstrap) — all styling is custom Tailwind classes, per the assignment constraints.
- Data is fetched from a local JSON/API, not hardcoded into components.
