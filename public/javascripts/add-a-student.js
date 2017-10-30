$(document).ready(function () {

    $('form').on('submit', function () {
        let item = $('form input');
        let student = {item: item.val()};

        $.ajax({
            type : 'POST',
            url : '/students/edit/add-student',
            data : student,
            success : function (data) {
                location.reload();
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