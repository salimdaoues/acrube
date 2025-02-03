import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Add a separate CSS file for styling

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [expiredAt, setexpiredAt] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Function to close the modal
  const closeModal = () => setShowModal(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) {
      setModalMessage('Please insert a valid URL');
      setShowModal(true);
      return;
    } else if (originalUrl.includes('http://localhost:5000/') || originalUrl.includes('https://localhost:5000/')) {
      setModalMessage('Sorry, you cannot shorten our own URL');
      setShowModal(true);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/shorten', { originalUrl, expiredAt });
      setShortUrl(res.data.shortUrl);
      setModalMessage('URL successfully shortened!');
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setModalMessage('Error occurred. Please try again.');
      setShowModal(true);
    }
  };

  return (
    <div className="app-container">
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter URL"
          className="input-field"
        />
        <input
          type="date"
          value={expiredAt}
          onChange={(e) => setexpiredAt(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-button">Shorten</button>
      </form>



      {/* Modal for Alerts */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalMessage}</p>

            {shortUrl && (
              <div className="result">
                <p>Shortened URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
              </div>
            )}
            <button onClick={closeModal} className="close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
