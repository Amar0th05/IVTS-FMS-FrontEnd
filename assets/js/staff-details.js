
document.getElementById('logout-button').addEventListener('click',logout);
function logout(){
    sessionStorage.removeItem('token');
}


const addStaffButton = document.getElementById('add_staff_btn');
const updateStaffButton = document.getElementById('update_staff_btn');


async function loadCourseOptions(id) {
    try {
        // const response = await axiosInstance.get(API_ROUTES.courses);
        const courses = await api.getCourses();
        const select = document.getElementById(id);

        select.innerHTML = '<option value="">Select Course</option>';
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.course_id;
            option.textContent = course.course_name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}


async function loadOrganisationOptions(id) {
    try {
        const organisations = await api.getOrganisations();
        const select = document.getElementById(id);

        select.innerHTML = '<option value="">Select Organisation</option>';
        organisations.forEach(organisation => {
            const option = document.createElement("option");
            option.value = organisation.org_id;
            option.textContent = organisation.organisation_name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading organisations:", error);
    }
}


async function loadHighestQualificationsOptions(id) {
    try {
        // const response = await axiosInstance.get(API_ROUTES.getHighestQualifications);
        const highestQualifications = await api.getHighestQualifications();
        const select = document.getElementById(id);

        select.innerHTML = '<option value="">Select Highest Qualification</option>';
        highestQualifications.forEach(qualification => {
            const option = document.createElement("option");
            option.value = qualification.qual_id;
            option.textContent = qualification.highest_qualification;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading highest qualifications:", error);
    }
}


addStaffButton.addEventListener('click', async (e) => {
    
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
        try {
            // const response = await axiosInstance.post(API_ROUTES.staff, {
            //     data: data
            // });
            

            const responseData=await api.addStaff(data);

            table.clear();
            await fetchAllData();
            showSucessPopupFadeInDownLong(responseData.message);
            form.reset();
        } catch (error) {
            showErrorPopupFadeInDown(error.response?.data?.message || 'Failed to add staff. Please try again later.');
        }
        

    }
});


updateStaffButton.addEventListener('click', async (e) => {
    
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
        try {
            const responseData=await api.updateStaff(data);
            table.clear();
            await fetchAllData();
            showSucessPopupFadeInDownLong(responseData.message);
        } catch (error) {
            showErrorPopupFadeInDown(error.response?.data?.message || 'Failed to add staff. Please try again later.');
        }
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
      data.currentSalary,
      data.currentDesignation,
        `<div class="container">
            <div class="toggle-btn ${data.status===true?'active':''}" onclick="toggleStatus(this,'${data.staffID}')">
                <div class="slider"></div>
            </div>
        </div>`
        ,
        `<div class="row d-flex justify-content-center">
            <div class="d-flex align-items-center justify-content-center p-0 " style="width: 40px; height: 40px;cursor:pointer" data-toggle="modal" data-target="#updateModal" onclick="loadUpdateDetails('${data.staffID}')">
                <i class="ti-pencil-alt text-inverse" style="font-size: larger;"></i>
            </div>
        </div>`,
        
    ]).draw(false);
};

document.addEventListener('DOMContentLoaded',async ()=>{
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!token || !user) {
        window.location.href = 'login.html';
    } else if (user.role === 2) {
        window.location.href = 'user-details.html';
    }

    document.querySelector('#username').textContent = user.name;
    

    await loadCourseOptions('courseSelect');
    await loadOrganisationOptions("locationSelect");
    await loadHighestQualificationsOptions("highestQualificationSelect");
    await fetchAllData();
});




async function toggleStatus(element, id) {
    if (!id) return;

    try {
        const data=await api.toggleStaffStatus(id);
        // showSucessPopupFadeInDownLong(data.message);

        if (element) {
            element.classList.toggle('active');
        }
    } catch (error) {
        showErrorPopupFadeInDown(error);
    }
}


async function fetchAllData() {
    try {
        const staffDetails = await api.getAllStaffs();
        const designations = new Set();
        const locations = new Set();

        staffDetails.forEach(staffDetail => {
            addRow(staffDetail);

            designations.add(staffDetail.currentDesignation);
            locations.add(staffDetail.locationOfWork);
        });

        console.log(designations);
            designations.forEach(designation => {
            if(!designation) return;
            $('#designationFilter').append(`<option value="${designation}">${designation}</option>`);
        });
        


        
        locations.forEach(location => {
            if(!location) return;
            $('#locationFilter').append(`<option value="${location}">${location}</option>`);
        });

    } catch (error) {
        console.error("Error fetching staff details:", error);
    }
}


function limitLength(str, length) {
    if (str.length > length) {
        return str.substring(0, length);
    }
    return str;
};

document.querySelector('.reload-card').addEventListener('click', async () => {
    table.clear();
    await fetchAllData();
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


    return true;
}

async function loadUpdateDetails(id) {
    await loadCourseOptions('update-courseSelect');
    await loadHighestQualificationsOptions('update-highestQualification');
    await loadOrganisationOptions('update-location')
    try {
        const response = await axiosInstance.get(API_ROUTES.getStaff(id));

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

        document.getElementById('update-permanentAddress').value = data.permanentAddress;
    } catch (error) {
        console.error(error);
    }
}       