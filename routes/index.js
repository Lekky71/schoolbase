let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient; //to connect to mongodb
let multer = require("multer"); //for image upload
let fs = require('fs');
let path = require('path');

// let dbUrl = "mongodb://localhost:27017/mydb"; //local Mongo server
let dbUrl = 'mongodb://hashcode:hashcode@ds229415.mlab.com:29415/schoolbase'; //online Mongo server
let app = express();
let db; //global

MongoClient.connect(dbUrl, function (err, database) { //Connecting to the database
    if(!err) db = database; //setting the global variable
});

app.use(bodyParser.urlencoded({extended: true}));
let viewFolder = __dirname.replace('routes','views'); //view folder

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(`${viewFolder}/homepage.html`);
});

router.get('/students/view/all-students', function (req, res) { //all students page
        // console.log('Connected to the database');
        db.collection("all-students").find({}).toArray(function (err, result) {
            // if (err) throw err;
            // console.log('successfully fetched all students');
            res.send(result);
        });
});

router.get('/students/view/all-students/student',function (req, res) { //view one student
    let query = req.query.matricNumber;
        db.collection('all-students').find({matric_number: query}).toArray(function (err, result) {
            // if (err) throw err;
            res.send(result[0]);
            // console.log(result[0]);
        });
});

router.get('/students/view/search', function (req, res) { //searching
    // console.log(req.query.searchName);
    let query = req.query.searchName;
    let exp = "/"+ query + "$/i";
       // console.log('found the students searched for');
       db.collection('all-students').find({ name : {$regex: `${query}*`, $options:'i'}}).toArray(function (err, result) {
            res.send(result);
        });
});

let imageStorage = viewFolder.replace('views','')+'public/images/studentsImages'; //image folder path

let storageRes = multer.diskStorage({           //Multer
    destination: function(req, file, callback){
        callback(null, imageStorage); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, 'profilePicture' + '.jpg'); // set the file name and extension
    }
});

let uploader = multer({storage: storageRes}).single('pic'); //multer middleware for image upload

router.post('/students/edit/add-student', uploader, function (req, resp) { //adding a stude
    // console.log(req);
    let name = req.body.name;
    let matricNumber = req.body.matricNumber;
    let faculty = req.body.faculty;
    let department = req.body.department;
    let age = req.body.age;
    let cgpa = req.body.cgpa;
    let level = req.body.level;
    let country = req.body.country;
    let state = req.body.state;
    let pic = req.body.pic;
    let about = req.body.about;

    let theStudent = {  //Student Object
        name: name,
        matric_number: matricNumber,
        faculty: faculty,
        department: department,
        age: age,
        cgpa: cgpa,
        level: level,
        country: country,
        state: state,
        pic_url: '/images/studentsImages/'+ matricNumber.toString().replace(/\//g,'-')+'.jpg',
        about: about
    };
    // console.log(viewFolder.replace('views','')+'public/images/studentsImages');

    // console.log(req.file.filename);

    db.collection('all-students').find({matric_number: matricNumber}).toArray(function (err, result) {
        console.log(result);
        if(result.length === 0){
            uploader(req,resp,function (err) {
                if(err) throw err;
                let preImgPath = path.join('public','images','studentsImages','profilePicture.jpg');
                let newImagePath = path.join('public','images','studentsImages',matricNumber.toString().replace(/\//g,'-')+'.jpg');
                fs.rename(preImgPath,newImagePath, //this is for changing the filename to the matric number after upload
                    function (err) {
                        if(err) throw err;
                        db.collection('all-students').insertOne(theStudent, function (err, res) {
                            // console.log('Student has been added to the database');
                            resp.send(res);
                            // console.log(theStudent);
                        });
                    });
            });
        }
        else {
            let alreadyExistResponse = {
                n : 0,
                ok : 0
            };
            resp.send(alreadyExistResponse);
        }
    });


});

router.delete('/students/view/all-students/student/delete',function (req, res) { //deleting a student
    let student = req.query.student;
    let newImagePath = path.join('public','images','studentsImages',student.toString().replace(/\//g,'-')+'.jpg');
    fs.unlink(newImagePath, function (error) { //deleting the student picture
        if (error) throw error;
            db.collection('all-students').deleteOne({matric_number: student}, function (err, obj) {
                // console.log('One document deleted');
                // console.log(student.name);
                // console.log(obj.deletedCount);
                res.send(obj.deletedCount.toString()); //info about the deleted document
            });
        // console.log('Deletion sucessful.');
    });

});

router.put('/students/view/all-students/edit', uploader, function (req, res) { //Student update
    let name = req.body.name;
    let matricNumber = req.body.matricNumber;
    let faculty = req.body.faculty;
    let department = req.body.department;
    let age = req.body.age;
    let cgpa = req.body.cgpa;
    let level = req.body.level;
    let country = req.body.country;
    let state = req.body.state;
    let pic = req.body.pic;
    let about = req.body.about;
    let theStudent = {
        name: name[0],
        matric_number: matricNumber,
        faculty: faculty[0],
        department: department[0],
        age: age[0],
        cgpa: cgpa[0],
        level: level[0],
        country: country[0],
        state: state[0],
        pic_url: '/images/studentsImages/'+ matricNumber.toString().replace(/\//g,'-')+'.jpg',
        about: about[0]
    };
    // console.log(req.file.filename);
    uploader(req,res,function (err) { //image upload
        if(err) throw err;
        let preImgPath = path.join('public','images','studentsImages','profilePicture.jpg');
        let newImagePath = path.join('public','images','studentsImages',matricNumber.toString().replace(/\//g,'-')+'.jpg');
        fs.rename(preImgPath,newImagePath, //renaming image
            function (err) {
                if(err) throw err;
                    db.collection('all-students').updateOne({matric_number : matricNumber},theStudent, function (err, result) {
                        // console.log('One Student Updated');
                        res.send(result); //info about the deleted document
                    });
                // console.log(theStudent);
            });
    });

});


module.exports = router;

/* All console.log() statements are commented out because they are only used for debugging*/