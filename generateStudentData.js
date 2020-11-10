//Generate Data for the project :)
const fs = require('fs');

let numStudents = 20000
let majors = ['Mathematics', 'English', 'Lojban', 'Chemistry','Physics','Computer Science', 'Information Systems']
let genders = ['Male', 'Female','Male', 'Female','Male', 'Female','Male', 'Female', 'Other'] //Make other genders less likely
let year = ['1','1','1','1','1','2','2','2','3','3','4']  //Make higher year students less likely
let firstNames = fs.readFileSync("fnames.txt").toString().split("\n")
let lastNames =  fs.readFileSync("lnames.txt").toString().split("\n")

//Fix case on last names
fixedLastNames = lastNames.map(name =>{
     lame = name.toLowerCase()
     name = lame.charAt(0).toUpperCase() + lame.slice(1);
     return name
})
let studentTemplete = {
    firstName:  '',
    lastName: '',
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
    currentStudent.firstName = firstNames[Math.floor((Math.random() * firstNames.length))]
    currentStudent.lastName = fixedLastNames[Math.floor((Math.random() * fixedLastNames.length))]
    currentStudent.grades =[]
    for(let j = 0; j < 20;j++)
        currentStudent.grades.push(Math.floor((Math.random() * (100-61)))+60)
    currentStudent.id = i
    currentStudent.major = majors[Math.floor((Math.random() * majors.length))]
    currentStudent.gender = genders[Math.floor((Math.random() * genders.length))]  //There is no correlation between name and gender here
    currentStudent.year = year[Math.floor((Math.random() * year.length))]
    currentStudent.gpa = currentStudent.grades.reduce((a,c) => a + c)/currentStudent.grades.length
    studentJSON.push(currentStudent)    
}

fs.writeFileSync('studentData.json', JSON.stringify(studentJSON))