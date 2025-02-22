const API_ROUTES = {
   
    getAllStaffs: `/staff/all`,
    getLog:(id)=>`/cl/log/${id}`,
    getStaff:(id)=>`/staff/${id}`,
    getActiveStaffs:`/activestaffs/all`,
    getactiveDesignations:`/designations/all/active`,
    contractLogs:`/cl`,
    getAllContractLogs:`/cl/all`,
    designationsBase:`/designations`,
    getAllDesignations:`/designations/all`,

    resetPassword:'/password/resetpassword/email',

    getAllHighestQualifications:'/hq/all',
    addHighestQualification:`/hq/add`,
    login:'/auth/login',
    register:'/auth/register',

    highestQualificationsBase:`/hq`,

    getOrganisations:`/organisations/all/active`,

    getAllOrganisations:`/organisations/all`,

    organisationsBase:`/organisations`,

    getHighestQualifications:'/hq/all/active',
    staff:'/staff',

    toggleStaffStatus:(id)=>`/staff/status/${id}`,

    getAllUsers:'/user/all',
    toggleUserStatus:(id)=>`/user/status/${id}`,

    getAllRoles:'/roles/all',
    rolesBase:`/roles`,
    user:'/user',
    getAllUsers:'/user/all',
    courses:'/courses/active',
    getAllCourses:'/courses/all',
    coursesBase:`/courses`
};



window.API_ROUTES = API_ROUTES;