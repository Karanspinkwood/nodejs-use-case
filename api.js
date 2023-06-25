const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let students = [
  {
    id: 1,
    name: 'John Doe',
    section: 'A',
    gpa: 3.8,
    nationality: 'USA'
  },
  {
    id: 2,
    name: 'Jane Smith',
    section: 'B',
    gpa: 3.9,
    nationality: 'Canada'
  }
];

let nextStudentId = 3; // Initialize the next available student ID

// Custom middleware to log request details
app.use((req, res, next) => {
  console.log(`Request #${req.id}: ${req.method} ${req.url}`);
  next();
});

// Endpoint to add a student
app.post('/', (req, res) => {
  const { id, name, section, gpa, nationality } = req.query;
  const newStudent = {
    id: parseInt(id) || nextStudentId,
    name: name || '',
    section: section || '',
    gpa: parseFloat(gpa) || 0,
    nationality: nationality || ''
  };
  students.push(newStudent);
  if (!id) {
    nextStudentId++;
  }
  res.status(201).json({ message: 'Student added successfully' });
});


// Endpoint to retrieve all students
app.get('/', (req, res) => {
  res.json(students);
});

// Endpoint to retrieve a student by id or section
app.get('/:identifier', (req, res) => {
  const identifier = req.params.identifier;
  const student = students.find(
    s => s.id === parseInt(identifier) || s.section === identifier
  );
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Endpoint to update a student by id
app.put('/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const { name, section, gpa, nationality } = req.body;

  let updated = false;
  students = students.map(student => {
    if (student.id === studentId) {
      student.name = name || student.name;
      student.section = section || student.section;
      student.gpa = gpa || student.gpa;
      student.nationality = nationality || student.nationality;
      updated = true;
    }
    return student;
  });

  if (updated) {
    res.json({ message: 'Student updated successfully' });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});



// Endpoint to delete a student by id
app.delete('/:id', (req, res) => {
  const studentIndex = students.findIndex(
    s => s.id === parseInt(req.params.id)
  );
  if (studentIndex !== -1) {
    students.splice(studentIndex, 1);
    res.json({ message: 'Student deleted successfully' });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
