import React, { useState } from 'react';
import ChatSupport from '../components/common/ChatSupport';


const SupportPage = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Right now, just simulate submission
    console.log('Support Request:', { subject, message });
    setSubmitted(true);

    // Clear form
    setSubject('');
    setMessage('');
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Customer Support</h2>

      {submitted ? (
        <div className="alert alert-success" role="alert">
          Thank you for contacting us! We'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
          <div className="mb-3">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit Request
          </button>
        </form>
      )}
      <div className="chat-support"></div>
      <ChatSupport />
    </div>
  );
};

export default SupportPage;
