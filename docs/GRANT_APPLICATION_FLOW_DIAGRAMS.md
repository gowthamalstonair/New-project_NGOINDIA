# Grant Application Flow Diagrams

## Complete Grant Application Process Flow

### 1. High-Level Grant Application Ecosystem

```mermaid
graph TB
    subgraph "Grant Seekers (NGOs)"
        A1[Discover Grants]
        A2[Check Eligibility]
        A3[Submit Application]
        A4[Track Status]
    end
    
    subgraph "Grant Platform"
        B1[Grant Database]
        B2[Application System]
        B3[Review Workflow]
        B4[Notification System]
    end
    
    subgraph "Grant Providers"
        C1[Create Grant Programs]
        C2[Set Criteria]
        C3[Review Applications]
        C4[Make Decisions]
    end
    
    subgraph "System Administration"
        D1[User Management]
        D2[System Configuration]
        D3[Reporting & Analytics]
        D4[Compliance Monitoring]
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> B2
    A4 --> B4
    
    C1 --> B1
    C2 --> B3
    C3 --> B3
    C4 --> B4
    
    B2 --> B3
    B3 --> B4
    
    D1 --> B2
    D2 --> B1
    D3 --> B3
    D4 --> B2
```

### 2. Detailed Grant Discovery Flow

```mermaid
flowchart TD
    Start([User Visits Platform]) --> Landing[Landing Page]
    Landing --> Browse{Browse Grants?}
    
    Browse -->|Yes| Requirements[Set Requirements Form]
    Browse -->|No| DirectBrowse[Direct Browse]
    
    Requirements --> Category[Select Category]
    Category --> Budget[Set Budget Range]
    Budget --> Beneficiaries[Target Beneficiaries]
    Beneficiaries --> Population[Target Population]
    Population --> FindGrants[Find Matching Grants]
    
    DirectBrowse --> AllGrants[View All Grants]
    FindGrants --> GrantList[Filtered Grant List]
    AllGrants --> GrantList
    
    GrantList --> SelectGrant[Select Grant]
    SelectGrant --> GrantDetails[View Grant Details]
    
    GrantDetails --> EligibilityCheck{Check Eligibility?}
    EligibilityCheck -->|Yes| EligibilityForm[Eligibility Checker]
    EligibilityCheck -->|No| DirectApply[Apply Directly]
    
    EligibilityForm --> EligibilityResult{Eligible?}
    EligibilityResult -->|Yes| ApplyButton[Show Apply Button]
    EligibilityResult -->|No| Suggestions[Show Suggestions]
    
    ApplyButton --> ApplicationForm[Grant Application Form]
    DirectApply --> ApplicationForm
    Suggestions --> AlternativeGrants[Alternative Grants]
    AlternativeGrants --> GrantList
    
    ApplicationForm --> Submit[Submit Application]
    Submit --> Confirmation[Confirmation Page]
    Confirmation --> TrackStatus[Track Application Status]
```

### 3. Grant Application Form Flow

```mermaid
stateDiagram-v2
    [*] --> FormStart
    FormStart --> PersonalInfo : Fill Personal Details
    
    state PersonalInfo {
        [*] --> Name
        Name --> Email
        Email --> Phone
        Phone --> Organization
        Organization --> [*]
    }
    
    PersonalInfo --> ProjectInfo : Next Section
    
    state ProjectInfo {
        [*] --> Title
        Title --> Description
        Description --> Category
        Category --> Amount
        Amount --> Duration
        Duration --> [*]
    }
    
    ProjectInfo --> DocumentUpload : Next Section
    
    state DocumentUpload {
        [*] --> ProjectProposal
        ProjectProposal --> Budget
        Budget --> Timeline
        Timeline --> Certificates
        Certificates --> [*]
    }
    
    DocumentUpload --> Validation : Submit Form
    
    state Validation {
        [*] --> ClientValidation
        ClientValidation --> ServerValidation
        ServerValidation --> [*]
    }
    
    Validation --> Success : Valid
    Validation --> Error : Invalid
    Error --> PersonalInfo : Fix Errors
    Success --> [*]
```

### 4. Application Review Workflow

```mermaid
graph TD
    A[Application Submitted] --> B[Auto-Acknowledgment]
    B --> C[Initial Screening]
    
    C --> D{Meets Basic Criteria?}
    D -->|No| E[Auto-Reject]
    D -->|Yes| F[Assign Reviewer]
    
    F --> G[Technical Review]
    G --> H[Financial Assessment]
    H --> I[Impact Evaluation]
    
    I --> J{Review Complete?}
    J -->|No| K[Request Additional Info]
    J -->|Yes| L[Final Decision]
    
    K --> M[Notify Applicant]
    M --> N[Applicant Response]
    N --> O{Response Received?}
    O -->|Yes| G
    O -->|No| P[Follow-up Reminder]
    P --> Q{Deadline Passed?}
    Q -->|Yes| R[Close Application]
    Q -->|No| O
    
    L --> S{Decision}
    S -->|Approve| T[Grant Approved]
    S -->|Reject| U[Application Rejected]
    S -->|Conditional| V[Conditional Approval]
    
    E --> W[Send Rejection Notice]
    T --> X[Send Approval Notice]
    U --> W
    V --> Y[Send Conditional Notice]
    
    X --> Z[Grant Agreement]
    Y --> AA[Condition Fulfillment]
    AA --> BB{Conditions Met?}
    BB -->|Yes| Z
    BB -->|No| U
    
    Z --> CC[Fund Disbursement]
    W --> DD[Application Closed]
    CC --> EE[Project Monitoring]
    DD --> FF[End]
    EE --> FF
```

### 5. User Role-Based Access Flow

```mermaid
graph LR
    subgraph "Grant Seeker Flow"
        A1[Login/Register] --> A2[Browse Grants]
        A2 --> A3[Apply for Grants]
        A3 --> A4[Track Applications]
        A4 --> A5[Manage Profile]
    end
    
    subgraph "Grant Administrator Flow"
        B1[Admin Login] --> B2[Manage Grants]
        B2 --> B3[Review Applications]
        B3 --> B4[Make Decisions]
        B4 --> B5[Generate Reports]
    end
    
    subgraph "System Admin Flow"
        C1[System Login] --> C2[User Management]
        C2 --> C3[System Configuration]
        C3 --> C4[Monitor Performance]
        C4 --> C5[Maintain Security]
    end
    
    subgraph "Reviewer Flow"
        D1[Reviewer Login] --> D2[View Assigned Apps]
        D2 --> D3[Conduct Reviews]
        D3 --> D4[Submit Recommendations]
        D4 --> D5[Track Review Status]
    end
```

### 6. Data Flow Architecture

```mermaid
graph TB
    subgraph "User Interface Layer"
        UI1[Grant Discovery UI]
        UI2[Application Form UI]
        UI3[Status Tracking UI]
        UI4[Admin Dashboard UI]
    end
    
    subgraph "API Gateway"
        API1[Authentication API]
        API2[Grant Search API]
        API3[Application API]
        API4[Review API]
        API5[Notification API]
    end
    
    subgraph "Business Logic Layer"
        BL1[Eligibility Engine]
        BL2[Validation Service]
        BL3[Workflow Engine]
        BL4[Notification Service]
        BL5[Report Generator]
    end
    
    subgraph "Data Access Layer"
        DAL1[Grant Repository]
        DAL2[Application Repository]
        DAL3[User Repository]
        DAL4[Document Repository]
    end
    
    subgraph "Data Storage"
        DB1[(Grant Database)]
        DB2[(Application Database)]
        DB3[(User Database)]
        FS1[File Storage]
    end
    
    UI1 --> API2
    UI2 --> API3
    UI3 --> API3
    UI4 --> API4
    
    API1 --> BL2
    API2 --> BL1
    API3 --> BL2
    API4 --> BL3
    API5 --> BL4
    
    BL1 --> DAL1
    BL2 --> DAL2
    BL3 --> DAL2
    BL4 --> DAL3
    BL5 --> DAL1
    
    DAL1 --> DB1
    DAL2 --> DB2
    DAL3 --> DB3
    DAL4 --> FS1
```

### 7. Application Status Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft : Start Application
    Draft --> Submitted : Submit Application
    Submitted --> UnderReview : Begin Review
    
    UnderReview --> PendingInfo : Request Info
    PendingInfo --> UnderReview : Info Provided
    PendingInfo --> Withdrawn : Applicant Withdraws
    
    UnderReview --> TechnicalReview : Pass Initial
    TechnicalReview --> FinancialReview : Pass Technical
    FinancialReview --> FinalReview : Pass Financial
    
    FinalReview --> Approved : Approve
    FinalReview --> Rejected : Reject
    FinalReview --> Conditional : Conditional Approval
    
    Conditional --> Approved : Conditions Met
    Conditional --> Rejected : Conditions Not Met
    
    Approved --> Active : Grant Awarded
    Active --> Completed : Project Completed
    Active --> Terminated : Early Termination
    
    Rejected --> [*]
    Withdrawn --> [*]
    Completed --> [*]
    Terminated --> [*]
```

### 8. Document Management Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant V as Validation
    participant S as Storage
    participant D as Database
    
    U->>F: Upload Document
    F->>F: Client-side Validation
    F->>A: POST /upload-document
    
    A->>V: Validate File Type
    V->>V: Check File Size
    V->>V: Scan for Malware
    
    alt Validation Passes
        V->>S: Store File
        S-->>V: Return File Path
        V->>D: Save Document Record
        D-->>V: Return Document ID
        V-->>A: Success Response
        A-->>F: Document Uploaded
        F-->>U: Show Success Message
    else Validation Fails
        V-->>A: Validation Error
        A-->>F: Error Response
        F-->>U: Show Error Message
    end
```

### 9. Notification System Flow

```mermaid
graph TD
    A[Trigger Event] --> B{Event Type}
    
    B -->|Application Submitted| C[Confirmation Email]
    B -->|Status Changed| D[Status Update Email]
    B -->|Document Required| E[Document Request Email]
    B -->|Deadline Approaching| F[Reminder Email]
    B -->|Decision Made| G[Decision Email]
    
    C --> H[Email Template Engine]
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I[Personalize Content]
    I --> J[Send Email]
    J --> K[Log Notification]
    K --> L[Update Delivery Status]
    
    L --> M{Delivery Success?}
    M -->|Yes| N[Mark as Sent]
    M -->|No| O[Retry Logic]
    O --> P{Max Retries?}
    P -->|No| J
    P -->|Yes| Q[Mark as Failed]
    
    N --> R[End]
    Q --> R
```

### 10. Integration Architecture

```mermaid
graph TB
    subgraph "External Systems"
        EXT1[Email Service]
        EXT2[Payment Gateway]
        EXT3[Document Scanner]
        EXT4[Government APIs]
        EXT5[Banking APIs]
    end
    
    subgraph "Grant Application Platform"
        CORE[Core Application]
        AUTH[Authentication]
        NOTIF[Notification Service]
        DOC[Document Service]
        PAY[Payment Service]
        COMP[Compliance Service]
    end
    
    subgraph "Internal Systems"
        INT1[User Management]
        INT2[Financial System]
        INT3[Reporting System]
        INT4[Audit System]
    end
    
    CORE --> AUTH
    CORE --> NOTIF
    CORE --> DOC
    CORE --> PAY
    CORE --> COMP
    
    NOTIF --> EXT1
    PAY --> EXT2
    DOC --> EXT3
    COMP --> EXT4
    PAY --> EXT5
    
    AUTH --> INT1
    PAY --> INT2
    CORE --> INT3
    COMP --> INT4
```

---

*Document Version: 1.0*  
*Last Updated: January 15, 2025*  
*Author: Grant Application Team*