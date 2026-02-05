import {api} from "../api.js";

// Get all team members with optional filters..
export const getAllMembers = async(filters = {}) => {
    try{

        const params = new URLSearchParams();

        if(filters.status) params.append('status', filters.status);
        if(filters.role) params.append('role', filters.role);

        const response = await api.get(`/team/getAll?${params.toString()}`);

        return {
            success : true,
            data : response.data.data,
            count : response.data.count
        }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to fetch all team members'
        }
    }   
}


// get team member by Id..
export const getTeamMemberById = async(id) => {
    try{

        const response = await api.get(`/team/get/${id}`);

        let memberData = response.data.teamMember;

        // handles if it returns an array,
        if(Array.isArray(memberData)){
            memberData = memberData[0]
        }

        return {
            success : true,
            data : response.data.teamMember
        }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to Get Specific team member'
        }
    }
}

// add team memember..
export const addTeamMember = async(memberData) => {
    try{
        const response = await api.post('/team', memberData);

        return {
            success : true,
            teamMember : response.data.teamMember
        };
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to add new Team member'
        }
    }
}


// update team member 
export const updateTeamMember = async(id, memberData) => {
    try{
        const response = await api.put(`/team/${id}`, memberData);

        return {
            success : true,
            teamMember : response.data.teamMember
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to update team member'
        }
    }
}

// Delete team member
export const deleteMember = async(id) => {
    try{
        const response = await api.delete(`/team/${id}`);

        return {
            success : true,
            message : response.data.message
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to delete team member'
        }
    }
}

// Assign case to team member.
export const assignCaseToMember = async(memberId, caseData) => {
    try{
        const response = await api.post(`/team/${memberId}/assign-case`, caseData);

        return {
            success : true,
            message : response.data.message
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to assign case'
        }
    }
}

// Unassign case from team member.
export const unassignCaseFromMember = async(memberId, caseId) => {
    try{

        const response = await api.delete(`/team/${memberId}/unassign-case/${caseId}`);
        return {
            success : true,
            teamMember : response.data.teamMember
        };
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to unassign team member'
        }
    }
}

// Get team member workload..
export const getTeamMemberWorkload = async(id) => {
    try{
        const response = await api.get(`/team/${id}/workload`);

        return {
            success : true,
            workload : response.data.workload
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get workload'
        }
    }
}


// get team statistics..
export const getTeamStats = async() => {
    try{

        const response = await api.get('/team/stats');

        return {
            success : true,
            stats : response.data.stats
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get team stats'
        }
    }
}

// Search team members
export const searchTeamMembers = async(q) => {
    try{

        const response = await api.get(`/team/search?q=${encodeURIComponent(q)}`);
        return {
            success : true,
            teamMembers : response.data.teamMembers || []
        };
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get team members'
        };
    }
};



