//Generate Data for the project :)
const fs = require('fs');

let numStudents = 100
let majors = ['Mathematics', 'English', 'Lojban', 'Chemistry','Physics','Computer Science', 'Information Systems']
let genders = ['Male', 'Female','Male', 'Female','Male', 'Female','Male', 'Female', 'Other'] //Make other genders less likely
let year = ['1','1','1','1','1','2','2','2','3','3','4']  //Make higher year students less likely

let studentTemplete = {
    id : '',
    major : '',
    gender : '',
    year : '',
    gpa : ''
}
let currentStudent = {}
let studentJSON = []

for(let i = 1; i < numStudents; i++){
    currentStudent = {...studentTemplete}
    currentStudent.id = i
    currentStudent.major = majors[Math.floor((Math.random() * majors.length))]
    currentStudent.gender = genders[Math.floor((Math.random() * genders.length))]
    currentStudent.year = year[Math.floor((Math.random() * year.length))]
    currentStudent.gpa = Math.floor((Math.random() * (100 - 51)) +  50)
    studentJSON.push(currentStudent)    
}

fs.writeFileSync('studentData.json', JSON.stringify(studentJSON))