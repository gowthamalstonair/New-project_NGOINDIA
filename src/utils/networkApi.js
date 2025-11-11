const API_BASE_URL = 'http://localhost/NGO-India/backend';

export const networkApi = {
  // Join a network
  joinNetwork: async (networkData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/add_network_api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(networkData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error joining network:', error);
      throw error;
    }
  },

  // Get all networks
  getNetworks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_networks_api.php`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching networks:', error);
      throw error;
    }
  },

  // Get networks by sector
  getNetworksBySector: async (sector) => {
    try {
      const result = await networkApi.getNetworks();
      if (result.success) {
        return {
          success: true,
          networks: result.networks.filter(network => network.focus_area === sector)
        };
      }
      return result;
    } catch (error) {
      console.error('Error fetching networks by sector:', error);
      throw error;
    }
  }
};