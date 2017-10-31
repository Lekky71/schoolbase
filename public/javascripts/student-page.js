$(document).ready(function($) {
    let studentObj;
    let link = window.document.location;
    let errorresp = '<p style="font-size: large">Sorry, student does not exist on records</p>';
    let matricNumber = link.toString().split('=')[1];

    let showDialog = function (){
        document.getElementById("overlay").style.display = "block";
    };

    let hideDialog = function () {
        document.getElementById("overlay").style.display = "none";
    };


    $.storeUserDataInSession = function(studentObject) {
        let userObjectString = JSON.stringify(studentObject);
        window.sessionStorage.setItem('studentObject',userObjectString)
    };
    $.getUserDataFromSession = function() {
        let userData = window.sessionStorage.getItem('studentObject');
        return JSON.parse(userData);
    };

    showDialog();
    $.get(`/students/view/all-students/student?matricNumber=${matricNumber}`, function (resp) {
        let data = eval(resp);
        $.studentObj = {name : $.data.name, matric_number : $.data.matricNumber };
        // document.write(resp);
        console.log(resp);
        hideDialog();
        try{
            if(data.name !== ''){
                $.fillDetails(data);
                $.setDelete(resp);
                $.storeUserDataInSession(resp);
                $('#student-image').attr('src', data.pic_url);
            }
        }
        catch (err){
            $(errorresp).appendTo('#student-info');
            $('#delete-student-button').hide();
            $('#student-image').hide();
        }

        // console.log(resp);
    });

    $.fillDetails = function(student){

        $('title').html(`${student.name}`);
      let content =  `<p><h2>${student.name}</h2></p>`+
          `<div class="col-md-7 row ">`+
            `<label>Matriculation Number :</label><p class="student-info">${student.matric_number}</p></div>`+
            `<div class="col-md-7 row">`+
            `<label>Faculty :</label>`+
        `<p class="student-info">${student.faculty}</p></div>`+
            `<div class="col-md-7 row"><label>Department  :</label> <p class="student-info">${student.department}</p></div>`+
            `<div class="col-md-7 row"><label>Student\'s age  :</label> <p class="student-info">${student.age}</p></div>`+
            `<div class="col-md-7 row"><label>Cumulative Grade Point Average  :</label> <p class="student-info">${student.cgpa}</p></div>`+
            `<div class="col-md-7 row"><label>State  :</label> <p class="student-info">${student.state}</p></div>`+
            `<div class="col-md-7 row"><label>Country  :</label> <p class="student-info">${student.country}</p></div>`+
            `<div class="col-md-7 row"><label>About  :</label> <p class="student-info">${student.about}</p></div>`;

        $(content).appendTo('#student-info');
    };

    $.setDelete = function (student) {
        $('#delete-student-button').on('click',function () {
            $.ajax({
                url : '/students/view/all-students/student/delete?student='+student.matric_number,
                type : 'DELETE',
                dataType : 'json',
                success : function(result){
                    // document.write(result);
                    if(result === 1){
                        alert('Student has been deleted');
                        window.document.location = 'all-students.html';
                        // window.location.reload();
                    }

                }
            });
        });


    };


});
