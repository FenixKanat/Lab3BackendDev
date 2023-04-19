require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken')
const { User } = require('./database');
const path = require('path');

var secretKey = process.env.TOKEN;

// Paths to find the ejs files. 
const app = express();
app.set('views', path.join(__dirname, 'Routes'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));

//Render register.ejs
app.get('/register', (req, res) => {
  res.render('register.ejs');
});

//Render login.ejs
app.get('/login', (req, res)=>{
    res.render('login.ejs')
})

//Adds new values to the table called User. 
// Encrypts the password using bcrypt.
// Try and catch for error handling.
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      password: hashedPassword,
    });

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error Occured');
  }
});


app.post('/login', async (req, res)=>{
    //contains value from User table, username.
    const findUser = await User.findOne({ where: {username: req.body.username } } ) ;
    console.log(req.body)

    //If this value is null, redirect to fail.ejs file.
    if(findUser === null){
        res.render('fail.ejs');

    }
    
    //if this value is not null, which means, exists, then redirect to start.ejs. 
    if(findUser != null){
       res.render('start.ejs');
       var token = jwt.sign({ username: findUser.username }, secretKey);
       console.log(token);
       
       return;
    }

    //Compare password
    const PasswordCheck = await bcrypt.compare(req.body.password, findUser.password);
    
    console.log('PasswordCheck:', PasswordCheck);
    if(PasswordCheck){
    res.render('start.ejs')
    
    }else{
    res.render('fail.ejs')
    }
})

app.listen(7000, () => {
  console.log('Server is listening on port 7000');
});
