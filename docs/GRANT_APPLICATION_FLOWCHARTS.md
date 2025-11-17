# Grant Application Module - Flowcharts

## 1. Complete User Journey

```mermaid
flowchart TD
    Start([User Enters System]) --> Domain[Select Grant Domain]
    Domain --> Browse[Browse Available Grants]
    Browse --> Filter{Apply Filters?}
    Filter -->|Yes| FilterForm[Set Requirements]
    Filter -->|No| GrantList[View Grant List]
    FilterForm --> GrantList
    GrantList --> SelectGrant[Select Specific Grant]
    SelectGrant --> EligCheck{Check Eligibility?}
    EligCheck -->|Yes| EligForm[Fill Eligibility Form]
    EligCheck -->|No| AppForm[Application Form]
    EligForm --> EligResult{Eligible?}
    EligResult -->|Yes| AppForm
    EligResult -->|No| Suggestions[Show Alternative Grants]
    Suggestions --> GrantList
    AppForm --> Step1[Personal Info]
    Step1 --> Step2[Project Details]
    Step2 --> Step3[Budget Info]
    Step3 --> Step4[Skills & Resources]
    Step4 --> Step5[Documents]
    Step5 --> Submit[Submit Application]
    Submit --> Confirmation[Success Confirmation]
    Confirmation --> Track[Track Application Status]
    Track --> End([Process Complete])
```

## 2. Application Status Workflow

```mermaid
stateDiagram-v2
    [*] --> Draft: User Starts Form
    Draft --> Submitted: Form Completed & Submitted
    Submitted --> UnderReview: Admin Begins Review
    UnderReview --> NeedsRevision: Requires Changes
    UnderReview --> Approved: Meets Criteria
    UnderReview --> Rejected: Doesn't Meet Criteria
    NeedsRevision --> Submitted: User Resubmits
    Approved --> Funded: Grant Awarded
    Approved --> Completed: Project Finished
    Rejected --> [*]: Process Ends
    Funded --> Completed: Project Execution
    Completed --> [*]: Final State
```

## 3. Data Flow Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Grant Discovery UI]
        B[Application Form UI]
        C[Status Dashboard UI]
    end
    
    subgraph "API Layer"
        D[Browse Grants API]
        E[Submit Application API]
        F[Get Applications API]
        G[Update Status API]
    end
    
    subgraph "Database Layer"
        H[(grant_applications)]
        I[(grants)]
        J[(eligibility_criteria)]
    end
    
    A --> D
    B --> E
    C --> F
    C --> G
    
    D --> I
    E --> H
    F --> H
    G --> H
    
    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style H fill:#f3e5f5
    style I fill:#f3e5f5
    style J fill:#f3e5f5
```

## 4. Grant Discovery Process

```mermaid
flowchart LR
    A[User Requirements] --> B[Category Filter]
    B --> C[Amount Range]
    C --> D[Location Filter]
    D --> E[Keywords Search]
    E --> F[Matching Algorithm]
    F --> G[Filtered Results]
    G --> H[Grant Details]
    H --> I{Apply?}
    I -->|Yes| J[Application Form]
    I -->|No| K[Browse More]
    K --> B
```

## 5. Form Validation Flow

```mermaid
flowchart TD
    A[User Input] --> B{Required Fields?}
    B -->|Missing| C[Show Error]
    B -->|Complete| D{Valid Format?}
    D -->|Invalid| E[Format Error]
    D -->|Valid| F{Amount Valid?}
    F -->|Invalid| G[Amount Error]
    F -->|Valid| H[Enable Submit]
    C --> I[Focus Field]
    E --> I
    G --> I
    I --> A
    H --> J[Submit to API]
```

## 6. Admin Review Process

```mermaid
sequenceDiagram
    participant A as Admin
    participant S as System
    participant D as Database
    participant U as User
    
    A->>S: Access Review Dashboard
    S->>D: Fetch Pending Applications
    D-->>S: Return Applications
    S-->>A: Display Applications
    A->>S: Select Application
    S->>D: Get Application Details
    D-->>S: Return Details
    S-->>A: Show Full Application
    A->>S: Update Status (Approve/Reject)
    S->>D: Update Application Status
    D-->>S: Confirm Update
    S->>U: Send Notification
    S-->>A: Confirm Status Change
```

## 7. Error Handling Flow

```mermaid
flowchart TD
    A[API Call] --> B{Success?}
    B -->|Yes| C[Process Response]
    B -->|No| D{Network Error?}
    D -->|Yes| E[Show Retry Option]
    D -->|No| F{Validation Error?}
    F -->|Yes| G[Show Field Errors]
    F -->|No| H[Show Generic Error]
    E --> I[Retry Button]
    I --> A
    G --> J[Highlight Fields]
    H --> K[Error Message]
    C --> L[Update UI]
```