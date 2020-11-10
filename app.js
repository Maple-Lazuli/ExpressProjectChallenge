const express = require('express')
const app = express()
const students = require('./studentData.json')
const bodyParser = require('body-parser')
const fs = require('fs');
let rawdata = fs.readFileSync('studentData.json');
let studentData = JSON.parse(rawdata);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//RETURNS ALL REGISTERED STUDENTS
 app.get('/students/', (req, res) => res.send(studentData))
 //http://localhost:3000/students/


 //RETURNS A STUDENT BY ID
app.get('/students/student/:id', (req, res) => {
    res.send(studentData.filter(student => student.id == req.params.id)[0])
})
//http://localhost:3000/students/student/3


//RETURNS THE RESULT OF A LOGICAL AND ON SEVERAL STUDENT VALUES
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


//UPDATES THE GRADES OF A STUDENT AND RECALCULATES THE GPA
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


//REGISTERS A NEW STUDENT USING THAT FOLLOWS THE TEMPLATE ON LINE 99
app.post('/register', (req, res) => {
    let fName = req.body.firstName
    let lName = req.body.lastName

    if((fName !== undefined) && (lName !== undefined))  { //make sure that both an ID and grade are included
        queryParams = Object.keys(req.body).filter(item => Object.keys(studentData[0]).includes(item))
        //template Student
        let newStudent = {
            firstName:  '',
            lastName: '',
            id : '',
            major : '',
            gender : '',
            year : '',
            grades:[],
            gpa : ''
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

const port = 3000
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
