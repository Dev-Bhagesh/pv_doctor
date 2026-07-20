from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pd.read_csv("combined_GHI.csv")

@app.get("/")
def home():
    return{"message":"hello from bhagesh"}

@app.get("/data")
def get_data():
    return df.to_dict(orient="records")