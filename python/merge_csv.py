import pandas as pd
import os
print(os.getcwd())

all_data = []

for foldername, subfolders, filenames in os.walk("GHI"):
    for filename in filenames:
        filepath = os.path.join(foldername,filename)
        df = pd.read_csv(filepath)
        all_data.append(df)
        print(df.columns)

combined_df = pd.concat(all_data, ignore_index=True)

combined_df.to_csv("combined_GHI.csv")
