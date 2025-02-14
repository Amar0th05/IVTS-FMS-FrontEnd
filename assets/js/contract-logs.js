const addLogButton = document.getElementById('add_log_btn');

addLogButton.addEventListener('click', () => {
    addRow();
    showPopupFadeInDown('New Log Added!');
    document.querySelector("#updateModal").classList.remove('fade');
});


function addRow(){
    table=new DataTable("#myTable");
    table.row.add([
       1,
       2,
       3,
       4,
       5,
       6,
       7,
       `
       <button class="btn btn-edit d-flex align-items-center justify-content-center p-0 " style="width: 40px; height: 40px;" data-toggle="modal" data-target="#updateModal">
            <i class="ti-pencil text-white" style="font-size: larger;"></i>
        </button>
       `
    ]).draw(false);
}
