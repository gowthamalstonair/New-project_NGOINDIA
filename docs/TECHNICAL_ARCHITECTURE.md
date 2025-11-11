# NGO India - Technical Architecture Documentation

## System Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │   Web Browser   │  │  Mobile Browser │  │   Desktop App   │            │
│  │   (Chrome,      │  │   (Safari,      │  │   (Future)      │            │
│  │   Firefox,      │  │   Chrome        │  │                 │            │
│  │   Safari)       │  │   Mobile)       │  │                 │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    React.js Frontend Application                    │   │
│  │                                                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │   │
│  │  │  Landing    │ │    Auth     │ │ Dashboards  │ │   Modules   │  │   │
│  │  │    Page     │ │  System     │ │  (Role-     │ │  (Donor,    │  │   │
│  │  │             │ │             │ │   Based)    │ │  Finance,   │  │   │
│  │  │             │ │             │ │             │ │  Projects)  │  │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │   │
│  │                                                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │   │
│  │  │   Shared    │ │   Context   │ │   Custom    │ │   Utility   │  │   │
│  │  │ Components  │ │  Providers  │ │    Hooks    │ │  Functions  │  │   │
│  │  │             │ │             │ │             │ │             │  │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ HTTP/HTTPS Requests
┌─────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      PHP Backend Services                           │   │
│  │                                                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │   │
│  │  │    Auth     │ │   Donor     │ │  Financial  │ │   Project   │  │   │
│  │  │   Service   │ │  Service    │ │   Service   │ │   Service   │  │   │
│  │  │             │ │             │ │             │ │             │  │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │   │
│  │                                                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │   │
│  │  │ Compliance  │ │     HR      │ │   Report    │ │    File     │  │   │
│  │  │   Service   │ │   Service   │ │   Service   │ │   Service   │  │   │
│  │  │             │ │             │ │             │ │             │  │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ SQL Queries
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        MySQL Database                               │   │
│  │                                                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │   │
│  │  │    User     │ │  Financial  │ │   Project   │ │ Compliance  │  │   │
│  │  │   Tables    │ │   Tables    │ │   Tables    │ │   Tables    │  │   │
│  │  │             │ │             │ │             │ │             │  │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │   │
│  │                                                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │   │
│  │  │     HR      │ │   Audit     │ │   System    │ │    File     │  │   │
│  │  │   Tables    │ │   Tables    │ │   Tables    │ │  Storage    │  │   │
│  │  │             │ │             │ │             │ │             │  │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Component Structure

```
src/
├── components/
│   ├── dashboards/
│   │   ├── AdminDashboard.tsx          # Admin-specific dashboard
│   │   ├── ExecutiveDashboard.tsx      # Executive-specific dashboard
│   │   ├── EmployeeDashboard.tsx       # Employee-specific dashboard
│   │   └── DirectorDashboard.tsx       # Director-specific dashboard
│   │
│   ├── modules/
│   │   ├── DonorManagement.tsx         # Donor management module
│   │   ├── FinancialTracking.tsx       # Financial tracking module
│   │   ├── ProjectMonitoring.tsx       # Project monitoring module
│   │   ├── ComplianceModule.tsx        # Compliance management
│   │   ├── HRManagement.tsx            # HR management module
│   │   ├── Reports.tsx                 # Reporting module
│   │   └── Settings.tsx                # System settings
│   │
│   ├── pages/
│   │   ├── AddDonation.tsx             # Donation entry page
│   │   ├── RecordExpense.tsx           # Expense recording page
│   │   ├── CreateProject.tsx           # Project creation page
│   │   └── [other pages]
│   │
│   ├── shared/
│   │   ├── LoginForm.tsx               # Authentication form
│   │   ├── SignUpModal.tsx             # Registration modal
│   │   ├── Sidebar.tsx                 # Navigation sidebar
│   │   ├── Dashboard.tsx               # Main dashboard container
│   │   └── [shared components]
│   │
│   └── ui/
│       ├── Button.tsx                  # Reusable button component
│       ├── Modal.tsx                   # Modal component
│       ├── Table.tsx                   # Data table component
│       └── [UI components]
│
├── contexts/
│   ├── AuthContext.tsx                 # Authentication state management
│   └── DashboardContext.tsx            # Application data state
│
├── hooks/
│   ├── useChatbot.ts                   # Chatbot functionality
│   ├── usePartnerRecommendations.ts    # Partner matching logic
│   └── useScrollReset.ts               # Scroll management
│
├── utils/
│   ├── api.js                          # API utility functions
│   ├── formatNumber.ts                 # Number formatting utilities
│   ├── fcraHelpers.ts                  # FCRA compliance helpers
│   └── [utility functions]
│
└── types/
    ├── donation.ts                     # Donation type definitions
    ├── grantApplication.ts             # Grant application types
    └── partner.ts                      # Partner type definitions
```

### Backend Service Architecture

```
backend/
├── authentication/
│   ├── simple_login.php                # User authentication
│   ├── register_user.php               # User registration
│   └── logout.php                      # Session management
│
├── services/
│   ├── donor/
│   │   ├── add_donor_api.php           # Add new donor
│   │   ├── get_donors_api.php          # Fetch donors
│   │   └── donate_api.php              # Process donations
│   │
│   ├── financial/
│   │   ├── add_expense_api.php         # Record expenses
│   │   ├── get_expenses_api.php        # Fetch expenses
│   │   └── financial_reports.php       # Generate reports
│   │
│   ├── projects/
│   │   ├── add_project_api.php         # Create projects
│   │   ├── get_projects_api.php        # Fetch projects
│   │   └── update_project_api.php      # Update projects
│   │
│   ├── compliance/
│   │   ├── add_legal_policy.php        # Policy management
│   │   ├── get_legal_policies.php      # Fetch policies
│   │   └── fcra_compliance.php         # FCRA management
│   │
│   └── hr/
│       ├── add_employee.php            # Employee management
│       ├── get_staff.php               # Staff data
│       └── performance_review.php      # Performance tracking
│
├── database/
│   ├── config.php                      # Database configuration
│   ├── migrations/                     # Database migrations
│   └── seeds/                          # Sample data
│
└── utils/
    ├── validation.php                  # Input validation
    ├── security.php                    # Security utilities
    └── file_handler.php                # File operations
```

## Database Schema Architecture

### Core Entity Relationships

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      Users      │────▶│    Projects     │◀────│   Donations     │
│                 │     │                 │     │                 │
│ • id            │     │ • id            │     │ • id            │
│ • name          │     │ • name          │     │ • donor_name    │
│ • email         │     │ • description   │     │ • amount        │
│ • role          │     │ • budget        │     │ • purpose       │
│ • department    │     │ • spent         │     │ • date          │
│ • created_at    │     │ • progress      │     │ • project_id    │
└─────────────────┘     │ • manager_id    │     └─────────────────┘
         │               │ • status        │              │
         │               └─────────────────┘              │
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Expenses     │     │     Tasks       │     │   Beneficiaries │
│                 │     │                 │     │                 │
│ • id            │     │ • id            │     │ • id            │
│ • category      │     │ • title         │     │ • name          │
│ • amount        │     │ • description   │     │ • age           │
│ • description   │     │ • assignee      │     │ • location      │
│ • project_id    │     │ • project_id    │     │ • project_id    │
│ • approved_by   │     │ • status        │     │ • impact_score  │
│ • receipt_url   │     │ • due_date      │     │ • created_at    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Compliance & Legal Schema

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Legal_Policies  │     │   Documents     │     │ FCRA_Donations  │
│                 │     │                 │     │                 │
│ • id            │     │ • id            │     │ • id            │
│ • policy_name   │     │ • name          │     │ • donor_name    │
│ • policy_type   │     │ • type          │     │ • amount        │
│ • version       │     │ • file_path     │     │ • currency      │
│ • status        │     │ • uploaded_by   │     │ • purpose       │
│ • upload_date   │     │ • upload_date   │     │ • fc6_number    │
│ • expiry_date   │     │ • category      │     │ • receipt_date  │
│ • uploaded_by   │     │ • compliance    │     │ • bank_details  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### HR Management Schema

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      Staff      │     │   Attendance    │     │    Training     │
│                 │     │                 │     │                 │
│ • id            │     │ • id            │     │ • id            │
│ • name          │     │ • staff_id      │     │ • title         │
│ • position      │     │ • date          │     │ • description   │
│ • department    │     │ • check_in      │     │ • duration      │
│ • salary        │     │ • check_out     │     │ • type          │
│ • hire_date     │     │ • status        │     │ • scheduled_date│
│ • performance   │     │ • notes         │     │ • participants  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## API Architecture

### RESTful API Design

```
Authentication Endpoints:
POST   /backend/simple_login.php           # User login
POST   /backend/register_user.php          # User registration
POST   /backend/logout.php                 # User logout

Donor Management Endpoints:
GET    /backend/get_donors_api.php         # Fetch all donors
POST   /backend/add_donor_api.php          # Add new donor
PUT    /backend/update_donor_api.php       # Update donor
DELETE /backend/delete_donor_api.php       # Delete donor
POST   /backend/donate_api.php             # Process donation

Financial Management Endpoints:
GET    /backend/get_expenses_api.php       # Fetch expenses
POST   /backend/add_expense_api.php        # Add expense
GET    /backend/financial_reports.php      # Generate reports
GET    /backend/budget_analysis.php        # Budget analysis

Project Management Endpoints:
GET    /backend/get_projects_api.php       # Fetch projects
POST   /backend/add_project_api.php        # Create project
PUT    /backend/update_project_api.php     # Update project
DELETE /backend/delete_project_api.php     # Delete project
GET    /backend/project_analytics.php      # Project analytics

Compliance Endpoints:
GET    /backend/get_legal_policies.php     # Fetch policies
POST   /backend/add_legal_policy.php       # Add policy
GET    /backend/get_fcradonation_api.php   # FCRA donations
POST   /backend/add_fcradonation_api.php   # Add FCRA donation

HR Management Endpoints:
GET    /backend/get_staff.php              # Fetch staff
POST   /backend/add_employee.php           # Add employee
PUT    /backend/update_employee.php        # Update employee
GET    /backend/performance_review.php     # Performance data
```

### API Response Format

```json
{
  "success": true,
  "data": {
    // Response payload
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-01-15T10:30:00Z",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasNext": true
  }
}
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Client Side   │────▶│   Server Side   │────▶│   Database      │
│                 │     │                 │     │                 │
│ • Form Input    │     │ • Input Valid.  │     │ • User Lookup   │
│ • Client Valid. │     │ • Password Hash │     │ • Role Check    │
│ • Token Storage │     │ • JWT Generate  │     │ • Session Store │
│ • Auto Logout   │     │ • CORS Headers  │     │ • Audit Log     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────────────┐
│                        RBAC Matrix                              │
├─────────────────────────────────────────────────────────────────┤
│ Module/Action    │ Admin │ Executive │ Employee │ Director │     │
├─────────────────────────────────────────────────────────────────┤
│ View Dashboard   │   ✓   │     ✓     │    ✓     │    ✓     │     │
│ Manage Donors    │   ✓   │     ✓     │    ✗     │    ✓     │     │
│ Financial Data   │   ✓   │     ✓     │    ✗     │    ✓     │     │
│ Create Projects  │   ✓   │     ✓     │    ✗     │    ✓     │     │
│ HR Management    │   ✓   │     ✗     │    ✗     │    ✓     │     │
│ System Settings  │   ✓   │     ✗     │    ✗     │    ✗     │     │
│ View Reports     │   ✓   │     ✓     │    ✓     │    ✓     │     │
│ Compliance Mgmt  │   ✓   │     ✓     │    ✗     │    ✓     │     │
└─────────────────────────────────────────────────────────────────┘
```

## Performance Architecture

### Frontend Performance

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Code Splitting │     │     Caching     │     │  Optimization   │
│                 │     │                 │     │                 │
│ • Lazy Loading  │     │ • Browser Cache │     │ • Image Opt.    │
│ • Route Split   │     │ • Service Worker│     │ • Bundle Size   │
│ • Component     │     │ • API Cache     │     │ • Tree Shaking  │
│   Lazy Load     │     │ • Local Storage │     │ • Minification  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Backend Performance

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Database      │     │   API Layer     │     │   File System   │
│                 │     │                 │     │                 │
│ • Query Opt.    │     │ • Response Comp │     │ • File Caching  │
│ • Indexing      │     │ • Rate Limiting │     │ • CDN Usage     │
│ • Connection    │     │ • Load Balancing│     │ • Image Opt.    │
│   Pooling       │     │ • Error Handling│     │ • Lazy Loading  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                    Development Stack                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Frontend  │  │   Backend   │  │  Database   │            │
│  │             │  │             │  │             │            │
│  │ Vite Server │  │ XAMPP       │  │   MySQL     │            │
│  │ Port: 5173  │  │ Apache:80   │  │ Port: 3306  │            │
│  │             │  │ PHP: 8.0+   │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                    Production Stack                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │Load Balancer│  │  Web Server │  │  Database   │            │
│  │             │  │             │  │   Cluster   │            │
│  │   Nginx     │  │ Apache +    │  │   MySQL     │            │
│  │   SSL/TLS   │  │ PHP-FPM     │  │ Master/Slave│            │
│  │   CDN       │  │ Static Files│  │ Replication │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Caching   │  │ Monitoring  │  │   Backup    │            │
│  │             │  │             │  │             │            │
│  │   Redis     │  │ Log Monitor │  │ Automated   │            │
│  │   Memcached │  │ Performance │  │ Daily       │            │
│  │             │  │ Alerts      │  │ Snapshots   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling

```
┌─────────────────────────────────────────────────────────────────┐
│                    Scaling Strategy                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend Scaling:                                              │
│  • CDN Distribution                                             │
│  • Multiple Server Instances                                    │
│  • Geographic Load Distribution                                 │
│                                                                 │
│  Backend Scaling:                                               │
│  • Microservices Architecture                                   │
│  • API Gateway                                                  │
│  • Service Mesh                                                 │
│                                                                 │
│  Database Scaling:                                              │
│  • Read Replicas                                                │
│  • Database Sharding                                            │
│  • Connection Pooling                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

This technical architecture provides a comprehensive foundation for the NGO India system, ensuring scalability, security, and maintainability while supporting all the required functionality for effective NGO management.