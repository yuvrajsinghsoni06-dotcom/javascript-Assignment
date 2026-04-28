import React, { useState } from 'react';

const StudentRow = ({ student, onUpdateScore }) => {
  const [editScore, setEditScore] = useState(student.score);

  const handleSave = () => {
    const parsed = Number(editScore);
    if (!isNaN(parsed)) {
      onUpdateScore(student.id, parsed);
    }
  };

  const isPass = student.score >= 40;

  return (
    <tr className="student-row">
      <td className="col-bar">
        <div className={`accent-bar ${isPass ? 'bar-pass' : 'bar-fail'}`}></div>
      </td>
      <td className="col-name">{student.name}</td>
      <td className="col-score">
        <span className="score-value">{student.score}</span>
      </td>
      <td className="col-status">
        <div className={`status-badge ${isPass ? 'badge-pass' : 'badge-fail'}`}>
          <span className={`badge-dot ${isPass ? 'dot-pass' : 'dot-fail'}`}></span>
          {isPass ? 'PASS' : 'FAIL'}
        </div>
      </td>
      <td className="col-update">
        <div className="update-group">
          <input
            type="number"
            className="update-input"
            value={editScore}
            onChange={(e) => setEditScore(e.target.value)}
          />
          <button className="save-btn" onClick={handleSave}>SAVE</button>
        </div>
      </td>
    </tr>
  );
};

export default StudentRow;
