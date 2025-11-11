# NGO India - User Flow Diagrams

## Complete User Journey Flow

### 1. Landing Page to Dashboard Flow

```mermaid
graph TD
    A[User Visits Website] --> B[Landing Page]
    B --> C{User Action}
    C -->|Click Login| D[Login Modal Opens]
    C -->|Click Register| E[Registration Modal Opens]
    C -->|Browse Content| F[Explore Features]
    
    D --> G[Enter Credentials]
    G --> H[Select Role]
    H --> I{Authentication}
    I -->|Success| J[Role-Based Dashboard]
    I -->|Failure| K[Error Message]
    K --> D
    
    E --> L[Select Role]
    L --> M[Fill Registration Form]
    M --> N[Submit Form]
    N --> O{Validation}
    O -->|Success| P[Account Created]
    O -->|Failure| Q[Show Errors]
    Q --> M
    P --> J
    
    J --> R{User Role}
    R -->|Admin| S[Admin Dashboard]
    R -->|Executive| T[Executive Dashboard]
    R -->|Employee| U[Employee Dashboard]
    R -->|Director| V[Director Dashboard]
```

### 2. Role-Based Dashboard Navigation

```mermaid
graph LR
    A[Dashboard Login] --> B{Role Detection}
    
    B -->|Admin| C[Admin Dashboard]
    C --> C1[Total Donations: ₹25L]
    C --> C2[Active Projects: 12]
    C --> C3[Quick Actions]
    C3 --> C4[Add Donation]
    C3 --> C5[Record Expense]
    C3 --> C6[Update Project]
    
    B -->|Executive| D[Executive Dashboard]
    D --> D1[Impact Score: 85/100]
    D --> D2[Strategic Metrics]
    D --> D3[Risk Management]
    D3 --> D4[Budget Overrun Alert]
    D3 --> D5[Donor Retention]
    
    B -->|Employee| E[Employee Dashboard]
    E --> E1[My Tasks: 8 Pending]
    E --> E2[Training Schedule]
    E --> E3[Performance: 4.8/5]
    E3 --> E4[Mark Attendance]
    E3 --> E5[Submit Report]
    
    B -->|Director| F[Director Dashboard]
    F --> F1[Department Overview]
    F --> F2[Team Management]
    F --> F3[Resource Allocation]
```

### 3. Module Access Flow

```mermaid
graph TD
    A[Dashboard Sidebar] --> B{Module Selection}
    
    B -->|Donors| C[Donor Management]
    C --> C1[View Donors List]
    C --> C2[Add New Donor]
    C --> C3[Track Donations]
    C --> C4[Generate Receipts]
    
    B -->|Finances| D[Financial Tracking]
    D --> D1[Income Overview]
    D --> D2[Expense Management]
    D --> D3[Budget Planning]
    D --> D4[Financial Reports]
    
    B -->|Projects| E[Project Monitoring]
    E --> E1[Active Projects]
    E --> E2[Create New Project]
    E --> E3[Progress Tracking]
    E --> E4[Impact Assessment]
    
    B -->|Compliance| F[Compliance Module]
    F --> F1[FCRA Compliance]
    F --> F2[Legal Policies]
    F --> F3[Document Management]
    F --> F4[AI Validation]
    
    B -->|HR| G[HR Management]
    G --> G1[Employee Records]
    G --> G2[Performance Reviews]
    G --> G3[Training Programs]
    G --> G4[Attendance System]
    
    B -->|Reports| H[Reports & Analytics]
    H --> H1[Financial Reports]
    H --> H2[Impact Reports]
    H --> H3[Compliance Reports]
    H --> H4[Custom Reports]
```

### 4. Donation Process Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    
    U->>F: Click "Add Donation"
    F->>F: Open Donation Form
    U->>F: Fill Donor Details
    U->>F: Enter Amount & Purpose
    U->>F: Upload Receipt (Optional)
    U->>F: Submit Form
    
    F->>F: Validate Form Data
    F->>A: POST /add_donor_api.php
    A->>D: Insert Donor Record
    D-->>A: Return Donor ID
    
    A->>D: Insert Donation Record
    D-->>A: Return Donation ID
    A-->>F: Success Response
    
    F->>F: Update UI
    F->>F: Show Success Message
    F->>F: Refresh Donations List
    
    Note over U,D: Donation Successfully Recorded
```

### 5. Project Creation & Monitoring Flow

```mermaid
graph TD
    A[Create New Project] --> B[Project Form]
    B --> C[Enter Project Details]
    C --> D[Set Budget & Timeline]
    D --> E[Assign Team Members]
    E --> F[Define Milestones]
    F --> G[Submit Project]
    
    G --> H{Approval Process}
    H -->|Admin Approval| I[Project Approved]
    H -->|Needs Review| J[Request Changes]
    J --> C
    
    I --> K[Project Active]
    K --> L[Progress Tracking]
    L --> M[Update Milestones]
    M --> N[Record Expenses]
    N --> O[Impact Assessment]
    
    O --> P{Project Status}
    P -->|Ongoing| L
    P -->|Completed| Q[Project Closure]
    P -->|Issues| R[Risk Management]
    
    Q --> S[Final Report]
    S --> T[Impact Analysis]
    T --> U[Archive Project]
```

### 6. Compliance Management Flow

```mermaid
graph LR
    A[Compliance Module] --> B[Document Upload]
    B --> C[AI Validation]
    C --> D{Validation Result}
    
    D -->|Compliant| E[Auto-Approve]
    D -->|Needs Review| F[Manual Review]
    D -->|Non-Compliant| G[Flag Issues]
    
    E --> H[Update Records]
    F --> I[Reviewer Assignment]
    I --> J[Review Process]
    J --> K{Review Decision}
    K -->|Approve| H
    K -->|Reject| L[Request Corrections]
    
    G --> M[Generate Alert]
    M --> N[Notify Admin]
    N --> O[Corrective Action]
    
    H --> P[Compliance Dashboard]
    P --> Q[Generate Reports]
    Q --> R[Audit Trail]
```

### 7. User Registration Flow

```mermaid
graph TD
    A[Click Register] --> B[Registration Modal]
    B --> C[Select Role]
    
    C --> D{Role Type}
    D -->|Administrator| E[Admin Form]
    D -->|Executive Director| F[Executive Form]
    D -->|Employee| G[Employee Form]
    
    E --> H[Fill Personal Info]
    F --> I[Fill Personal + Org Info]
    G --> J[Fill Personal Info]
    
    H --> K[Submit Form]
    I --> K
    J --> K
    
    K --> L{Form Validation}
    L -->|Valid| M[Create Account]
    L -->|Invalid| N[Show Errors]
    N --> H
    
    M --> O[Auto Login]
    O --> P[Welcome Message]
    P --> Q[Role-Based Dashboard]
```

### 8. Financial Tracking Flow

```mermaid
graph TD
    A[Financial Module] --> B[Dashboard Overview]
    B --> C[Total Income: ₹50L]
    B --> D[Total Expenses: ₹35L]
    B --> E[Net Balance: ₹15L]
    
    B --> F{Action Selection}
    F -->|Record Income| G[Income Form]
    F -->|Record Expense| H[Expense Form]
    F -->|View Reports| I[Financial Reports]
    F -->|Budget Planning| J[Budget Module]
    
    G --> K[Enter Income Details]
    K --> L[Categorize Income]
    L --> M[Upload Receipt]
    M --> N[Save Income Record]
    
    H --> O[Enter Expense Details]
    O --> P[Select Project/Category]
    P --> Q[Upload Receipt]
    Q --> R[Approval Workflow]
    R --> S[Save Expense Record]
    
    I --> T[Generate Report]
    T --> U[Export Options]
    U --> V[PDF/Excel Download]
    
    J --> W[Set Budget Limits]
    W --> X[Allocate Funds]
    X --> Y[Monitor Spending]
```

### 9. HR Management Flow

```mermaid
graph LR
    A[HR Module] --> B{HR Functions}
    
    B -->|Employee Mgmt| C[Employee Records]
    C --> C1[Add Employee]
    C --> C2[Update Profile]
    C --> C3[Performance Review]
    
    B -->|Attendance| D[Attendance System]
    D --> D1[Mark Attendance]
    D --> D2[View Reports]
    D --> D3[Leave Management]
    
    B -->|Training| E[Training Programs]
    E --> E1[Schedule Training]
    E --> E2[Track Progress]
    E --> E3[Certificates]
    
    B -->|Payroll| F[Payroll Management]
    F --> F1[Salary Processing]
    F --> F2[Tax Calculations]
    F --> F3[Pay Slips]
```

### 10. Reporting & Analytics Flow

```mermaid
graph TD
    A[Reports Module] --> B[Report Types]
    
    B --> C[Financial Reports]
    C --> C1[Income Statement]
    C --> C2[Expense Report]
    C --> C3[Budget vs Actual]
    C --> C4[Donor Analysis]
    
    B --> D[Project Reports]
    D --> D1[Project Status]
    D --> D2[Progress Reports]
    D --> D3[Impact Assessment]
    D --> D4[Resource Utilization]
    
    B --> E[Compliance Reports]
    E --> E1[FCRA Reports]
    E --> E2[Audit Reports]
    E --> E3[Legal Compliance]
    E --> E4[Document Status]
    
    B --> F[Custom Reports]
    F --> F1[Report Builder]
    F --> F2[Data Selection]
    F --> F3[Visualization]
    F --> F4[Export Options]
    
    C1 --> G[Generate Report]
    D1 --> G
    E1 --> G
    F1 --> G
    
    G --> H[Report Preview]
    H --> I[Export/Share]
    I --> J[PDF/Excel/Email]
```

## Key User Interactions

### Dashboard Quick Actions
1. **Admin Dashboard:**
   - Add Donation → Opens donation form
   - Record Expense → Opens expense form
   - Update Project → Opens project update form

2. **Executive Dashboard:**
   - Review Budget → Opens financial module
   - Approve Initiative → Opens project approval
   - Generate Report → Opens reports module

3. **Employee Dashboard:**
   - Mark Attendance → Updates attendance record
   - Submit Report → Opens report submission form
   - Request Leave → Opens leave request form

### Module Navigation
- **Sidebar Navigation:** Single-click module switching
- **Breadcrumb Navigation:** Easy back navigation
- **Quick Search:** Global search functionality
- **Notifications:** Real-time alerts and updates

### Data Flow Patterns
1. **Create Operations:** Form → Validation → API → Database → UI Update
2. **Read Operations:** Request → API → Database → Response → UI Render
3. **Update Operations:** Form → Validation → API → Database → UI Refresh
4. **Delete Operations:** Confirmation → API → Database → UI Remove

This comprehensive flow documentation ensures that every user interaction is mapped and the complete journey from landing page to specific module functionality is clearly defined.