
let table;

//add row
async function addRow(data){
    if ( $.fn.dataTable.isDataTable( '#myTable' ) ) {
        table = $('#myTable').DataTable();
    }
    if(!data){
        console.error('no data to add');
        return;
    }
    
    table.row.add([
        data.role,
        `<div class="row d-flex justify-content-center">
            <span class="d-flex align-items-center justify-content-center p-0 " style="cursor:pointer;" data-toggle="modal" data-target="#updateRoleModal" onclick="loadUpdateRoles(${data.roleID})">
                <i class="ti-pencil-alt text-inverse" style="font-size: larger;"></i>
            </span>
        </div>`,
        
    ]).draw(false);

}

async function getAllRoles(){
    try{
        const roles=await api.getAllRoles();
        roles.map(role=>addRow(role));
    }catch(error){
        console.log(error);

    }
}

async function getRoleById(roleId){
    try{
        const role=await api.getRoleById(roleId);
        return role;
    }catch(error){
        console.log(error);
        return null;
    }
}




async function refreshTable() {
    if ($.fn.dataTable.isDataTable('#myTable')) {
        table = $('#myTable').DataTable();
        table.clear();
    }

    await getAllRoles();
    
}
async function loadUpdateRoles(id) {
    id = parseInt(id);
    const role=await api.getRoleById(id);

    if(!role){
        showErrorPopupFadeInDown('role not found.');
        return;
    }

    const roleNameField = document.getElementById('update-roleName');
    roleNameField.value = role.role;

    // updateRoleButton.dataset.roleID = id;
}


$(document).ready(async function () {
    window.location.href = 'user-details.html';
    // await refreshTable();
});