// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./models/database');
const User = require('./routes/register');
const Login = require("./routes/LoginUser")
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const CreateModel = require("./routes/Create");
const { add } = require('../Frontend/src/Redux/User');
const JWT_Key = "fyr74647y7v65656783456789fghtrh{}tr66vbyf7fbv7vb";
const multer = require('multer');
const path = require('path');
const app = express();
const port = 4000;
app.use(cors()); // Enable CORS for your app
app.use(bodyParser.json()); // Use JSON body parser
app.use(express.urlencoded({ extended: true })); // Use URL-encoded body parser
app.use(express.json())

//  Post method for Register User
app.post('/register', async (req, res) => {

  let { firstName, lastName, email, password } = req.body;
  email = email.toLowerCase();


  const encryptedPassword = await bcrypt.hash(password, 10);

  // Server-side validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: 'Email is already registered' });
    }
    // Create a new user
    const newUser = new User({ firstName, lastName, email, password: encryptedPassword });
    // Save the user to the database
    await newUser.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

//  get method for Register User
app.get("/register", async (req, res) => {
  try {
    const getD = req.body;
    const std = await User.find(getD);
    res.send(std);
  } catch (e) {
    res.send(e);
  }
});

// Post method for Login user
app.post("/LoginUser", async (req, res) => {

  let { email, password } = req.body;
  email = email.toLowerCase();
  try {
    // Find the user by email in your User model
    const user = await User.findOne({ email });
    // Check if the user exists
    if (!user) {
      return res.status(200).json({ message: "User does not exist", success: false });
    }
    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password", success: false });
    }
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_Key, { expiresIn: '1h' });

    res.status(200).json({ status: "ok", data: token, success: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get method for Login user
app.get("/LoginUser", async (req, res) => {
  try {
    const getD = req.body;
    console.log(getD);
    const std = await User.find(getD);
    res.send({
      success: true,
      data: std,
      message: "Login successfully"
    });
  } catch (e) {
    res.send(e);
  }
});

// Post Method for Create User/ADD USER 
app.post("/Create", async (req, res) => {
  let { name, age, address, country, email } = req.body;
  email = email.toLowerCase();
  console.log("heloo", req.body);

  // Server-side validation
  if (!name || !age || !address || !country || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    // Check if the email already exists
    const existingUser = await CreateModel.findOne({ email: email });
    if (existingUser) {
      return res.json({ message: 'Email is already registered' });
    }
    // Create a new user
    const CreateUser = new CreateModel({ name: name, age: age, address: address, country: country, email: email });

    // Save the user to the database
    await CreateUser.save();
    res.json({ message: 'Created  User successfully' });
  } catch (error) {
    console.error('User Creation error:', error);
    res.status(500).json({ message: 'Error User Creation' });
  }
})

// Define a route to handle GET requests to fetch records
app.get('/getUser', async (req, res) => {
  try {
    const records = await CreateModel.find(); // Fetch all records from the MongoDB collection
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get method for fetch record to update the User
app.get("/getUpdateUser/:id", async (req, res) => {
  try {
    const id = req.params.id; // Retrieve email from URL parameter
    console.log(id);
    // Use findOne instead of findByEmail
    CreateModel.findById(id)
      .then(UpdateUser => {
        if (UpdateUser) {
          res.status(200).json(UpdateUser);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// post method for update the record 
app.put("/UpdateUser/:userId", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    let updatedUser;
    const userId = req.params.userId; // Retrieve userId from URL parameter
    const existingUser = await CreateModel.findOne({
      _id: { $ne: userId },
      email: req.body.email,
    });

    if (existingUser) {
      // Email already exists and belongs to a different user
      return res.json({ message: 'Email already in use' });
    }
    else {
      updatedUser = await CreateModel.findByIdAndUpdate(
        { _id: userId },
        {
          name: req.body.name,
          age: req.body.age,
          address: req.body.address,
          country: req.body.country,
          email: req.body.email.toLowerCase(),
        },
        { new: true }
      );
    }
    if (updatedUser) {
      return res.json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/DeleteUser/:userId', async (req, res) => {
  const userId = req.params.userId;
  CreateModel.findByIdAndDelete({ _id: userId })
    .then(result => res.json(result))
    .catch((err) => res.json(err));
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
