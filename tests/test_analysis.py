import pandas as pd
import pytest

def test_data_loading():
    df = pd.read_csv("data/BrentOilPrices.csv")
    assert not df.empty, "Dataframe is empty"
    assert "Date" in df.columns, "Date column missing"
    assert "Price" in df.columns, "Price column missing"