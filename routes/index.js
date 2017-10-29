let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;

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
        if (err) throw err;
        console.log('Connected to the database');
        db.collection("all-students").find({}).toArray(function (err, result) {
            if (err) throw err;
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
        if (err) throw err;
        db.collection('all-students').find({matric_number: query}).toArray(function (err, result) {
            if (err) throw err;
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
       if(err) throw err;
       console.log('found the students searched for');
       db.collection('all-students').find({ name : {$regex: `${query}*`, $options:'i'}}).toArray(function (err, result) {
           if (err) throw err;
            res.send(result);
        });
    });
});

router.post('/students/edit/add-student', function (req, res) {
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
        pic_url: pic,
        about: about
    };
    console.log(theStudent);
    insertStudent(theStudent, res);

});

router.delete('/students/view/all-students/student/delete',function (req, res) {
    console.log(req.query);
    let student = req.query.student;
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) throw err;
        db.collection('all-students').deleteOne({matric_number: student}, function (err, obj) {
            if (err) throw err;
            console.log('One document deleted');
            console.log(student.name);
            db.close();
            console.log(obj.deletedCount);
            res.send(obj.deletedCount.toString()); //info about the deleted document
        });
    });

});

router.post('/students/view/all-students/edit', function (req, response) {
    let oldStudent = {};
    let newStudent = {};
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) throw err;
        db.collection('all-students').updateOne(oldStudent,newStudent, function (err, res) {
            if (err) throw err;
            console.log('One document deleted');
            db.close();
            response.send(res); //info about the deleted document
        });
    });
});
module.exports = router;


function insertStudent(theStudent, resp) {
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) throw err;
        db.collection('all-students').insertOne(theStudent, function (err, res) {
            if (err) throw err;
            console.log('Student has been added to the database');
            resp.send(res);
            // resp.render('add_a_student', {title: 'Add A Student'});
            // resp.send(`Student ${theStudent.name} has been added`);
            db.close();
        });
    });
}