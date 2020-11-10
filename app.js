const express = require('express')
const app = express()
const users = require('./users.json')
const bodyParser = require('body-parser')
const fs = require('fs');
const { RSA_NO_PADDING } = require('constants');
let rawdata = fs.readFileSync('studentData.json');
let studentData = JSON.parse(rawdata);


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/students', (req, res) => res.send(studentData))

app.get('/students/search', (req, res) => {
    //student Object Template
    let studentTemplete = {
        id : '',
        major : '',
        gender : '',
        year : '',
        gpa : ''
    }
    //Extract the parameters that are in the student template
    let queryParams = Object.keys(req.query)
    let queryParams = queryParams.filter(item => Object.keys(studentTemplete).includes(item))
    let returnData = []
    if(queryParams.length === 0){ //Invalid request
        result = {status: "Failed", message: "Invalid parameters"}
        res.status(400)
        res..send(result)
    } else {
        res.status(200)
        res.send(studentData.find(student => queryParams.filter(key => req.query.key === student.key)))
    }
})

// app.post('/', (req, res) => {
//     let name = req.body.name
//     if(name !== undefined) { //forces name to exist to continue. A name is mandatory.
//         let newUserID = 1000
//         req.body.id = newUserID
//         users.push(req.body)
//          result = {status: "success", message: "The user was added"}
//     } else {
//          result = {status: "Failed", message: "The  was not added"}
//         res.status(400)
//     }
//    res.json(result)
// })

// app.get('/search', (req, res) => { //?name=?
//     //res.send(res.query)
//     let name = req.query.name
//     res.send(usersData.find(user => user.name[0] == name || user.name[1] == name ))
// })

const port = 3000
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

/*
http://localhost:3000/users/?id=1
http://localhost:3000/users/
http://localhost:3000/search/?name=Shana
*/