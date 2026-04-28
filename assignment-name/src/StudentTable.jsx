import React from 'react';
import StudentRow from './StudentRow';

const StudentTable = ({ students, onUpdateScore }) => {
  return (
    <div className="table-card">
      <div className="table-card-header">
        <div className="table-card-title">STUDENT RECORDS</div>
        <div className="table-card-count">{students.length} entries</div>
      </div>
      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th className="th-bar"></th>
              <th>NAME</th>
              <th>SCORE</th>
              <th>STATUS</th>
              <th>UPDATE</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                onUpdateScore={onUpdateScore}
              />
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <div className="empty-state">No students registered yet.</div>
        )}
      </div>
    </div>
  );
};

export default StudentTable;
