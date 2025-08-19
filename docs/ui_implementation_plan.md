# LiteHouse Shadcn UI Component Mapping

## Navigation Flow Components

├── Application Entry
│ ├── Session Initialization
│ │ ├── Generate unique session ID — **skeleton**
│ │ └── Initialize DuckDB connection — **progress**
│ └── Landing on Main Dashboard
│ ├── Empty state display — **card**
│ └── Guided onboarding hints — **alert**
├── File Upload Flow
│ ├── Drag and Drop Interaction
│ │ ├── Visual feedback during drag — **hover-card**
│ │ ├── Drop zone highlighting — **card** (with custom styling)
│ │ └── File validation (CSV, Parquet, JSON, SQLite) — **alert**
│ ├── File Processing
│ │ ├── Upload progress indicator — **progress**
│ │ ├── Table registration in DuckDB — **skeleton**
│ │ └── Schema extraction — **skeleton**
│ └── Post-Upload State
│ ├── File metadata display — **card**
│ ├── Schema explorer population — **accordion**
│ └── Ready-to-query indication — **badge**
├── Query Execution Flow
│ ├── SQL Editor Interaction
│ │ ├── Query composition — **textarea**
│ │ ├── Syntax highlighting — **textarea** (with Monaco Editor)
│ │ └── Example query suggestions — **dropdown-menu**
│ ├── Query Execution
│ │ ├── SQL validation — **alert**
│ │ ├── Execution with timeout — **progress**
│ │ └── Progress indication — **progress**
│ └── Results Display
│ ├── Paginated table view — **table** + **pagination**
│ ├── Column metadata — **tooltip**
│ └── Export options — **dropdown-menu**
└── Data Export Flow
├── Export Configuration
│ ├── Format selection (CSV) — **select**
│ └── Export parameters — **form**
├── Export Processing
│ ├── Data preparation — **progress**
│ └── Download generation — **progress**
└── Download Completion
└── Success confirmation — **alert**

## Dashboard Page Structure Components

├── Application Header
│ ├── Brand Identity
│ │ ├── LiteHouse Logo — **avatar** or custom logo component
│ │ └── Application Title — **h1** text element
│ ├── Session Information
│ │ ├── Session ID Display — **badge**
│ │ └── Connection Status Indicator — **badge** (with status colors)
│ └── Global Actions
│ ├── Clear Session Button — **button**
│ └── Help/Documentation Link — **button** (variant: ghost)
├── Main Content Area
│ ├── Left Sidebar (Schema Explorer) — **sidebar** block (sidebar-01 or similar)
│ │ ├── Sidebar Header
│ │ │ ├── "Tables" Title — **h3** text element
│ │ │ └── Collapse/Expand Toggle — **button** + **collapsible**
│ │ ├── Tables List
│ │ │ ├── Table Item
│ │ │ │ ├── Table Name — **label**
│ │ │ │ ├── Table Type Icon — **badge**
│ │ │ │ └── Row Count Badge — **badge**
│ │ │ └── Expandable Column List — **accordion**
│ │ │ ├── Column Name — **label**
│ │ │ ├── Data Type — **badge**
│ │ │ └── Nullable Indicator — **badge**
│ │ └── Empty State
│ │ ├── "No tables loaded" Message — **card** with empty state
│ │ └── Upload Instruction Text — **alert**
│ ├── Central Work Area — **resizable** panels
│ │ ├── File Upload Zone (Top Section)
│ │ │ ├── Drag and Drop Area
│ │ │ │ ├── Drop Zone Container — **card** (dashed border)
│ │ │ │ │ ├── Upload Icon — Icon component
│ │ │ │ │ ├── Primary Text: "Drag & drop your data files here" — **p** text
│ │ │ │ │ ├── Secondary Text: "Supports CSV, Parquet, JSON, SQLite" — **p** text (muted)
│ │ │ │ │ └── Browse Files Button — **button**
│ │ │ │ ├── Active Drop State
│ │ │ │ │ ├── Highlighted Border — **card** (highlighted variant)
│ │ │ │ │ ├── Background Color Change — CSS styling
│ │ │ │ │ └── "Drop files to upload" Text — **p** text
│ │ │ │ └── Upload Progress
│ │ │ │ ├── Progress Bar — **progress**
│ │ │ │ ├── File Name — **label**
│ │ │ │ └── Upload Status — **badge**
│ │ │ └── Uploaded Files Summary
│ │ │ ├── File Cards — **card** grid
│ │ │ │ ├── File Name — **label**
│ │ │ │ ├── File Type Icon — Icon + **badge**
│ │ │ │ ├── File Size — **badge**
│ │ │ │ ├── Upload Timestamp — **label** (muted)
│ │ │ │ └── Remove File Button — **button** (variant: ghost, size: sm)
│ │ │ └── Quick Stats
│ │ │ ├── Total Files Count — **badge**
│ │ │ └── Total Data Size — **badge**
│ │ ├── SQL Editor Section (Middle Section)
│ │ │ ├── Editor Header
│ │ │ │ ├── "SQL Query" Title — **h3** text element
│ │ │ │ ├── Query Actions
│ │ │ │ │ ├── Run Query Button — **button** (primary)
│ │ │ │ │ ├── Clear Editor Button — **button** (variant: outline)
│ │ │ │ │ └── Format Query Button — **button** (variant: ghost)
│ │ │ │ └── Query Status
│ │ │ │ ├── Execution Time Display — **badge**
│ │ │ │ └── Query Validation Status — **badge** (with status colors)
│ │ │ ├── Monaco Editor Container — **card** + Monaco Editor integration
│ │ │ │ ├── SQL Syntax Highlighting — Monaco Editor feature
│ │ │ │ ├── Auto-completion — Monaco Editor feature
│ │ │ │ ├── Error Highlighting — Monaco Editor feature
│ │ │ │ └── Line Numbers — Monaco Editor feature
│ │ │ ├── Query Examples Panel
│ │ │ │ ├── "Example Queries" Dropdown — **dropdown-menu**
│ │ │ │ └── Predefined Query Templates
│ │ │ │ ├── "SELECT _ FROM table_name" — **dropdown-menu** item
│ │ │ │ ├── "DESCRIBE table_name" — **dropdown-menu** item
│ │ │ │ └── "SELECT COUNT(_) FROM table_name" — **dropdown-menu** item
│ │ │ └── Query Execution Feedback
│ │ │ ├── Success State
│ │ │ │ ├── Green Checkmark — Icon component
│ │ │ │ └── "Query executed successfully" — **alert** (success variant)
│ │ │ ├── Error State
│ │ │ │ ├── Red Error Icon — Icon component
│ │ │ │ └── Error Message Display — **alert** (destructive variant)
│ │ │ └── Loading State
│ │ │ ├── Spinner Animation — **skeleton** or loading spinner
│ │ │ └── "Executing query..." Text — **p** text with **skeleton**
│ │ └── Results Display Section (Bottom Section)
│ │ ├── Results Header
│ │ │ ├── "Query Results" Title — **h3** text element
│ │ │ ├── Results Summary
│ │ │ │ ├── Row Count Display — **badge**
│ │ │ │ ├── Column Count Display — **badge**
│ │ │ │ └── Execution Time — **badge**
│ │ │ └── Results Actions
│ │ │ ├── Export to CSV Button — **button** (variant: outline)
│ │ │ ├── Refresh Results Button — **button** (variant: ghost)
│ │ │ └── Clear Results Button — **button** (variant: ghost)
│ │ ├── Data Table Container — **table** + **scroll-area**
│ │ │ ├── Table Header Row — **table** header
│ │ │ │ ├── Column Names — **table** header cells
│ │ │ │ ├── Data Type Indicators — **badge** in header
│ │ │ │ └── Sort Controls — **button** (variant: ghost) with sort icons
│ │ │ ├── Table Body — **table** body
│ │ │ │ ├── Data Rows — **table** rows
│ │ │ │ ├── Cell Value Display — **table** cells
│ │ │ │ └── Null Value Indicators — **badge** (muted) or styled text
│ │ │ └── Table Footer — **table** footer
│ │ │ ├── Pagination Controls — **pagination**
│ │ │ │ ├── Previous Page Button — **pagination** previous
│ │ │ │ ├── Page Number Display — **pagination** content
│ │ │ │ ├── Next Page Button — **pagination** next
│ │ │ │ └── Rows Per Page Selector — **select**
│ │ │ └── Results Navigation Info
│ │ │ ├── "Showing X-Y of Z rows" — **p** text (muted)
│ │ │ └── Jump to Page Input — **input** (number type)
│ │ └── Empty Results State
│ │ ├── "No results to display" Message — **card** with empty state
│ │ └── Query Suggestion Text — **p** text (muted)
│ └── Right Sidebar (File Metadata Panel) — **sheet** or **card**
│ ├── Metadata Header
│ │ ├── "File Details" Title — **h3** text element
│ │ └── Minimize/Expand Toggle — **button** + **collapsible**
│ ├── Active File Information
│ │ ├── File Properties — **card**
│ │ │ ├── File Name Display — **label**
│ │ │ ├── File Type Badge — **badge**
│ │ │ ├── File Size — **label** (muted)
│ │ │ ├── Upload Date/Time — **label** (muted)
│ │ │ └── File Path — **label** (muted, truncated)
│ │ ├── Data Statistics — **card**
│ │ │ ├── Total Rows Count — **badge**
│ │ │ ├── Total Columns Count — **badge**
│ │ │ ├── Data Types Summary — **badge** group
│ │ │ └── Memory Usage — **progress** bar
│ │ └── Table Schema Details — **accordion**
│ │ ├── Column Information List — **accordion** content
│ │ │ ├── Column Name — **label**
│ │ │ ├── Data Type — **badge**
│ │ │ ├── Nullable Status — **badge**
│ │ │ └── Sample Values Preview — **label** (muted)
│ │ └── Schema Actions
│ │ ├── Copy Schema Button — **button** (variant: outline)
│ │ └── View Full Schema Link — **button** (variant: link)
│ └── Multiple Files State
│ ├── File Selector Dropdown — **select**
│ └── Aggregated Statistics — **card**
│ ├── Total Files Count — **badge**
│ ├── Combined Data Size — **badge**
│ └── Total Tables Available — **badge**
└── Application Footer
├── Status Information
│ ├── DuckDB Connection Status — **badge** (with status colors)
│ ├── Session Duration — **label** (muted)
│ └── Memory Usage Indicator — **progress** (mini)
├── Quick Links
│ ├── Documentation Link — **button** (variant: link)
│ ├── GitHub Repository — **button** (variant: link)
│ └── Version Information — **label** (muted)
└── Performance Metrics
├── Last Query Time — **badge**
└── Total Queries Executed — **badge**

## Recommended Shadcn Blocks for Complex Sections

### Primary Layout

- **dashboard-01** block — Main dashboard layout structure
- **sidebar-01** or **sidebar-02** block — Left sidebar for schema explorer

### Secondary Components

- **resizable** — For adjustable panel layouts between upload, editor, and results sections
- **scroll-area** — For scrollable content in tables and sidebars
- **sonner** — For toast notifications during file uploads and query execution

### Key Component Combinations

- **card** + **progress** — File upload progress
- **table** + **pagination** + **scroll-area** — Results display
- **textarea** + Monaco Editor — SQL editor
- **accordion** + **badge** — Schema explorer
- **dropdown-menu** + **button** — Query examples and actions
- **alert** + **badge** — Status messages and indicators
