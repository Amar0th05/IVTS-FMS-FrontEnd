

$(document).ready(function () {
  // Initialize DataTable
  let table = $('#staffsTable').DataTable({
    dom: 'Bfrtip',
    buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
    pageLength: 10
  });

// const TotalStaffs=0; 
const totalStaffs=document.getElementById("TotalStaffs"); 
const FullTimeStaffs=document.getElementById("FullTimeStaffs");
const PartFullTimeStaffs=document.getElementById("PartTimeStaffs");
let full=0;
let part=0;
  // Load data from backend
axiosInstance.get(API_ROUTES.getAllStaffs)
  .then(res => {
    let staffs = res.data.staffDetails;
    // TotalStaffs=staffs.length;
    staffs.forEach((staff,index) => {
      if(staff.employmentType == "Contract - Full-time"){
        full=full+1;
      }
      if(staff.employmentType == "Contract - Part-time"){
        part=part+1;
      }
      table.row.add([
        index+1,
        staff.staffName,
        staff.employeeId,
        staff.department,
        staff.designation,
        staff.contactNumber,
        staff.workLocation,
        `<button class="btn btn-sm btn-primary view-more" 
                 data-details='${JSON.stringify(staff)}'>
            View More
         </button>`
      ]).draw(false);
    });
    totalStaffs.innerText=staffs.length;
    FullTimeStaffs.innerText=full;
    PartFullTimeStaffs.innerText=part;
  })
  .catch(err => {
    console.error("Error fetching staff data:", err);
  });


  // Handle View More click
  $(document).on("click", ".view-more", function () {
    let details = $(this).data("details");

    let html = "";
    for (let key in details) {
      if (details.hasOwnProperty(key)) {
        let label = key.replace(/([A-Z])/g, ' $1')   // split camelCase
                       .replace(/^./, str => str.toUpperCase()); // capitalize
        html += `<tr>
                   <th>${label}</th>
                   <td>${details[key] || '-'}</td>
                 </tr>`;
      }
    }

    $("#staffDetails").html(html);
    new bootstrap.Modal(document.getElementById("staffModal")).show();
  });
});

document.getElementById('logout-button').addEventListener('click',logout);
function logout(){
    sessionStorage.removeItem('token');
}


       document.addEventListener("DOMContentLoaded", async function () {

      let user=JSON.parse(sessionStorage.getItem('user'));
      let token=sessionStorage.getItem('token');
      if(token===null||user===null){
        window.location.href="login.html";
      }else{
            
    roles=await axiosInstance.get('/roles/role/perms');
    roles=roles.data.roles;
    // console.log(roles); 
    window.roles=roles;
        handlePermission('#username');
       
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = generateSidebar();
        
        // Set the current page as active
        const currentPage = window.location.pathname.split('/').pop().split('.')[0];
        const navLinks = document.querySelectorAll('.pcoded-item a');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href').includes(currentPage)) {
                link.parentElement.classList.add('active');
                
                // Expand the parent accordion
                const accordionContent = link.closest('.accordion-content');
                if (accordionContent) {
                    accordionContent.style.display = 'block';
                    const header = accordionContent.previousElementSibling;
                    const icon = header.querySelector('.accordion-icon');
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                }
            }
        });
    }
      }

    });
    
    $(document).ready(function () {
  if ($.fn.DataTable.isDataTable('#staffsTable')) {
    $('#staffsTable').DataTable().destroy();
  }

  $('#staffsTable').DataTable({
    dom: 'Bfrtip',
    buttons: ['csv', 'excel', 'pdf', 'colvis']
  });
});
