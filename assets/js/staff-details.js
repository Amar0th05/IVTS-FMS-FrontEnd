

const addStaffButton = document.getElementById('add_staff_btn');
const updateStaffButton = document.getElementById('update_staff_btn');


async function loadCourseOptions(id) {
    axiosInstance.get('/courses/')
        .then((response)=>{
            const courses=response.data.courses;
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">Select Course</option>';
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.course_id;
                option.textContent = course.course_name;
                select.appendChild(option);
            });
        }).catch((error)=>{
            console.error(error);
        })
}

async function loadOrganisationOptions(id) {
    axiosInstance.get('/organisations')
        .then((response)=>{
            const organisations=response.data.organisations;
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">Select organisations</option>';
            organisations.forEach(organisation => {
                const option = document.createElement("option");
                option.value = organisation.org_id;
                option.textContent = organisation.organisation_name;
                select.appendChild(option);
            });
        }).catch((error)=>{
            console.error(error);
        })
};

async function loadHighestQualificationsOptions(id) {
    axiosInstance.get('/hq')
        .then((response)=>{
            const highestQualifications=response.data.highestQualifications;
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">Select Higheset Qualification</option>';
            highestQualifications.forEach(highestQualification => {
                const option = document.createElement("option");
                option.value = highestQualification.qual_id;
                option.textContent = highestQualification.highest_qualification;
                select.appendChild(option);
            });
        }).catch((error)=>{
            console.error(error);
        })
};

addStaffButton.addEventListener('click', (e) => {
    
    e.preventDefault();
    let form = document.getElementById('new-staff-form');
    let formData = new FormData(form);

    const data={};
    
    const intFields = ["courses", "locationOfWork", "highestQualification"];
    const numericFields = ["aadharNumber", "contactNumber"];

    formData.forEach((value, key) => {
        value = value.trim(); 
    
        if (value === "") {
            data[key] = null; 
            return;
        }
    
        if (intFields.includes(key)) {
            data[key] = parseInt(value, 10);
        } else if (numericFields.includes(key)) {
            data[key] = Number(value);
        } else {
            data[key] = value;
        }
    });
    data['status']=true;

    if (validateForm(formData)) {
        axiosInstance.post('/staff',{
            data: data
        }).then((response) => {
            table.clear();
            fetchAllData();
            showSucessPopupFadeInDownLong(response.data.message);
            form.reset();
        }).catch((error) => {
            showErrorPopupFadeInDown(error.response?.data?.message || 'Failed to add staff. Please try again later.');
        });

    }
});


updateStaffButton.addEventListener('click', (e) => {
    
    e.preventDefault();
    let form = document.getElementById('update-staff-form');
    let formData = new FormData(form);

    const data={};
    
    const intFields = ["courses", "locationOfWork", "highestQualification"];
    const numericFields = ["aadharNumber", "contactNumber"];

    formData.forEach((value, key) => {
        value = value.trim(); 
    
        if (value === "") {
            data[key] = null; 
            return;
        }
    
        if (intFields.includes(key)) {
            data[key] = parseInt(value, 10);
        } else if (numericFields.includes(key)) {
            data[key] = Number(value);
        } else {
            data[key] = value;
        }
    });
    data['status']=true;

    if (validateForm(formData)) {
        axiosInstance.put('/staff',{
            data: data
        }).then((response) => {
            table.clear();
            fetchAllData();
            showSucessPopupFadeInDownLong(response.data.message);
            
        }).catch((error) => {
            showErrorPopupFadeInDown(error.response?.data?.message || 'Failed to add staff. Please try again later.');
        });

    }
});


let table;
function addRow(data){
    if ( $.fn.dataTable.isDataTable( '#myTable' ) ) {
        table = $('#myTable').DataTable();
    }
   
   if(!data){
    console.error('no data to add');
    return;
   }

    if(data.dateOfJoining){
        data.dateOfJoining=new Date(data.dateOfJoining).toLocaleDateString();
    }else{
        data.dateOfJoining='';
    }

    if(data.status){
        data.status=true;
    }else{
        data.status=false;
    }

    table.row.add([
      data.staffID,
      data.staffName,
      data.locationOfWork,
      data.dateOfJoining,
        `<div class="container">
            <div class="toggle-btn ${data.status===true?'active':''}" onclick="toggleStatus(this,'${data.staffID}')">
                <div class="slider"></div>
            </div>
        </div>`
        ,
        `<div class="row d-flex justify-content-center">
            <button class="btn btn-edit d-flex align-items-center justify-content-center p-0 " style="width: 40px; height: 40px;" data-toggle="modal" data-target="#updateModal" onclick="loadUpdateDetails('${data.staffID}')">
                <i class="ti-pencil text-white" style="font-size: larger;"></i>
            </button>
        </div>`
    ]).draw(false);
};

document.addEventListener('DOMContentLoaded',async ()=>{
    const token=localStorage.getItem('token');
    if(!token){
        window.location.href = 'login.html';
        return;
    }
    
    loadCourseOptions('courseSelect');
    loadOrganisationOptions("locationSelect");
    loadHighestQualificationsOptions("highestQualificationSelect");
    fetchAllData();
});




async function toggleStatus(element, id) {
    if (!id) return;

    try {
        const response = await axiosInstance.put(`/staff/status/${id}`);
        showSucessPopupFadeInDownLong(response.data.message);

        if (element) {
            element.classList.toggle('active');
        }
    } catch (error) {
        showErrorPopupFadeInDown(error.response?.data?.message || 'Failed to update status. Please try again later.');
    }
}


function fetchAllData(){
    axiosInstance.get('/staff/all')
    .then((response)=>{
       
       
        response.data.staffDetails.map(staffDetail => {
        addRow(staffDetail);
       })
    })
    .catch((error)=>{
        console.error(error);
    });
}

function limitLength(str, length) {
    if (str.length > length) {
        return str.substring(0, length);
    }
    return str;
};

document.querySelector('.reload-card').addEventListener('click', () => {
    table.clear();
    fetchAllData();
});


function validateForm(formData) {
    let errors = [];

    
    const staffID = formData.get('staffID')?.trim();
    const contactNumber = formData.get('contactNumber')?.trim();
    const aadharNumber = formData.get('aadharNumber')?.trim();
    const mail = formData.get('mail')?.trim();
    const locationOfWork = formData.get('locationOfWork')?.trim();
    

  
    if (!staffID){
        showErrorPopupFadeInDown('Staff ID is required.');
        errors.push("Staff ID is required.");
    }

    if (!locationOfWork) {
        showErrorPopupFadeInDown('Location of Work is required.');
        errors.push("Location of Work is required.");
    }
    

   
    if (contactNumber && !/^\d{10}$/.test(contactNumber)) {
        errors.push("Contact Number must be exactly 10 digits.");
    }

  
    if (aadharNumber && !/^\d{12}$/.test(aadharNumber)) {
        showErrorPopupFadeInDown('Aadhar Number must be exactly 12 digits.');
        errors.push("Aadhar Number must be exactly 12 digits.");
    }

    
    if (mail && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mail)) {
        showErrorPopupFadeInDown('Invalid Email format');
        errors.push("Invalid email format.");
    }

    
    if (errors.length > 0) {
        return false;
    }

    console.log("Validation successful!", Object.fromEntries(formData.entries()));
    return true;
}

async function loadUpdateDetails(id) {
    loadCourseOptions('update-courseSelect');
    loadHighestQualificationsOptions('update-highestQualification');
    loadOrganisationOptions('update-location');
    try {
        const response = await axiosInstance.get(`/staff/${id}`);
        console.log(response.data);
        const data = response.data.staffDetail;
        document.getElementById('update-staffId').value = data.staffID;
        document.getElementById('update-staffName').value = data.staffName;
        document.getElementById('update-contactNumber').value = data.contactNumber;
        document.getElementById('update-aadharNumber').value = data.aadharNumber;
        document.getElementById('update-mail').value = data.mail;
        document.getElementById('update-dateOfBirth').value = new Date(data.dateOfBirth).toISOString().split('T')[0];

        
        document.getElementById('update-location').value = data.locationOfWork;        
        document.getElementById('update-highestQualification').value = data.highestQualification;
        document.getElementById('update-qualifications').value = data.qualifications;
        document.getElementById('update-courseSelect').value = data.courses;
        document.getElementById('update-dateOfJoining').value = new Date(data.dateOfJoining).toISOString().split('T')[0];

        document.getElementById('update-certifications').value = data.certifications;
        document.getElementById('update-salary').value = data.salary ? parseFloat(data.salary) : '';
        console.log(parseFloat(data.salary));
        document.getElementById('update-permanentAddress').value = data.permanentAddress;
    } catch (error) {
        console.error(error);
    }
}       