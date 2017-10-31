$(document).ready(function () {

    let showDialog = function (){
        document.getElementById("overlay").style.display = "block";
    };

    let hideDialog = function () {
        document.getElementById("overlay").style.display = "none";
    };


    $('form').on('submit', function () {
        showDialog();
        let item = $('form input');
        let student = {item: item.val()};

        $.ajax({
            type : 'POST',
            url : '/students/edit/add-student',
            data : student,
            success : function (data) {
                hideDialog();
                let reply = 'Student has been successfully added';
                alert(reply);
                location.href = 'all-students.html'
            }
        });

        return false;
    });

    $('li').on('click', function () {
        $.ajax({
            type : 'POST',
            url : '/students/view',

        });
    });

});