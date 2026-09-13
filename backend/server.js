const express = require('express');
const mysql = require('mysql2')
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
    preflightContinue: true,
  }));
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || process.env.host || 'mysql',
    user: process.env.DB_USER || process.env.user || 'root',
    password: process.env.DB_PASSWORD || process.env.password || 'rootpassword',
    database: process.env.DB_NAME || process.env.database || 'school',
    port: parseInt(process.env.DB_PORT || '3306', 10),
};

if (process.env.DB_SSL === 'true') {
    dbConfig.ssl = { rejectUnauthorized: false };
}

const db = mysql.createConnection(dbConfig);


// Function to create tables if they do not exist
const createTables = () => {
    const createStudentTable = `
        CREATE TABLE IF NOT EXISTS student (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL, 
            roll_number INT(255) NOT NULL, 
            class VARCHAR(255) NOT NULL
        );
    `;

    const createTeacherTable = `
        CREATE TABLE IF NOT EXISTS teacher(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            subject VARCHAR(40) NOT NULL,
            class VARCHAR(16) NOT NULL
        );
    `;

    db.query(createStudentTable, (err) => {
        if (err) {
            console.error('Error creating student table:', err);
        } else {
            console.log('Student table created or already exists.');
        }
    });

    db.query(createTeacherTable, (err) => {
        if (err) {
            console.error('Error creating teacher table:', err);
        } else {
            console.log('Teacher table created or already exists.');
        }
    });
};

// Call the createTables function when the server starts
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    } else {
        console.log('Connected to the database.');
        createTables(); // Ensure tables are created
    }
});

app.get('/backend', (re, res) => {
    return res.json("From Backend!!!");
});

const getLastStudentID = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MAX(id) AS lastID FROM student';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error getting last studentID:', err);
                reject(err);
            } else {
                const lastID = result[0].lastID || 0; // Handle case where there are no records
                resolve(lastID);
            }
        });
    });
};

const getLastteacherID = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MAX(id) AS lastID FROM teacher';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error getting last teacherID:', err);
                reject(err);
            } else {
                const lastID = result[0].lastID || 0; // Handle case where there are no records
                resolve(lastID);
            }
        });
    });
};

app.get('/backend/student', (req, res) => {
    const sql = "SELECT * FROM student";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/backend/teacher', (req, res) => {
    const sql = "SELECT * FROM teacher";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: 'Error fetching teachers' });
        
        // Ensure the data returned is always an array
        return res.json(Array.isArray(data) ? data : []);
    });
});

app.post('/backend/addstudent', async (req, res) => {
    try {
        const lastStudentID = await getLastStudentID();
        const nextStudentID = lastStudentID + 1;

        const studentData = {
            id: nextStudentID, // Assign the next studentID
            name: req.body.name,
            roll_number: req.body.rollNo,
            class: req.body.class,
        };

        const sql = `INSERT INTO student (id, name, roll_number, class) VALUES (?, ?, ?, ?)`;
        db.query(sql, [studentData.id, studentData.name, studentData.roll_number, studentData.class], (err, data) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json({ error: 'Error inserting data' });
            }
            return res.json({ message: 'Data inserted successfully' });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error inserting data' });
    }
});

app.post('/backend/addteacher', async (req, res) => {
    try {
        const lastteacherID = await getLastteacherID();
        const nextteacherID = lastteacherID + 1;

        const TeacherData = {
            id: nextteacherID, // Assign the next teacherID
            name: req.body.name,
            subject: req.body.subject,
            class: req.body.class,
        };

        const sql = `INSERT INTO teacher (id, name, subject, class) VALUES (?, ?, ?, ?)`;
        db.query(sql, [TeacherData.id, TeacherData.name, TeacherData.subject, TeacherData.class], (err, data) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json({ error: 'Error inserting data' });
            }
            return res.json({ message: 'Data inserted successfully' });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error inserting data' });
    }
});

app.delete('/backend/student/:id', (req, res) => {
    const studentId = req.params.id;
    const sqlDelete = 'DELETE FROM student WHERE id = ?';
    const sqlSelect = 'SELECT id FROM student ORDER BY id';

    // First, delete the record with the given ID
    db.query(sqlDelete, [studentId], (err, result) => {
        if (err) {
            console.error('Error deleting student:', err);
            return res.status(500).json({ error: 'Error deleting student' });
        }

        // Then, retrieve the remaining student IDs and update them sequentially
        db.query(sqlSelect, (err, rows) => {
            if (err) {
                console.error('Error selecting student IDs:', err);
                return res.status(500).json({ error: 'Error selecting student IDs' });
            }

            // Update the IDs sequentially
            const updatePromises = rows.map((row, index) => {
                const newId = index + 1;
                return new Promise((resolve, reject) => {
                    db.query('UPDATE student SET id = ? WHERE id = ?', [newId, row.id], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // Execute all the update queries in parallel
            Promise.all(updatePromises)
                .then(() => {
                    return res.json({ message: 'Student deleted successfully' });
                })
                .catch((err) => {
                    console.error('Error updating student IDs:', err);
                    return res.status(500).json({ error: 'Error updating student IDs' });
                });
        });
    });
});

app.delete('/backend/teacher/:id', (req, res) => {
    const teacherID = req.params.id;
    const sqlDelete = 'DELETE FROM teacher WHERE id = ?';
    const sqlSelect = 'SELECT id FROM teacher ORDER BY id';

    // First, delete the record with the given ID
    db.query(sqlDelete, [teacherID], (err, result) => {
        if (err) {
            console.error('Error deleting teacher:', err);
            return res.status(500).json({ error: 'Error deleting teacher' });
        }

        // Then, retrieve the remaining teacher IDs and update them sequentially
        db.query(sqlSelect, (err, rows) => {
            if (err) {
                console.error('Error selecting teacher IDs:', err);
                return res.status(500).json({ error: 'Error selecting teacher IDs' });
            }

            // Update the IDs sequentially
            const updatePromises = rows.map((row, index) => {
                const newId = index + 1;
                return new Promise((resolve, reject) => {
                    db.query('UPDATE teacher SET id = ? WHERE id = ?', [newId, row.id], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // Execute all the update queries in parallel
            Promise.all(updatePromises)
                .then(() => {
                    return res.json({ message: 'Teacher deleted successfully' });
                })
                .catch((err) => {
                    console.error('Error updating teacher IDs:', err);
                    return res.status(500).json({ error: 'Error updating teacher IDs' });
                });
        });
    });
});

// Health Check endpoint for Kubernetes and ALB
app.get('/healthz', (req, res) => {
    return res.status(200).json({ status: 'UP', service: 'three-tier-backend' });
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server listening on 0.0.0.0:${PORT}`);
});