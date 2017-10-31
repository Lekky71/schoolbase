
$(document).ready(function($){

    let showDialog = function (){
        document.getElementById("overlay").style.display = "block";
    };

    let hideDialog = function () {
        document.getElementById("overlay").style.display = "none";
    };

    showDialog();
    $.get('/students/view/all-students',function (resp) {
        let myData = eval(resp);
        let content = $.fillTable(myData);
        $('#table-body').html('');
        $(content).appendTo('#table-body');
        hideDialog();
    });

    let viewStudent = function(matricNumber){
        $.get(`/students/view/all-students/student?matricNumber=${matricNumber}`, function (resp) {
            window.document.location = `a-student.html?student=${resp}`;
        });
    };

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
