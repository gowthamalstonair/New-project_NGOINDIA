interface ApiResponse<T = any> {
  results?: T[];
  [key: string]: any;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  [key: string]: any;
}

interface DonationData {
  id?: string;
  donorName: string;
  amount: number;
  currency: string;
  convertedAmount?: number;
  donorCountry?: string;
  isForeign: boolean;
  FIRC?: string;
  purpose?: string;
  date?: string;
  [key: string]: any;
}

declare class ApiService {
  baseURL: string;
  token: string | null;

  setToken(token: string): void;
  removeToken(): void;
  request(endpoint: string, options?: RequestInit): Promise<any>;

  // Auth methods
  login(credentials: LoginCredentials): Promise<any>;
  register(userData: RegisterData): Promise<any>;
  getProfile(): Promise<any>;
  updateProfile(data: any): Promise<any>;

  // NGO methods
  getNGOs(params?: Record<string, any>): Promise<ApiResponse>;
  getNGO(id: string): Promise<any>;
  createNGO(data: any): Promise<any>;

  // Project methods
  getProjects(params?: Record<string, any>): Promise<ApiResponse>;
  getProject(id: string): Promise<any>;
  createProject(data: any): Promise<any>;
  joinProject(projectId: string, role?: string): Promise<any>;

  // Task methods
  getTasks(params?: Record<string, any>): Promise<ApiResponse>;
  getMyTasks(): Promise<ApiResponse>;
  updateTaskStatus(taskId: string, status: string): Promise<any>;

  // Donation methods
  getDonations(params?: Record<string, any>): Promise<ApiResponse<DonationData>>;
  createDonation(data: DonationData): Promise<DonationData>;
  updateDonation(id: string, data: Partial<DonationData>): Promise<DonationData>;
  deleteDonation(id: string): Promise<{ success: boolean }>;
  processDonation(data: any): Promise<any>;
  getMyDonations(): Promise<ApiResponse<DonationData>>;
}

declare const api: ApiService;
export default api;