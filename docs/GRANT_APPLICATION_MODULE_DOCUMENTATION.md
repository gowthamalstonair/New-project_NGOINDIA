# Grant Application Module Documentation

## Overview
The Grant Application Module enables NGOs to discover, apply for, and manage grant applications through a comprehensive web interface.

## Module Components

### 1. Grant Discovery (`BrowseGrants.tsx`)
- Browse available grants by category
- Filter by amount, location, requirements
- Eligibility checker
- Requirements form for matching

### 2. Application Form (`GrantApplicationForm.tsx`)
- Multi-step application process
- Personal and organization information
- Project details and budget
- Document upload capability

### 3. Application Management (`GrantApplication.tsx`)
- View submitted applications
- Track application status
- Domain-based grant categories
- Application statistics

## User Flow

```mermaid
flowchart TD
    A[User Visits Grant Module] --> B[Choose Grant Domain]
    B --> C[Browse Available Grants]
    C --> D{Check Eligibility?}
    D -->|Yes| E[Eligibility Checker]
    D -->|No| F[Apply Directly]
    E --> G{Eligible?}
    G -->|Yes| F
    G -->|No| H[Show Requirements]
    F --> I[Fill Application Form]
    I --> J[Submit Application]
    J --> K[Application Submitted]
    K --> L[Track Status]
```

## Application Status Flow

```mermaid
stateDiagram-v2
    [*] --> submitted: Form Submitted
    submitted --> under_review: Admin Review
    under_review --> approved: Approved
    under_review --> rejected: Rejected
    approved --> [*]
    rejected --> [*]
```

## API Integration

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    
    U->>F: Submit Application
    F->>A: POST /add_grant_application_api.php
    A->>D: INSERT application
    D-->>A: Success
    A-->>F: Response
    F-->>U: Confirmation
    
    U->>F: View Applications
    F->>A: GET /get_grant_applications_api.php
    A->>D: SELECT applications
    D-->>A: Data
    A-->>F: Applications List
    F-->>U: Display Applications
```

## Grant Categories

1. **Education** - Digital literacy, infrastructure, capacity building
2. **Healthcare** - Rural access, community health, medical infrastructure  
3. **Ecology** - Climate action, biodiversity, green infrastructure
4. **Disaster Response** - Preparedness, emergency response, rehabilitation

## Key Features

- **Requirements Matching**: Automated grant discovery based on user criteria
- **Multi-step Forms**: Structured application process with validation
- **Status Tracking**: Real-time application status updates
- **Document Management**: Secure file upload and storage
- **Admin Review**: Workflow for grant review and approval

## Technical Stack

- **Frontend**: React + TypeScript
- **Backend**: PHP APIs
- **Database**: MySQL
- **Styling**: Tailwind CSS
- **Icons**: Lucide React