let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;
let multer = require("multer");
let fs = require('fs');
let path = require('path');

// let dbUrl = "mongodb://localhost:27017/mydb";
let dbUrl = 'mongodb://hashcode:hashcode@ds229415.mlab.com:29415/schoolbase';
let app = express();


// let urlencodedParser = bodyParser.urlencoded({extended : true});
app.use(bodyParser.urlencoded({extended: true}));
let viewFolder = __dirname.replace('routes','views');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(`${viewFolder}/homepage.html`);
});

router.get('/students/view/all-students', function (req, res) {
    MongoClient.connect(dbUrl, function (err, db) {
        // if (err) throw err;
        console.log('Connected to the database');
        db.collection("all-students").find({}).toArray(function (err, result) {
            // if (err) throw err;
            console.log('successfully fetched all students');
            db.close();
            res.send(result);
        });
    });
});

router.get('/students/view/all-students/student',function (req, res) {
    let query = req.query.matricNumber;
    // let newQuery = query.replace(/%2F/gi,'/');
    MongoClient.connect(dbUrl, function (err, db) {
        // if (err) throw err;
        db.collection('all-students').find({matric_number: query}).toArray(function (err, result) {
            // if (err) throw err;
            res.send(result[0]);
            console.log(result[0]);
            db.close();
        });
    });
});

router.get('/students/view/search', function (req, res) {
    console.log(req.query.searchName);
    let query = req.query.searchName;
    let exp = "/"+ query + "$/i";
    MongoClient.connect(dbUrl, function (err, db) {
       // if(err) throw err;
       console.log('found the students searched for');
       db.collection('all-students').find({ name : {$regex: `${query}*`, $options:'i'}}).toArray(function (err, result) {
           // if (err) throw err;
            res.send(result);
        });
    });
});
let imageStorage = viewFolder.replace('views','')+'public/images/studentsImages';
let storageRes = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, imageStorage); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, 'profilePicture' + '.jpg'); // set the file name and extension
    }
});

let uploader = multer({storage: storageRes}).single('pic');

router.post('/students/edit/add-student', uploader, function (req, res) {
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
    // console.log(req);
    let theStudent = {
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
    console.log(viewFolder.replace('views','')+'public/images/studentsImages');

    console.log(req.file.filename);
    uploader(req,res,function (err) {
        if(err) throw err;
        let preImgPath = path.join('public','images','studentsImages','profilePicture.jpg');
        let newImagePath = path.join('public','images','studentsImages',matricNumber.toString().replace(/\//g,'-')+'.jpg');
        fs.rename(preImgPath,newImagePath,
            function (err) {
                if(err) throw err;
                insertStudent(theStudent, res);
                console.log(theStudent);
        });
    });
});

router.delete('/students/view/all-students/student/delete',function (req, res) {
    console.log(req.query);
    let student = req.query.student;
    MongoClient.connect(dbUrl, function (err, db) {
        // if (err) throw err;
        db.collection('all-students').deleteOne({matric_number: student}, function (err, obj) {
            // if (err) throw err;
            console.log('One document deleted');
            console.log(student.name);
            db.close();
            console.log(obj.deletedCount);
            res.send(obj.deletedCount.toString()); //info about the deleted document
        });
    });

});

router.put('/students/view/all-students/edit', uploader, function (req, res) {
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
        matric_number: matricNumber[0],
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
    // console.log(req.params.newStudent);
    console.log(req.file.filename);
    uploader(req,res,function (err) {
        if(err) throw err;
        let preImgPath = path.join('public','images','studentsImages','profilePicture.jpg');
        let newImagePath = path.join('public','images','studentsImages',matricNumber.toString().replace(/\//g,'-')+'.jpg');
        fs.rename(preImgPath,newImagePath,
            function (err) {
                if(err) throw err;
                MongoClient.connect(dbUrl, function (err, db) {
                    // if (err) throw err;
                    db.collection('all-students').updateOne({matric_number : matricNumber},theStudent, function (err, result) {
                        // if (err) throw err;
                        console.log('One Student Updated');
                        db.close();
                        res.send(result); //info about the deleted document
                    });
                });
                console.log(theStudent);
            });
    });

});


module.exports = router;


function insertStudent(theStudent, resp) {
    MongoClient.connect(dbUrl, function (err, db) {
        // if (err) throw err;
        db.collection('all-students').insertOne(theStudent, function (err, res) {
            // if (err) throw err;
            console.log('Student has been added to the database');
            resp.send(res);
            // resp.render('add_a_student', {title: 'Add A Student'});
            // resp.send(`Student ${theStudent.name} has been added`);
            db.close();
        });
    });
}