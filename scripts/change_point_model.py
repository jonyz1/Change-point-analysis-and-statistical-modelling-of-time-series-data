import pandas as pd
import numpy as np
import pymc as pm
import matplotlib.pyplot as plt
from datetime import datetime
import arviz as az


file_path = "../data/BrentOilPrices.csv"
df = pd.read_csv(file_path)
df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
df = df.sort_values('Date').set_index('Date')
df = df['2012-01-01':'2022-12-31']  # Filter 2012–2022
df['Log_Returns'] = np.log(df['Price'] / df['Price'].shift(1))
df = df.dropna()

# Load event data
events = pd.read_csv("../data/events.csv")
events['Date'] = pd.to_datetime(events['Date'])
events = events[(events['Date'] >= '2012-01-01') & (events['Date'] <= '2022-12-31')]

# Bayesian Change Point Model
returns = df['Log_Returns'].values
n_points = len(returns)
idx = np.arange(n_points)

with pm.Model() as model:
    # Priors for change point (tau), means (mu1, mu2), and standard deviations
    tau = pm.DiscreteUniform("tau", lower=0, upper=n_points-1)
    mu1 = pm.Normal("mu1", mu=0, sigma=0.1)
    mu2 = pm.Normal("mu2", mu=0, sigma=0.1)
    sigma = pm.HalfNormal("sigma", sigma=0.1)

    # Switch between means at change point
    mu = pm.math.switch(tau > idx, mu1, mu2)

    # Likelihood
    observation = pm.Normal("obs", mu=mu, sigma=sigma, observed=returns)

    # Sampling
    trace = pm.sample(draws=2000, tune=1000, return_inferencedata=True)

# Extract change point
tau_posterior = trace.posterior["tau"].mean(dim=["chain", "draw"]).values
tau_idx = int(round(float(tau_posterior)))
change_point_date = df.index[tau_idx]

# Quantify impact
mean_before = trace.posterior["mu1"].mean(dim=["chain", "draw"]).values
mean_after = trace.posterior["mu2"].mean(dim=["chain", "draw"]).values
price_before = df['Price'][:tau_idx].mean()
price_after = df['Price'][tau_idx:].mean()
price_change_pct = ((price_after - price_before) / price_before) * 100

# Extract change point
tau_posterior = trace.posterior["tau"].mean(dim=["chain", "draw"]).values
tau_idx = int(round(float(tau_posterior)))
change_point_date = df.index[tau_idx]

# Quantify impact
mean_before = trace.posterior["mu1"].mean(dim=["chain", "draw"]).values
mean_after = trace.posterior["mu2"].mean(dim=["chain", "draw"]).values
price_before = df['Price'][:tau_idx].mean()
price_after = df['Price'][tau_idx:].mean()
price_change_pct = ((price_after - price_before) / price_before) * 100

# Find closest event
# Find closest event
events['Date_Diff'] = abs(events['Date'] - change_point_date)
closest_event = events.loc[events['Date_Diff'].idxmin()]

# Save results
results = {
    "Change_Point_Date": str(change_point_date.date()),
    "Mean_Before": float(mean_before),
    "Mean_After": float(mean_after),
    "Price_Before": float(price_before),
    "Price_After": float(price_after),
    "Price_Change_Percent": float(price_change_pct),
    "Closest_Event_Date": str(closest_event['Date'].date()),
    "Closest_Event_Description": closest_event['Description'],
    "Closest_Event_Type": closest_event['Type']
}
pd.DataFrame([results]).to_csv("../data/change_point_results.csv", index=False)

# Plot results
plt.figure(figsize=(15, 5))
plt.plot(df.index, df['Price'], label='Brent Oil Price')
plt.axvline(change_point_date, color='red', linestyle='--', label=f'Change Point ({change_point_date.date()})')
for _, event in events.iterrows():
    plt.axvline(event['Date'], color='green', linestyle=':', alpha=0.5, label=None)
plt.title('Brent Oil Prices with Change Point and Events (2012–2022)')
plt.xlabel('Date')
plt.ylabel('Price (USD/barrel)')
plt.legend()
plt.grid(True)
plt.savefig("../data/price_with_change_point.png")
plt.close()

# Save posterior plot
az.plot_posterior(trace, var_names=["tau", "mu1", "mu2"])
plt.savefig("../data/posterior_distributions.png")
plt.close()

