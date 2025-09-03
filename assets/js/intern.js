$(document).ready(function () {
  // Initialize DataTable
  let table = $("#internTable").DataTable({
    dom: "Bfrtip",
    buttons: ["copy", "csv", "excel", "pdf", "print"],
    pageLength: 10,
  });



  const totalIntern = document.getElementById("TotalIntern");

  // Load data from backend
  axiosInstance
    .get(`${API_ROUTES.getAllIntern}/all`)
    .then((res) => {
      let interns = res.data.internDetails;

      interns.forEach((intern, index) => {
        table.row.add([
          index + 1,
          intern.FullName,
          intern.Email,
          intern.MobileNumber,
          intern.CollegeName,
          intern.DegreeProgram,
          intern.CurrentLocation,
          `
          <button class="btn btn-sm btn-primary view-more" 
                  data-intern='${JSON.stringify(intern).replace(
                    /"/g,
                    "&quot;"
                  )}'>
            View More
          </button>
          `,
        ]);
      });

      table.draw(false);
      totalIntern.innerText = interns.length;
    })
    .catch((err) => {
      console.error("Error fetching intern data:", err);
    });

  // ✅ Single event handler for modal
  $("#internTable").on("click", ".view-more", function () {
    const intern = $(this).data("intern");

    // Fill modal fields
    $("#modalFullName").text(intern.FullName);
    $("#modalEmail").text(intern.Email);
    $("#modalPhone").text(intern.MobileNumber);
    $("#modalCollege").text(intern.CollegeName);
    $("#modalDegree").text(intern.DegreeProgram);
    $("#modalLocation").text(intern.CurrentLocation);

    // Build download buttons
    // Build download buttons with onclick
    $("#downloadButtons").html(`
  <button class="btn btn-success me-2" onclick="downloadInternFile(${intern.Id}, 'ResumeFileData')">
    Resume
  </button>
  <button class="btn btn-warning me-2" onclick="downloadInternFile(${intern.Id}, 'BonafideFileData')">
    Bonafide
  </button>
  <button class="btn btn-info me-2" onclick="downloadInternFile(${intern.Id}, 'PhotoFileData')">
    Photo
  </button>
  <button class="btn btn-secondary" onclick="downloadInternFile(${intern.Id}, 'IdProofFileData')">
    ID Proof
  </button>
`);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("internModal"));
    modal.show();
  });
});

function downloadInternFile(id, fileType) {
  axiosInstance
    .get(`${API_ROUTES.downlodeIntern}/download/${id}/${fileType}`, {
      responseType: "blob", // important for files
    })
    .then((res) => {
      // Create a temporary URL for the file
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;

      // Guess file extension from type
      let extension = "";
      switch (fileType) {
        case "ResumeFileData":
          extension = ".pdf";
          break;
        case "PhotoFileData":
          extension = ".jpg";
          break;
        case "IdProofFileData":
          extension = ".pdf";
          break;
        case "BonafideFileData":
          extension = ".pdf";
          break;
      }

      link.download = fileType + extension; // file name
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      console.error(`Error downloading ${fileType}:`, err);
      alert("Download failed. Please try again.");
    });
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