
$(document).ready(function($){

    $('#search-student-form').submit(function(event){
        event.preventDefault();
        $.get('/students/view/search', $('#search-student-form').serialize(),function (data) {
            let myData = eval(data);
            let content = $.fillTable(myData);
            $('#search-able-body').html('');
            // let reply = '<p>Student has been successfully added </p>';
            $(content).appendTo('#search-table-body');
        });
    });

    // $.get('/students/view/all-students',function (resp) {
    //     let myData = eval(resp);
    //     let content = $.fillTable(myData);
    //     $('#table-body').html('');
    //     $(content).appendTo('#table-body');
    // });
    //

    $.fillTable = function (data) {
        let content = '';
        $.each(data, function (index, value) {
            let row = `<tr class="all-student-table-row" `+
                `onclick="window.document.location= 'student-page.html?student=${value.matric_number}';">`+
                `<td>${value.name}</td><td>${value.department}</td>`+
                `<td>${value.level}</td><td>${value.faculty}</td><td>${value.country}</td>`;
            row += '</tr>';
            // $('#table-row').on('click', 'tr', function () {
            //     alert("hello");
            // });
            content+=row;
        });
        return content;
    };

});
