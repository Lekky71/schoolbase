$(document).ready(function ($) {

    $.storeUserDataInSession = function(studentObject) {
        let userObjectString = JSON.stringify(studentObject);
        window.sessionStorage.setItem('studentObject',userObjectString)
    };
    $.getUserDataFromSession = function() {
        let userData = window.sessionStorage.getItem('studentObject');
        return JSON.parse(userData);
    };

    let studentObj = $.getUserDataFromSession();
    // document.write(studentObj);
    $('#name').val(studentObj.name);
    $('#matricNumber').val(studentObj.matric_number);
    $('#faculty').val(studentObj.faculty);
    $('#department').val(studentObj.department);
    $('#age').val(studentObj.age);
    $('#cgpa').val(studentObj.cgpa);
    $('#level').val(studentObj.level);
    $('#country').val(studentObj.country);
    $('#state').val(studentObj.state);
    $('#about').val(studentObj.about);

    $('#update-form').submit(function (event) {
        event.preventDefault();
        let item = $('form input');
        let student = {item: item.val()};

        $.ajax({
            type : 'PUT',
            url : '/students/view/all-students/edit',
            data : $('#update-form').serialize(),
            success : function (data) {
                location.reload();
            }
        });
        return false;
    });
});