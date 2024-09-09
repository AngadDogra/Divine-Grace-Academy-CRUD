const express = require('express');
const mysql = require('mysql2');
const path = require('path');  // Built-in module to handle paths

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (for your frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Khulja@1204',  // Your MySQL password
    database: 'students'      // Your MySQL database name
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API route to get all students
app.get('/', (req, res) => {
    const query = 'SELECT * FROM students_list';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error: ', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Data recieved from the database: ',results);
        res.json(results);
    });
});

// API route to insert a new student
app.post('/', (req, res) => {
    const { student_name, date_of_birth, date_of_admission, class_id } = req.body;
    const query = 'INSERT INTO students_list (student_name, date_of_birth, date_of_admission, class_id) VALUES (?, ?, ?, ?)';
    db.query(query, [student_name, date_of_birth, date_of_admission, class_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Student added successfully', id: results.insertId });
    });
});

// API route to update a student's details
app.put('/:id', (req, res) => {
    const { id } = req.params;
    const { student_name, date_of_birth, date_of_admission, class_id } = req.body;
    const query = 'UPDATE students_list SET student_name = ?, date_of_birth = ?, date_of_admission = ?, class_id = ? WHERE id = ?';
    db.query(query, [student_name, date_of_birth, date_of_admission, class_id, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Student updated successfully' });
    });
});

// API route to delete a student
app.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM students_list WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Student deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
