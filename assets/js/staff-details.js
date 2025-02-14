const addStaffButton = document.getElementById('add_staff_btn');

addStaffButton.addEventListener('click', () => {
    addRow();
    showPopupFadeInDown('New Log Added!');
});


function addRow(){
    table=new DataTable("#myTable");
    table.row.add([
       1,
       2,
       3,
       4,
        `<div class="container">
            <div class="toggle-btn active" onclick="toggleSwitch(this)">
                <div class="slider"></div>
            </div>
        </div>`
        ,
        `<div class="row d-flex justify-content-center">
            <button class="btn btn-edit d-flex align-items-center justify-content-center p-0 " style="width: 40px; height: 40px;" data-toggle="modal" data-target="#updateModal">
                <i class="ti-pencil text-white" style="font-size: larger;"></i>
            </button>
        </div>`
    ]).draw(false);
}
