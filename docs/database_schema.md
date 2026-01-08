# Database Schema Design for CIC Project Management

## 1. Projects Table (`projects`)
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary Key |
| code | TEXT | Project Code (e.g., 25010) |
| name | TEXT | Project Name |
| client | TEXT | Client Name |
| capital_source | TEXT | 'StateBudget' or 'NonStateBudget' |
| status | TEXT | Project Status |
| progress | INT | Percentage (0-100) |
| budget | NUMERIC | Total Budget |
| ... | ... | Other fields from `Project` interface |

## 2. RACI Definitions (`raci_matrices`)
Stores the dynamic RACI structure for projects.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary Key |
| project_id | UUID | Foreign Key -> projects.id |
| phase | TEXT | Phase Name (e.g., '1. Xúc tiến Dự án') |
| task_name | TEXT | Task Name |
| roles | JSONB | Map of Role -> Responsibility (e.g., {"QLDA": "R", "GĐTT": "A"}) |
| workflow_id | UUID | Optional FK -> workflows.id |

## 3. Workflows (`workflows`)
Stores the step-by-step processes linked to tasks.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary Key |
| name | TEXT | Workflow Name (e.g., 'Thuyết trình khách hàng') |
| type | TEXT | Category tag |

## 4. Workflow Steps (`workflow_steps`)
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary Key |
| workflow_id | UUID | Foreign Key -> workflows.id |
| step_number | INT | Order of the step |
| title | TEXT | Step Title |
| description | TEXT | Detailed description |
| role | TEXT | Role responsible for this step |
| output | TEXT | Expected deliverable |

## 5. Financials (`project_financials`)
| Column | Type | Description |
|---|---|---|
| project_id | UUID | Primary Key / FK -> projects.id |
| revenue | NUMERIC | Actual Revenue recognized |
| cost | NUMERIC | Actual Cost incurred |
| invoiced | NUMERIC | Total amount invoiced |
| received | NUMERIC | Total cash received |

## 6. Tasks (`tasks`) (Updated)
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary Key |
| project_id | UUID | FK -> projects.id |
| name | TEXT | Task Name |
| status | TEXT | Task Status (Enum) |
| ... | ... | Other Task attributes |

## 7. Contracts (`contracts`) (Updated)
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary Key |
| project_id | UUID | FK -> projects.id (or fuzzy match via name) |
| code | TEXT | Contract Code |
| ... | ... | Other attributes |
