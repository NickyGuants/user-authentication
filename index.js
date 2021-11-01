const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

app.use(express.json())

const users = [
  
]

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users/signup', async (req, res) => {
  try {
    const capsAndNumber = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"
    );
    const numberOfCharacters = new RegExp("^(?=.{8,})");
    const specialCharacters = new RegExp("^(?=.*[!@#$%^&*])");
    const { email, username, password, confirmPassword } = req.body;


    //ensure the user has entered an email address
    if (!email) {
      res.status(406).send("Fill in your email please.");
    }
    //ensure the user has entered a username
    if (!username) {
      res.status(406).send("fill in your username");
    }
    //ensure the user has entered a password
    if (!password) {
      res.status(406).send("fill in your password");
    }
    //ensure the user has confirmed their passoword
    if (!confirmPassword) {
      res.status(406).send("You must fill in the confirm password field");
    }

    //Check that the password is eight characters long
    if (!numberOfCharacters.test(password)) {
      res
        .status(406)
        .send(
          "Password must be atleast 8 characters long"
        );
    }
    //Check that the password contain special characters
    if (!specialCharacters.test(password)) {
      res
        .status(406)
        .send(
          "Password must contain special characters"
        );
    }
    //Check that the password contain small letters, caps, and numbers
    if (!capsAndNumber.test(password)) {
      res
        .status(406)
        .send(
          "Password must have small letters, caps and numbers  "
        );
    }

    //Check that the password is the same as the confirm password field
    if (password !== confirmPassword) {
      res.status(406).send("password and Confirm password entries should match.")

      //Use bcrypt to hash the password and add the user to the users array
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = { username, email, password: hashedPassword }
      users.push(user)
      console.log(users)
      res.status(201).send("user added successfully")
    }
    //return any other error
  } catch {
    res.status(500).send()
  }
});

//login route
app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(401).json({ message: "No such user exists" });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
          return res.status(401).json({ message: "wrong password" });
        }
        jwt.sign({ email: user.email, username: user.username, password: user.password }, 'secretkey', (err, token) => {
          return res.status(200).json({
            message: "login sucessful",
            token
          });
        });
      });
    }
  } catch (error) {
    res.status(500).send();
  }
}
)

app.listen(3000)



