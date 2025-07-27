const express = require('express');
const mysql = require('mysql');

// Create an Express application
const app = express();
const port = 5500;

// Create a MySQL connection
let connection;

try {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Agrasen@1',
    database: 'event_management'
  });

  // Connect to MySQL
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ', err);
      return;
    }
    console.log('Connected to MySQL');
  });
} catch (err) {
  console.error('Error establishing MySQL connection: ', err);
  process.exit(1); // Exit the Node.js process with status 1 indicating failure
}

// Set up middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (if needed)
app.use(express.static('public'));

// Define a route to handle form submission
app.post('/submit-form', (req, res) => {
  const formData = req.body;

  const query = 'INSERT INTO events (title, category, description, start_date, end_date, start_time, city, address, share_address, max_participants, min_age, other_requirements, approximate_cost, rules_guidelines, event_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  connection.query(query, [
    formData['event-title'], 
    formData.category, 
    formData.desc, 
    formData['start-d'], 
    formData['end-d'], 
    formData['start-t'], 
    formData.city, 
    formData.add, 
    formData.showadd === 'on' ? 1 : 0, // Checkbox handling: 'on' if checked, otherwise not present
    formData.quantity, 
    formData.age, 
    formData['other-req'], 
    formData.cost, 
    formData.rules, // Assuming there's a mistake since you've used `name="desc"` twice in your HTML
    formData['event-img'] // This will not work for file uploads as is; handling files requires different middleware
  ], (err, results) => {
    if (err) {
      console.error('Error inserting data into MySQL: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Form data inserted into MySQL');
    res.status(200).send('Form data submitted successfully');
  });
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/host.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

///////////////////////////////////////////////////////Revert back//////////////////////////////////
app.get('/events', (req, res) => {
  let sqlQuery = "SELECT * FROM events";
  connection.query(sqlQuery, (err, result) => {
    if (err) {
      console.error("Error retrieving data from MySQL:", err);
      res.status(500).send("An error occurred while retrieving data.");
      return;
    }
    
    res.json(result); // Send the result set as JSON response
  });
});

// Handle specific event details based on ID
app.get('/event/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let sqlQuery = "SELECT * FROM events WHERE id=?";
  connection.query(sqlQuery, [id], (err, result) => {
    if (err || !result[0]) {
      console.error("Event not found or error retrieving data from MySQL:", err);
      res.status(404).send("Event not found");
      return;
    }
    
    res.json(result[0]); // Send the single row result as JSON response
  });
});
////////////////////////////////
const fs = require('fs');

const htmlPath = '/Users/chitrasenrai/Desktop/SNEHA/index.html';
const serverPath = '/Users/chitrasenrai/Desktop/SNEHA/server.js';

fs.access(htmlPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`${htmlPath} does not exist`);
  } else {
    console.log(`${htmlPath} exists`);
  }
});

fs.access(serverPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`${serverPath} does not exist`);
  } else {
    console.log(`${serverPath} exists`);
  }
});