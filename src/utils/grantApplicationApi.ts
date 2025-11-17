const API_BASE_URL = '/backend';

export const grantApplicationApi = {
  // Get all grant applications
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_grant_applications_api.php`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      return data.success ? data.applications : [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // Submit new grant application
  create: async (applicationData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/add_grant_application_api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit application');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },

  // Update grant application status (admin only)
  updateStatus: async (id: string, status: string, reviewNotes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/update_grant_status_api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: id,
          status: status,
          reviewNotes: reviewNotes
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update application status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }
};