import React, { useState } from 'react';
import { FadeLoader } from 'react-spinners';
import './App.css';

const port = process.env.SERVER_PORT || 3001;
const api_server = `http://localhost:${port}`

function TravelPlanner() {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setItinerary(null);

    try {
      const response = await fetch(`${api_server}/api/planTrip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, startDate, numberOfDays: parseInt(numberOfDays) }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch itinerary');
      }

      const data = await response.json();
      setItinerary(data['itinerary']);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`App ${itinerary ? 'show-itinerary' : ''}`}>
      <div className="form-container">
        <h1>Travel Planner</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="City Name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="number"
              placeholder="Number of Days"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
              required
              min="1"
            />
          </div>
          <div className="button-or-loader">
            {loading ? (
              <FadeLoader color="#000" speedMultiplier={1} radius={5}/>
            ) : (
              <button type="submit">Plan Trip</button>
            )}
          </div>
        </form>
      </div>
      {itinerary && (
        <>
          {itinerary.length > 0 ? (
            <div className="itinerary-container">
              <h2>Itinerary</h2>
              {itinerary.map(({ day, plan }) => (
                <div key={day} className="day">
                  <h3>Day {day}</h3>
                  <p>{plan}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="itinerary-container">
              <h2>Itinerary</h2>
              <p>Itinerary could not be generated, Please check the information provided and try again</p>
            </div>
          )}
        </>
      )}
      {/* {itinerary ? (
        <div className="itinerary-container">
          <h2>Itinerary</h2>
          {itinerary.map(({ day, plan }) => (
            <div key={day} className="day">
              <h3>Day {day}</h3>
              <p>{plan}</p>
            </div>
          ))}
        </div>
      ): () } */}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default TravelPlanner;