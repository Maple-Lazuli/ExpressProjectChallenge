const express = require('express')
const app = express()
const students = require('./studentData.json')
const bodyParser = require('body-parser')
const fs = require('fs');
let rawdata = fs.readFileSync('studentData.json');
let studentData = JSON.parse(rawdata);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

 app.get('/students/', (req, res) => res.send(studentData))
 http://localhost:3000/students/
app.get('/students/student/:id', (req, res) => {
    res.send(studentData.filter(student => student.id == req.params.id)[0])
})
http://localhost:3000/students/student/3

app.get('/students/search/', (req, res) => {
    // res.send(res.query)
    //res.send(studentData.filter(student => student.id == req.query.id))


    //Verify that parameters are searchable
    let queryParams = Object.keys(req.query).filter(item => Object.keys(studentData[0]).includes(item))
    let invalidParams =  Object.keys(req.query).filter(item => !Object.keys(studentData[0]).includes(item))
    let returnData = []

     //Invalid request since none of the parameters are in the student object
    if (queryParams.length === 0) {
        result = { status: "Failed", message: "Invalid Search parameters" }
        res.status(400)
        res.send(result)
    } else { //Search on the valid parameters (peforms logical AND on valid parameters)
        let toPush
        
        studentData.forEach(student => { //For each student, see if the student has the desired values for each property
            toPush = true
            queryParams.forEach(key => {
                if(req.query[key] != student[key])
                    toPush = false
            })
            if(toPush)
                returnData.push(student)
        });

        invalidParams.length>0 ? res.send([{"Invalid Search Parameters": invalidParams},returnData]) : res.send(returnData)
    }
})
//http://localhost:3000/students/search/?firstName=Calissa
app.get('/grades/:id', (req, res) => {
    res.send(studentData.filter(student => student.id == req.params.id)[0].grades)
})
//http://localhost:3000/grades/3



app.post('/grades', (req, res) => {
    let studentID = req.body.id
    let studentGrade = req.body.grade

    if((studentID !== undefined) && (studentGrade !== undefined))  { //make sure that both an ID and grade are included
         //makesure userID is valid
         student =studentData.filter(student => student.id == studentID)
         if(student.length !== 0){
            student[0].grades.push(parseInt(studentGrade))
            student[0].gpa =  student[0].grades.reduce((a,c) => a + c)/student[0].grades.length
            result = {status: "success", message: `Grade of ${studentGrade} was added. Grades are now ${student[0].grades}. New GPA is ${student[0].gpa}`}
            res.status(200)
         } else{
            result = {status: "Failed", message: "Student Not Found"}
            res.status(400)
         }
    } else {
         result = {status: "Failed", message: "Invalid POST. ID and Grade are required."}
        res.status(400)
    }
   res.json(result)
})

app.post('/register', (req, res) => {
    let fName = req.body.firstName
    let lName = req.body.lastName

    if((fName !== undefined) && (lName !== undefined))  { //make sure that both an ID and grade are included
        queryParams = Object.keys(req.body).filter(item => Object.keys(studentData[0]).includes(item))
        //template Student
        let studentTemplete = {
            firstName:  '',
            lastName: '',
            id : '',
            major : '',
            gender : '',
            year : '',
            grades:[],
            gpa : ''
        }
        let newStudent ={ 
            ...studentTemplete,
        }
        queryParams.forEach(key =>{
            newStudent[key] = req.body[key]
        })

        newStudent.id = studentData.length + 1
        studentData.push(newStudent)
        result ={status:"Success", message: `Student was added with the following parameters: ${JSON.stringify(newStudent)}`}

    } else {
         result = {status: "Failed", message: "Invalid POST. FirstName and Lastname are required at minimum"}
        res.status(400)
    }
   res.json(result)
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