Brent Oil Price Analysis
Overview
This project analyzes the impact of major geopolitical, economic, and OPEC-related events on Brent oil prices from 2012 to 2022. The analysis employs a Bayesian Change Point model to detect structural breaks in the price series and correlates these breaks with significant events. The project includes data cleaning, exploratory data analysis (EDA), event compilation, modeling, and an interactive dashboard for visualization.
Repository Structure

data/: Contains datasets used in the analysis.
BrentOilPrices.csv: Historical Brent oil price data.
events.csv: Compiled dataset of major events (2012–2022) with columns Event_Date, Event_Description, Event_Type, and Source.


notebooks/: Jupyter notebooks for data cleaning, EDA, and modeling.
data_cleaning.ipynb: Scripts for loading and cleaning Brent oil price data.
eda.ipynb: Exploratory data analysis with visualizations and statistical tests.
change_point_model.ipynb: Bayesian Change Point modeling using PyMC3.


src/: Source code for the analysis and dashboard.
analysis.py: Python scripts for data processing and modeling.
app.py: Flask backend for serving data to the dashboard.
frontend/: React frontend code for the interactive dashboard using Recharts.


docs/: Documentation and reports.
Task1_Interim_Report.md: Interim report outlining the analysis workflow and preliminary findings.
Task1_Analysis_Plan.md: Detailed plan for data analysis, including assumptions and limitations.


README.md: This file, providing an overview and setup instructions.

Installation
Prerequisites

Python 3.8+
Node.js 16+ (for the React frontend)
Git

Setup

Clone the Repository:
git clone https://github.com/jhonyz1/brent-oil-price-analysis.git
cd brent-oil-price-analysis


Install Python Dependencies:
pip install -r requirements.txt

Required packages include:

pandas, numpy: Data manipulation
pymc3: Bayesian modeling
matplotlib, seaborn: Visualization
flask: Backend API
pytest: Testing


Download Data:

Place BrentOilPrices.csv in the data/ directory (source: [e.g., Kaggle, EIA]).
The events.csv file is provided in data/ or can be regenerated using the event compilation script.



Usage
Running the Analysis

Data Cleaning and EDA:

Run notebooks/data_cleaning.ipynb to clean the Brent oil price data.
Run notebooks/eda.ipynb to perform exploratory data analysis and visualize trends.


Change Point Modeling:

Run notebooks/change_point_model.ipynb to apply the Bayesian Change Point model and detect structural breaks.


Event Correlation:

Use src/analysis.py to align detected change points with events from events.csv and quantify impacts.





Methodology

Data Cleaning:

Handle missing values, inconsistent date formats, and non-numeric prices in BrentOilPrices.csv.
Convert dates to datetime and sort chronologically.


Exploratory Data Analysis:

Visualize raw prices and log returns to identify trends and volatility.
Test for stationarity using the Augmented Dickey-Fuller test.


Event Compilation:

Compile 10-15 major events (2012–2022) into events.csv with verified sources.
Categories include Geopolitical (e.g., Russia-Ukraine conflict), Economic (e.g., 2020 oil price crash), and OPEC Policy (e.g., production cuts).


Bayesian Change Point Modeling:

Use PyMC3 to model structural breaks in the price or log return series.
Estimate posterior distributions for change points (tau) and parameters (e.g., mean price before/after).


Event Correlation:

Align change points with event dates to hypothesize causal relationships.
Quantify impacts (e.g., percentage price change post-event).


Dashboard:

Flask backend serves price and event data via APIs.
React frontend with Recharts provides interactive visualizations and filters.



Assumptions and Limitations

Assumptions:

Brent oil prices reflect global market dynamics.
Major events drive significant price changes.
Bayesian models can detect meaningful structural breaks.


Limitations:

Correlation does not imply causation; other factors may influence prices.
Event dataset may miss minor but impactful events.
Model assumes discrete change points, potentially missing gradual shifts.
Data quality issues (e.g., missing trading days) may affect accuracy.



Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/YourFeature).
Commit changes (git commit -m 'Add YourFeature').
Push to the branch (git push origin feature/YourFeature).
Open a pull request.

License
This project is licensed under the MIT License. See LICENSE for details.
Contact
For questions or feedback, contact [yohanneshabtamu99@gmail.com] or open an issue on GitHub.