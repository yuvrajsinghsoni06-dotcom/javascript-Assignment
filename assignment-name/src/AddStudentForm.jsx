import React, { useState } from 'react';

const AddStudentForm = ({ onAddStudent }) => {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || score === '') return;
    onAddStudent({ name: name.trim(), score: Number(score) });
    setName('');
    setScore('');
  };

  return (
    <div className="form-card">
      <div className="form-card-header">
        <div className="form-card-title">
          <span className="dot dot-cyan"></span>
          REGISTER STUDENT
        </div>
        <div className="form-card-tag">NEW ENTRY</div>
      </div>
      <form className="form-body" onSubmit={handleSubmit}>
        <input
          id="studentName"
          type="text"
          className="form-input"
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          id="studentScore"
          type="number"
          className="form-input"
          placeholder="Score (0-100)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
        <button type="submit" className="add-btn">+ ADD</button>
      </form>
    </div>
  );
};

export default AddStudentForm;
