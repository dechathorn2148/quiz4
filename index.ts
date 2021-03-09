import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { body, query, validationResult } from 'express-validator'

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3000
const SECRET = "SIMPLE_SECRET"

interface JWTPayload {
  username: string;
  password: string;
}

const members = require('./member.json')

app.get('/member', (req,res) => {
  res.json(members);
})

app.post('/login',
  (req, res) => {

    const { username, password } = req.body
    // Use username and password to create token.
    const body = req.body
    const raw = fs.readFileSync('member.json', 'utf8')
    const db = JSON.parse(raw)
    const user = db.members.find((members: any) => members.username === body.username)
    if (!user) {
      res.status(400)
      res.json({ message: 'Invalid username or password' })
      return
    }
    if (!bcrypt.compareSync(body.password, user.password)) {
      res.status(400)
      res.json({ message: 'Invalid username or password' })
      return
    }

    jwt.sign({username,password},'secretkey', (err: any,token: any) => {
      res.status(200).json({
        message: 'Login succesfully',
        token 
      });
    });

  })

app.post('/register',
  (req, res) => {
    
    const { username, password, firstname, lastname, balance } = req.body
    members.push({ username, password, firstname, lastname, balance });
    res.status(200).json({
      "message": "Register successfully"
    }
    );

  })

app.get('/balance',
  (req, res) => {
    const token = req.query.token as string
    try {
      const { username } = jwt.verify(token, SECRET) as JWTPayload
  
    }
    catch (e) {
      //response in case of invalid token
    }
  })

app.post('/deposit',
  body('amount').isInt({ min: 1 }),
  (req, res) => {

    //Is amount <= 0 ?
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ message: "Invalid data" })
  })

app.post('/withdraw',
  (req, res) => {
  })

app.delete('/reset', (req, res) => {

  //code your database reset here
  members.splice(0);
  
  return res.status(200).json({
    message: 'Reset database successfully'
  })
})

app.get('/me', (req, res) => {
  res.send({
    "firstname": "Dechathorn",
    "lastname" : "Intravijit",
    "code" : 620612148,
    "gpa" : 4.00
  }
  )
})

app.get('/demo', (req, res) => {
  return res.status(200).json({
    message: 'This message is returned from demo route.'
  })
})

app.listen(PORT, () => console.log(`Server is running at ${PORT}`))