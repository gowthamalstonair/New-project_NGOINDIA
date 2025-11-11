# NGO India - System Design Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [System Architecture](#system-architecture)
3. [User Authentication & Role-Based Access](#user-authentication--role-based-access)
4. [Complete User Flow](#complete-user-flow)
5. [Module Architecture](#module-architecture)
6. [Database Design](#database-design)
7. [API Architecture](#api-architecture)
8. [Frontend Architecture](#frontend-architecture)
9. [Security Implementation](#security-implementation)
10. [Deployment Architecture](#deployment-architecture)

---

## System Overview

**NGO India** is a comprehensive management platform designed to streamline NGO operations, enhance transparency, and facilitate collaboration between NGOs, donors, government agencies, and beneficiaries.

### Key Features
- **Multi-role Dashboard System** (Admin, Executive, Employee, Director)
- **Donor Management & Tracking**
- **Financial Management & Compliance**
- **Project Monitoring & Impact Tracking**
- **FCRA Compliance Management**
- **Collaboration Hub & Networking**
- **Government Integration**
- **HR Management**
- **Real-time Reporting & Analytics**

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  React.js Frontend (TypeScript)                                │
│  ├── Landing Page                                              │
│  ├── Authentication System                                     │
│  ├── Role-Based Dashboards                                     │
│  ├── Module Components                                         │
│  └── Shared Components                                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  Business Logic & State Management                             │
│  ├── Context Providers (Auth, Dashboard)                       │
│  ├── Custom Hooks                                              │
│  ├── Utility Functions                                         │
│  └── API Integration Layer                                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  PHP Backend APIs                                              │
│  ├── Authentication APIs                                       │
│  ├── CRUD Operations                                           │
│  ├── File Upload/Download                                      │
│  ├── Report Generation                                         │
│  └── Integration Services                                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  MySQL Database                                                │
│  ├── User Management Tables                                    │
│  ├── Financial Data Tables                                     │
│  ├── Project Management Tables                                 │
│  ├── Compliance Tables                                         │
│  └── Audit & Logging Tables                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React.js 18+ with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Recharts for data visualization
- React Router for navigation

**Backend:**
- PHP 8.0+
- MySQL 8.0+
- RESTful API architecture
- JSON data exchange

**Development Tools:**
- Vite for build tooling
- ESLint for code quality
- Git for version control

---

## User Authentication & Role-Based Access

### Authentication Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Landing Page  │───▶│  Login Modal    │───▶│ Role Selection  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Role Dashboard  │◀───│  Authenticate   │◀───│ Validate Creds  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### User Roles & Permissions

#### 1. **Administrator**
- **Access Level:** Full system access
- **Permissions:**
  - Manage all donations and expenses
  - Oversee all projects
  - Access financial reports
  - Manage user accounts
  - System configuration
- **Dashboard Features:**
  - Total donations overview
  - Expense tracking
  - Project status monitoring
  - Quick action buttons

#### 2. **Executive Director**
- **Access Level:** Strategic oversight
- **Permissions:**
  - View strategic metrics
  - Approve major decisions
  - Access executive reports
  - Risk management
  - Budget allocation
- **Dashboard Features:**
  - Impact score tracking
  - Strategic performance metrics
  - Risk alerts
  - Executive actions

#### 3. **Employee**
- **Access Level:** Operational tasks
- **Permissions:**
  - Manage assigned tasks
  - Submit reports
  - Access training materials
  - View personal performance
- **Dashboard Features:**
  - Task management
  - Training schedule
  - Performance metrics
  - Notifications

#### 4. **Director**
- **Access Level:** Departmental oversight
- **Permissions:**
  - Department-specific access
  - Team management
  - Departmental reporting
  - Resource allocation

---

## Complete User Flow

### 1. **Initial Access Flow**

```
User visits website
        │
        ▼
┌─────────────────┐
│  Landing Page   │
│  - Hero Section │
│  - Features     │
│  - Statistics   │
│  - Call to Act  │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ User Decision   │
├─────────────────┤
│ • Login         │
│ • Register      │
│ • Browse        │
└─────────────────┘
```

### 2. **Login Flow**

```
Click "Login" Button
        │
        ▼
┌─────────────────┐
│  Login Modal    │
│  - Email Input  │
│  - Password     │
│  - Demo Accounts│
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  Validation     │
│  - Check Creds  │
│  - Role Verify  │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Success/Failure │
├─────────────────┤
│ Success → Dash  │
│ Failure → Error │
└─────────────────┘
```

### 3. **Registration Flow**

```
Click "Register" Button
        │
        ▼
┌─────────────────┐
│ Registration    │
│ Modal Opens     │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Role Selection  │
├─────────────────┤
│ • Administrator │
│ • Executive Dir │
│ • Employee      │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Form Completion │
│ - Personal Info │
│ - Contact Info  │
│ - Experience    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Account Created │
│ Auto-login      │
│ → Dashboard     │
└─────────────────┘
```

### 4. **Dashboard Navigation Flow**

```
User Logs In
        │
        ▼
┌─────────────────┐
│ Role Detection  │
├─────────────────┤
│ Admin → Admin   │
│ Exec → Exec     │
│ Emp → Employee  │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Dashboard Load  │
│ - Sidebar Menu  │
│ - Main Content  │
│ - Quick Actions │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Module Access   │
├─────────────────┤
│ • Donors        │
│ • Finances      │
│ • Projects      │
│ • Compliance    │
│ • Reports       │
│ • Settings      │
└─────────────────┘
```

### 5. **Module Interaction Flow**

```
Select Module from Sidebar
        │
        ▼
┌─────────────────┐
│ Module Loads    │
│ - Data Fetch    │
│ - UI Render     │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ User Actions    │
├─────────────────┤
│ • View Data     │
│ • Create New    │
│ • Edit Existing │
│ • Generate Rep  │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ API Calls       │
│ - CRUD Ops      │
│ - File Upload   │
│ - Data Export   │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ UI Updates      │
│ - Success Msg   │
│ - Data Refresh  │
│ - Navigation    │
└─────────────────┘
```

---

## Module Architecture

### Core Modules

#### 1. **Donor Management Module**
```
┌─────────────────────────────────────────┐
│            Donor Management             │
├─────────────────────────────────────────┤
│ • Donor Registration                    │
│ • Donation Tracking                     │
│ • Donor Communication                   │
│ • Donation Analytics                    │
│ • Receipt Generation                    │
│ • Donor Retention Analysis              │
└─────────────────────────────────────────┘
```

#### 2. **Financial Tracking Module**
```
┌─────────────────────────────────────────┐
│           Financial Tracking            │
├─────────────────────────────────────────┤
│ • Income Management                     │
│ • Expense Tracking                      │
│ • Budget Planning                       │
│ • Financial Reports                     │
│ • Audit Trail                          │
│ • Tax Compliance                        │
└─────────────────────────────────────────┘
```

#### 3. **Project Monitoring Module**
```
┌─────────────────────────────────────────┐
│           Project Monitoring            │
├─────────────────────────────────────────┤
│ • Project Creation                      │
│ • Progress Tracking                     │
│ • Resource Allocation                   │
│ • Milestone Management                  │
│ • Impact Assessment                     │
│ • Project Reports                       │
└─────────────────────────────────────────┘
```

#### 4. **Compliance Module**
```
┌─────────────────────────────────────────┐
│             Compliance                  │
├─────────────────────────────────────────┤
│ • FCRA Compliance                       │
│ • Legal Policy Management               │
│ • Document Management                   │
│ • Audit Preparation                     │
│ • Regulatory Reporting                  │
│ • AI-Powered Validation                 │
└─────────────────────────────────────────┘
```

#### 5. **HR Management Module**
```
┌─────────────────────────────────────────┐
│             HR Management               │
├─────────────────────────────────────────┤
│ • Employee Management                   │
│ • Performance Tracking                  │
│ • Training Management                   │
│ • Attendance System                     │
│ • Payroll Management                    │
│ • Volunteer Coordination                │
└─────────────────────────────────────────┘
```

---

## Database Design

### Core Tables Structure

#### User Management
```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'executive', 'employee', 'director'),
    department VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Financial Management
```sql
-- Donations table
CREATE TABLE donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255),
    amount DECIMAL(15,2) NOT NULL,
    purpose TEXT,
    donation_date DATE NOT NULL,
    payment_method VARCHAR(50),
    status ENUM('pending', 'completed', 'cancelled'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    project_id INT,
    receipt_url VARCHAR(500),
    approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

#### Project Management
```sql
-- Projects table
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    budget DECIMAL(15,2),
    spent DECIMAL(15,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status ENUM('planning', 'active', 'completed', 'on-hold'),
    progress INT DEFAULT 0,
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);
```

### Database Relationships

```
Users (1) ──────── (N) Projects
  │                    │
  │                    │
  └── (1) ──────── (N) Expenses
  
Donations (N) ──── (1) Projects
  │
  └── (1) ──────── (N) Receipts

Projects (1) ──── (N) Tasks
  │
  └── (1) ──────── (N) Beneficiaries
```

---

## API Architecture

### RESTful API Endpoints

#### Authentication APIs
```
POST /backend/simple_login.php
- Login user with credentials
- Returns: JWT token, user info

POST /backend/register_user.php
- Register new user
- Returns: Success/failure status

POST /backend/logout.php
- Logout user
- Returns: Success status
```

#### Donor Management APIs
```
GET /backend/get_donors_api.php
- Fetch all donors
- Returns: Array of donor objects

POST /backend/add_donor_api.php
- Add new donor
- Returns: Created donor object

PUT /backend/update_donor_api.php
- Update donor information
- Returns: Updated donor object

POST /backend/donate_api.php
- Process donation
- Returns: Transaction details
```

#### Financial APIs
```
GET /backend/get_expenses_api.php
- Fetch all expenses
- Returns: Array of expense objects

POST /backend/add_expense_api.php
- Add new expense
- Returns: Created expense object

GET /backend/get_financial_reports.php
- Generate financial reports
- Returns: Report data
```

#### Project Management APIs
```
GET /backend/get_projects_api.php
- Fetch all projects
- Returns: Array of project objects

POST /backend/add_project_api.php
- Create new project
- Returns: Created project object

PUT /backend/update_project_api.php
- Update project details
- Returns: Updated project object
```

### API Response Format

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## Frontend Architecture

### Component Hierarchy

```
App.tsx
├── AuthProvider
├── DashboardProvider
├── Router
│   ├── LandingPage
│   ├── LoginForm
│   ├── SignUpModal
│   └── Dashboard
│       ├── Sidebar
│       ├── AdminDashboard
│       ├── ExecutiveDashboard
│       ├── EmployeeDashboard
│       └── Modules
│           ├── DonorManagement
│           ├── FinancialTracking
│           ├── ProjectMonitoring
│           ├── ComplianceModule
│           ├── HRManagement
│           ├── Reports
│           └── Settings
└── Chatbot
```

### State Management

#### Context Providers
```typescript
// AuthContext - User authentication state
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

// DashboardContext - Application data state
interface DashboardContextType {
  donations: Donation[];
  projects: Project[];
  expenses: Expense[];
  tasks: Task[];
  refreshData: () => void;
}
```

### Routing System

```typescript
// Route Configuration
const routes = [
  { path: '/', component: LandingPage },
  { path: '/donate', component: DonatePage },
  { path: '/join', component: JoinPage },
  { path: '/ngos', component: NGOListPage },
  { path: '/ngos/:id', component: NGODetailsPage },
  { path: '/dashboard', component: Dashboard, protected: true },
  // ... other routes
];
```

---

## Security Implementation

### Authentication Security
- **Password Hashing:** bcrypt for password encryption
- **Session Management:** JWT tokens with expiration
- **Role-Based Access Control:** Middleware validation
- **CORS Configuration:** Restricted origins

### Data Security
- **Input Validation:** Server-side validation for all inputs
- **SQL Injection Prevention:** Prepared statements
- **XSS Protection:** Input sanitization
- **File Upload Security:** Type and size validation

### API Security
```php
// CORS Headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Input Validation
function validateInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Authentication Middleware
function requireAuth() {
    // Verify JWT token
    // Check user permissions
}
```

---

## Deployment Architecture

### Development Environment
```
Local Development Stack:
├── Frontend: Vite Dev Server (Port 5173)
├── Backend: XAMPP Apache (Port 80)
├── Database: MySQL (Port 3306)
└── File Storage: Local filesystem
```

### Production Environment
```
Production Stack:
├── Frontend: Nginx + Static Files
├── Backend: Apache + PHP-FPM
├── Database: MySQL Cluster
├── Load Balancer: Nginx
├── SSL: Let's Encrypt
└── CDN: CloudFlare
```

### Deployment Flow
```
Development → Testing → Staging → Production
     │            │         │          │
     ▼            ▼         ▼          ▼
  Git Repo → CI/CD → Docker → AWS/VPS
```

---

## Performance Optimization

### Frontend Optimization
- **Code Splitting:** Lazy loading of modules
- **Image Optimization:** WebP format, lazy loading
- **Caching:** Browser caching, service workers
- **Bundle Optimization:** Tree shaking, minification

### Backend Optimization
- **Database Indexing:** Optimized queries
- **Caching:** Redis for session storage
- **API Optimization:** Response compression
- **File Handling:** Efficient upload/download

### Monitoring & Analytics
- **Error Tracking:** Sentry integration
- **Performance Monitoring:** Web Vitals
- **User Analytics:** Google Analytics
- **Server Monitoring:** System metrics

---

## Future Enhancements

### Planned Features
1. **Mobile Application:** React Native app
2. **Advanced Analytics:** AI-powered insights
3. **Integration APIs:** Third-party service integration
4. **Blockchain:** Transparent donation tracking
5. **Multi-language Support:** Internationalization
6. **Advanced Reporting:** Custom report builder

### Scalability Considerations
- **Microservices Architecture:** Service decomposition
- **Database Sharding:** Horizontal scaling
- **CDN Integration:** Global content delivery
- **Container Orchestration:** Kubernetes deployment

---

## Conclusion

This NGO India system is designed as a comprehensive, scalable, and secure platform that addresses the complex needs of modern NGO operations. The architecture supports role-based access, ensures data integrity, and provides a seamless user experience across all stakeholder groups.

The system's modular design allows for easy maintenance and future enhancements while maintaining high performance and security standards.

---

*Document Version: 1.0*  
*Last Updated: January 15, 2025*  
*Author: System Architecture Team*