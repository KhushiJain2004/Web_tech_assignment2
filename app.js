const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const session = require('express-session');

const app = express();


// Session middleware
app.use(session({
    secret: 'abc', // Specify a secret for session management
    resave: false,
    saveUninitialized: false
}));

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('./public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define User schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    country: String
}, { collection: 'registration' });

const User = mongoose.model('User', userSchema);

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://kj866795:LLCRlbvOJCFXkJjd@cluster0.hah8tdn.mongodb.net/web_tech', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
}).then(() => {
  console.log('Connected to database');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});

// Routes
app.get("/", (req, res) => {
    res.render('index');
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.get("/index", (req, res) => {
    res.render('index');
}); 

app.get("/register", (req, res) => {
    res.render('register');
});



app.get("/stargazing", async (req, res) => {
    try {
        // Fetch tour data from MongoDB using Mongoose
        const tours = await Tour.find();

        // Pass the fetched tour data to the template
        res.render('stargazing', { tours: tours });
    } catch (err) {
        console.error("Error fetching tour data:", err);
        res.status(500).send("Error fetching tour4 data");
    }
});



// Handle POST request for registration
app.post("/register", (req, res) => {
    console.log(req.body);
    const { name, email, password, country } = req.body;

    const newUser = new User({
        name,
        email,
        password,
        country
    });

    newUser.save()
        .then((user) => {
            req.session.user = user;
            // res.send("User registered successfully");
            res.render('login',{ username: req.session.user.name })

        })
        .catch((err) => {
            console.error("Error registering user:", err);
            res.status(500).send("Error registering user");
        });
});

// Handle POST request for login
app.post("/login", (req, res) => {
    const { name, password } = req.body;

    // Find user in the database based on username and password
    User.findOne({ name, password })
        .then((user) => {
            if (user) {
                // User found, authentication successful
                req.session.user = user;
                // res.send("login successfull")
                res.render("index",{ username: req.session.user.name });
            } else {
                // User not found or invalid credentials
                res.status(401).send("Invalid username or password");
            }
        })
        .catch((err) => {
            console.error("Error logging in:", err);
            res.status(500).send("Error logging in");
        });
});


//bookings
const tourSchema = new mongoose.Schema({
    name: String,
    description: String,
    duration: Number,
    price: Number,
    inclusions: [String],
    image:String
    // Other fields as needed
},{collection:"tours"});
const Tour = mongoose.model('Tour', tourSchema);

app.get("/booking/:tourId", (req, res) => {
    const tourId = req.params.tourId;

    // Fetch tour data from the database using the tourId
    Tour.findById(tourId)
        .then(tour => {
            if (!tour) {
                return res.status(404).json({ error: "Tour not found" });
            }
            res.render("booking", { tour: tour }); // Render bookings.ejs with tour data
        })
        .catch(err => {
            console.error("Error fetching tour:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
