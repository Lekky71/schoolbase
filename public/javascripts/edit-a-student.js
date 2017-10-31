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

        console.log($('#matricNumber').val());
        $(this).ajaxSubmit({
            type : 'PUT',
            data: {
                name: $('#name').val(),
                matric_number: $('#matricNumber').val(),
                faculty: $('#faculty').val(),
                department: $('#department').val(),
                age: $('#age').val(),
                cgpa: $('#cgpa').val(),
                level: $('#level').val(),
                country: $('#country').val(),
                state: $('#state').val(),
                pic_url: `/public/images/studentsImages/${$('#matricNumber').val()}.jpg`,
                about: $('#about').val()
            },
            contentType: 'application/json',
            success: function(data){
                let res = eval(data);
                if(res.n === 1 && res.ok === 1){
                    let reply = '<p>Student has been successfully updated </p>';
                    $(reply).appendTo('#input-container');
                }
            }
        });
        return false;
    });
});