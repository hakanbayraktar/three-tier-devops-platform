// Student.js

import React, { useState, useEffect } from 'react';
import './Student.css';
import { Link } from 'react-router-dom';
import FloatingButton from './FloatingButton'; 
import Credits from './credits';

function Student() {
  const [studentData, setStudentData] = useState({
    name: '',
    rollNo: '',
    class: '',
  });
  const [data, setData] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const getData = () => {
      fetch(`${API_BASE_URL}/student`)
        .then((res) => res.json())
        .then((data) => {
          // Ensure data is an array
          if (Array.isArray(data)) {
            setData(data);
          } else {
            console.error('API returned data that is not an array:', data);
          }
        })
        .catch((err) => console.log('Error fetching data:', err));
    };

    getData();
  }, [API_BASE_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    };

    fetch(`${API_BASE_URL}/addstudent`, requestOptions)
      .then((res) => res.json())
      .then(() => {
        // Refresh data after adding a student
        fetch(`${API_BASE_URL}/student`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setData(data);
            } else {
              console.error('API returned data that is not an array:', data);
            }
          })
          .catch((err) => console.log('Error fetching data:', err));
      })
      .catch((err) => console.log('Error adding student:', err));

    setStudentData({
      name: '',
      rollNo: '',
      class: '',
    });
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/student/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        // Refresh data after deleting a student
        fetch(`${API_BASE_URL}/student`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setData(data);
            } else {
              console.error('API returned data that is not an array:', data);
            }
          })
          .catch((err) => console.log('Error fetching data:', err));
      })
      .catch((err) => console.error('Error deleting data:', err));
  };

  return (
    <div>
      <div className="student-container">
        <div className="button-container-student">
          <Link to="/">
            <button className="button-63" role="button">Back to Menu</button>
          </Link>
          <Link to="/teacher">
            <button className="button-63" role="button">Teacher</button>
          </Link>
        </div>
        <div className="content">
          <h2 className='store-student-details' style={{ marginTop: '150px', marginLeft: '100px' }}>Student Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={studentData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Roll No (Must be Number):</label>
              <input
                type="text"
                name="rollNo"
                value={studentData.rollNo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Class:</label>
              <input
                type="text"
                name="class"
                value={studentData.class}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <p style={{ marginLeft: '50px' }}>
                <button type="submit">Submit</button>
              </p>
            </div>
          </form>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '50px 0' }}>
          <h2 className='student-details'>Student details</h2>
          <div className="table-container">
            <table className="student-table gradient-bg" style={{ border: '1px solid #ccc', borderCollapse: 'collapse', margin: '100px 0',marginLeft: '600px', marginTop: '100px', width: '40%', backgroundColor: '#f4f4f4'}}>
              <thead>
                <tr style={{ backgroundColor: '#ddd' }}>
                  <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>StudentID</td>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Roll Number</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Class</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.map((d, i) => (
                  <tr key={d.id} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{d.id}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{d.name}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{d.roll_number}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{d.class}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                      <button className="delete-button" onClick={() => handleDelete(d.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <FloatingButton />
      <Credits /> {/* Add the Credits component in the footer */}
    </div>
  );
}

export default Student;
