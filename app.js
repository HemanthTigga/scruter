const { render } = require("ejs");
const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set("views",path.resolve(__dirname,"views"));
app.set("view engine","ejs");

const databaseUrl = "mongodb+srv://swarooppatil850:strongpass1234@cluster0.hdp22av.mongodb.net/?appName=Cluster0";

//Mongo DB
   
mongoose.connect(databaseUrl);

// Step 3: Create a Mongoose model for your posts
const foodSchema = new mongoose.Schema({
  title: String,
  image: String,
  location: String,
  latitude: String,
  longitude: String,
  description: String
});
const Food = mongoose.model('Food', foodSchema);

const houseSchema = new mongoose.Schema({
  title: String,
  image: String,
  location: String,
  rent: Number,
  latitude: String,
  longitude: String,
  description: String
});
const House = mongoose.model('House', houseSchema);

const marketSchema = new mongoose.Schema({
  title: String,
  image: String,
  location: String,
  price: Number,
  latitude: String,
  longitude: String,
  description: String
});
const Market = mongoose.model('Market', marketSchema);



//End Mongo DB

//Multer File upload

// Set up Multer storage and upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
  },
});

const upload = multer({ storage: storage });
//End multer

app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/house/form',(req,res)=>{
  res.render('house');
});
app.get('/food/form',(req,res)=>{
  res.render('food');
});
app.get('/market/form',(req,res)=>{
  res.render('market');
});


app.get('/house', async (req, res) => {
  //All
   try {
    const domain = req.get('host');
     // Fetch data from MongoDB
     const cards = await House.find();
 
     // Render the view with the fetched data
     res.render('display', {cards, domain, imagepath: "/house.jpg"});
   } catch (error) {
     console.error('Error fetching posts:', error);
     res.status(500).send('Internal Server Error');
   }
 
 });

app.post('/house',upload.single('image'), (req,res)=>{
 
  // Save the file path to MongoDB
  const imagePath = 'uploads/' + req.file.filename; // Adjust the path accordingly

// Step 4: Use the model to create and save a new post
req.body.image = imagePath;
const newHouse = new House(req.body);

newHouse.save()
.then((savedHouse) => {
  res.redirect('/house');
  console.log('House saved:', savedHouse, "Img path", imagePath);
})
.catch((error) => {
  console.error('Error saving House:', error);
});

});


app.get('/market', async (req, res) => {
  //All
   try {
     // Fetch data from MongoDB
     const domain = req.get('host');
     const cards = await Market.find();
 
     // Render the view with the fetched data
     res.render('display', {cards, domain, imagepath: "/market.jpg"});
   } catch (error) {
     console.error('Error fetching posts:', error);
     res.status(500).send('Internal Server Error');
   }
 
 });



app.post('/market',upload.single('image'), (req,res)=>{
 
  // Save the file path to MongoDB
  const imagePath = 'uploads/' + req.file.filename; // Adjust the path accordingly

// Step 4: Use the model to create and save a new post
req.body.image = imagePath;
const newMarket = new Market(req.body);

newMarket.save()
.then((savedMarket) => {
  res.redirect('/market');
  console.log('Market saved:', savedMarket, "Img path", imagePath);
})
.catch((error) => {
  console.error('Error saving food:', error);
});

});



app.get('/food', async (req, res) => {
 //All
  try {
    const domain = req.get('host');
    // Fetch data from MongoDB
    const cards = await Food.find();

    // Render the view with the fetched data
    res.render('display', {cards, domain, imagepath: "/food.jpg"});
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Internal Server Error');
  }

});



app.post('/food',upload.single('image'), (req,res)=>{
 
    // Save the file path to MongoDB
    const imagePath = 'uploads/' + req.file.filename; // Adjust the path accordingly
 
// Step 4: Use the model to create and save a new post
req.body.image = imagePath;
const newFood = new Food(req.body);

newFood.save()
  .then((savedFood) => {
    res.redirect('/food');
    console.log('Food saved:', savedFood, "Img path", imagePath);
  })
  .catch((error) => {
    console.error('Error saving food:', error);
  });

});


app.use((req,res)=>{
    res.status(404).render('404');
});
app.listen(8080, ()=>{
    console.log('Server listening on port 8080...')
});