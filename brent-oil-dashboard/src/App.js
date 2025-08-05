
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import dayjs from 'dayjs';
import './App.css';

const App = () => {
  const [prices, setPrices] = useState([]);
  const [events, setEvents] = useState([]);
  const [results, setResults] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '2012-01-01', end: '2022-12-31' });
  const [eventType, setEventType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [priceRes, eventRes, resultRes] = await Promise.all([
          axios.get('https://your-ngrok-url.ngrok.io/api/prices'), // Replace with ngrok URL
          axios.get('https://your-ngrok-url.ngrok.io/api/events'),
          axios.get('https://your-ngrok-url.ngrok.io/api/results')
        ]);
        setPrices(priceRes.data);
        setEvents(eventRes.data);
        setResults(resultRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to load data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPrices = prices.filter(p =>
    dayjs(p.Date).isAfter(dayjs(dateRange.start).subtract(1, 'day')) &&
    dayjs(p.Date).isBefore(dayjs(dateRange.end).add(1, 'day'))
  );

  const filteredEvents = events.filter(e =>
    (eventType === 'All' || e.Type === eventType) &&
    dayjs(e.Date).isAfter(dayjs(dateRange.start).subtract(1, 'day')) &&
    dayjs(e.Date).isBefore(dayjs(dateRange.end).add(1, 'day'))
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">Brent Oil Price Dashboard (2012–2022)</h1>
      
      <div className="filters">
        <div>
          <label className="label">Start:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
            className="input"
            min="2012-01-01"
            max="2022-12-31"
          />
        </div>
        <div>
          <label className="label">End:</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
            className="input"
            min="2012-01-01"
            max="2022-12-31"
          />
        </div>
        <div>
          <label className="label">Event Type:</label>
          <select
            value={eventType}
            onChange={e => setEventType(e.target.value)}
            className="input"
          >
            <option value="All">All</option>
            <option value="Conflict">Conflict</option>
            <option value="Economic">Economic</option>
            <option value="OPEC Policy">OPEC Policy</option>
            <option value="Sanctions">Sanctions</option>
            <option value="Health">Health</option>
          </select>
        </div>
      </div>

      <LineChart
        width={700}
        height={300}
        data={filteredPrices}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="Date"
          tickFormatter={date => dayjs(date).format('YYYY-MM-DD')}
        />
        <YAxis />
        <Tooltip
          formatter={value => `$${value.toFixed(2)}`}
          labelFormatter={date => dayjs(date).format('YYYY-MM-DD')}
        />
        <Legend />
        <Line type="monotone" dataKey="Price" stroke="#8884d8" dot={false} />
        {results.map((r, i) => (
          <ReferenceLine
            key={`cp-${i}`}
            x={r.Change_Point_Date}
            stroke="red"
            label="Change Point"
          />
        ))}
        {filteredEvents.map((e, i) => (
          <ReferenceLine
            key={`event-${i}`}
            x={dayjs(e.Date).format('YYYY-MM-DD')}
            stroke="green"
            strokeDasharray="3 3"
            label={{ value: e.Event, position: 'top', fill: 'green', fontSize: 10 }}
          />
        ))}
      </LineChart>

      <div className="results">
        <h2 className="subtitle">Change Point Results</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Change Point Date</th>
              <th>Price Before ($)</th>
              <th>Price After ($)</th>
              <th>Price Change (%)</th>
              <th>Closest Event</th>
              <th>Event Type</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? results.map((r, i) => (
              <tr key={i}>
                <td>{r.Change_Point_Date}</td>
                <td>{r.Price_Before.toFixed(2)}</td>
                <td>{r.Price_After.toFixed(2)}</td>
                <td>{r.Price_Change_Percent.toFixed(2)}</td>
                <td>{r.Closest_Event_Description}</td>
                <td>{r.Closest_Event_Type}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center">No change point results available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
