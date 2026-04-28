import React, { useState } from 'react';
import Header from './Header';
import AddStudentForm from './AddStudentForm';
import StudentTable from './StudentTable';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);

  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [
      ...prev,
      { ...newStudent, id: crypto.randomUUID() },
    ]);
  };

  const handleUpdateScore = (id, newScore) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, score: newScore } : s))
    );
  };

  const total = students.length;
  const passed = students.filter((s) => s.score >= 40).length;
  const avgScore =
    total > 0
      ? Math.round(students.reduce((sum, s) => sum + s.score, 0) / total)
      : 0;

  return (
    <div className="app-wrapper">
      <div className="container">
        <Header />

        <AddStudentForm onAddStudent={handleAddStudent} />

        <div className="stats-strip">
          <div className="stat-item">
            <div className="stat-label">TOTAL</div>
            <div className="stat-value">{total}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">PASSED</div>
            <div className="stat-value">{passed}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">AVG SCORE</div>
            <div className="stat-value">{avgScore}</div>
          </div>
        </div>

        <StudentTable students={students} onUpdateScore={handleUpdateScore} />

        <footer className="footer">
          ACADEMIC TERMINAL · SECURE SESSION
        </footer>
      </div>
    </div>
  );
}

export default App;
