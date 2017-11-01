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
          `<div class="col-md-7 row">`+
            `<label>Matriculation Number : ${student.matric_number}</div>`+
            `<div class="col-md-7 row">`+
            `<label>Faculty :</label>  ${student.faculty}</div>`+
            `<div class="col-md-7 row"><label>Department  :</label>   ${student.department}</div>`+
            `<div class="col-md-7 row"><label>Student\'s age  :</label>  ${student.age}</div>`+
            `<div class="col-md-7 row"><label>Cumulative Grade Point Average  :</label>  ${student.cgpa}</div>`+
            `<div class="col-md-7 row"><label>State  :</label>  ${student.state}</div>`+
            `<div class="col-md-7 row"><label>Country  :</label>  ${student.country}</div>`+
            `<div class="col-md-7 row"><label>About  :</label>  ${student.about}</div>`;

        $(content).appendTo('#student-info');
    };

    $.setDelete = function (student) {
        $('#delete-student-button').on('click',function () {
            showDialog();
            $.ajax({
                url : '/students/view/all-students/student/delete?student='+student.matric_number,
                type : 'DELETE',
                dataType : 'json',
                success : function(result){
                    // document.write(result);
                    if(result === 1){
                        hideDialog();
                        alert('Student has been deleted');
                        window.document.location = 'all-students.html';
                        // window.location.reload();
                    }

                }
            });
        });


    };


});
