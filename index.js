const express = require('express');
const path = require('path');
const hoganMiddleware = require('hogan-middleware');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.engine('mustache', hoganMiddleware.__express);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const client = await MongoClient.connect(
      'mongodb+srv://lochanjangidcoder:*********@portfolio.way3kon.mongodb.net/',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const projects = client.db('portfolio').collection('projects');
    const blogs = client.db('portfolio').collection('blogs');
    await blogs.deleteMany({ title: "Blog Second" });

    const cursor = projects.find();
    const cursor1 = blogs.find();
    const result = await cursor.toArray();
    const result2 = await cursor1.toArray();

    const projectsData = result.map(project => ({
      image: project.image,
      title: project.title,
    }));

    const blogsData = result2.map(blog => ({
      image: blog.image,
      title: blog.title,
      disc: blog.disc,
    }));

    await client.close();

    res.render('index', { projects: projectsData, blogs: blogsData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/submit', async (req, res) => {
  try {
    const client = await MongoClient.connect(
      'mongodb+srv://lochanjangidcoder:********@portfolio.way3kon.mongodb.net/',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const contacts = client.db('portfolio').collection('contact');

    // Extract form data from request body
    const { name, email, message } = req.body;

    // Create a new contact document
    const contact = { name, email, message };

    // Insert the contact document into the 'contacts' collection
    await contacts.insertOne(contact);

    await client.close();

    res.render('success', {name});
  } catch (error) {
    console.error('Error:', error);
    res.render('500')
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
