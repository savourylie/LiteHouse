# LiteHouse UX Structure Plan

## Navigation Flow

├── Application Entry
│ ├── Session Initialization
│ │ ├── Generate unique session ID
│ │ └── Initialize DuckDB connection
│ └── Landing on Main Dashboard
│ ├── Empty state display
│ └── Guided onboarding hints
├── File Upload Flow
│ ├── Drag and Drop Interaction
│ │ ├── Visual feedback during drag
│ │ ├── Drop zone highlighting
│ │ └── File validation (CSV, Parquet, JSON, SQLite)
│ ├── File Processing
│ │ ├── Upload progress indicator
│ │ ├── Table registration in DuckDB
│ │ └── Schema extraction
│ └── Post-Upload State
│ ├── File metadata display
│ ├── Schema explorer population
│ └── Ready-to-query indication
├── Query Execution Flow
│ ├── SQL Editor Interaction
│ │ ├── Query composition
│ │ ├── Syntax highlighting
│ │ └── Example query suggestions
│ ├── Query Execution
│ │ ├── SQL validation
│ │ ├── Execution with timeout
│ │ └── Progress indication
│ └── Results Display
│ ├── Paginated table view
│ ├── Column metadata
│ └── Export options
└── Data Export Flow
├── Export Configuration
│ ├── Format selection (CSV)
│ └── Export parameters
├── Export Processing
│ ├── Data preparation
│ └── Download generation
└── Download Completion
└── Success confirmation

## Dashboard Page Structure

├── Application Header
│ ├── Brand Identity
│ │ ├── LiteHouse Logo
│ │ └── Application Title
│ ├── Session Information
│ │ ├── Session ID Display
│ │ └── Connection Status Indicator
│ └── Global Actions
│ ├── Clear Session Button
│ └── Help/Documentation Link
├── Main Content Area
│ ├── Left Sidebar (Schema Explorer)
│ │ ├── Sidebar Header
│ │ │ ├── "Tables" Title
│ │ │ └── Collapse/Expand Toggle
│ │ ├── Tables List
│ │ │ ├── Table Item
│ │ │ │ ├── Table Name
│ │ │ │ ├── Table Type Icon
│ │ │ │ └── Row Count Badge
│ │ │ └── Expandable Column List
│ │ │ ├── Column Name
│ │ │ ├── Data Type
│ │ │ └── Nullable Indicator
│ │ └── Empty State
│ │ ├── "No tables loaded" Message
│ │ └── Upload Instruction Text
│ ├── Central Work Area
│ │ ├── File Upload Zone (Top Section)
│ │ │ ├── Drag and Drop Area
│ │ │ │ ├── Drop Zone Container
│ │ │ │ │ ├── Upload Icon
│ │ │ │ │ ├── Primary Text: "Drag & drop your data files here"
│ │ │ │ │ ├── Secondary Text: "Supports CSV, Parquet, JSON, SQLite"
│ │ │ │ │ └── Browse Files Button
│ │ │ │ ├── Active Drop State
│ │ │ │ │ ├── Highlighted Border
│ │ │ │ │ ├── Background Color Change
│ │ │ │ │ └── "Drop files to upload" Text
│ │ │ │ └── Upload Progress
│ │ │ │ ├── Progress Bar
│ │ │ │ ├── File Name
│ │ │ │ └── Upload Status
│ │ │ └── Uploaded Files Summary
│ │ │ ├── File Cards
│ │ │ │ ├── File Name
│ │ │ │ ├── File Type Icon
│ │ │ │ ├── File Size
│ │ │ │ ├── Upload Timestamp
│ │ │ │ └── Remove File Button
│ │ │ └── Quick Stats
│ │ │ ├── Total Files Count
│ │ │ └── Total Data Size
│ │ ├── SQL Editor Section (Middle Section)
│ │ │ ├── Editor Header
│ │ │ │ ├── "SQL Query" Title
│ │ │ │ ├── Query Actions
│ │ │ │ │ ├── Run Query Button
│ │ │ │ │ ├── Clear Editor Button
│ │ │ │ │ └── Format Query Button
│ │ │ │ └── Query Status
│ │ │ │ ├── Execution Time Display
│ │ │ │ └── Query Validation Status
│ │ │ ├── Monaco Editor Container
│ │ │ │ ├── SQL Syntax Highlighting
│ │ │ │ ├── Auto-completion
│ │ │ │ ├── Error Highlighting
│ │ │ │ └── Line Numbers
│ │ │ ├── Query Examples Panel
│ │ │ │ ├── "Example Queries" Dropdown
│ │ │ │ └── Predefined Query Templates
│ │ │ │ ├── "SELECT _ FROM table_name"
│ │ │ │ ├── "DESCRIBE table_name"
│ │ │ │ └── "SELECT COUNT(_) FROM table_name"
│ │ │ └── Query Execution Feedback
│ │ │ ├── Success State
│ │ │ │ ├── Green Checkmark
│ │ │ │ └── "Query executed successfully"
│ │ │ ├── Error State
│ │ │ │ ├── Red Error Icon
│ │ │ │ └── Error Message Display
│ │ │ └── Loading State
│ │ │ ├── Spinner Animation
│ │ │ └── "Executing query..." Text
│ │ └── Results Display Section (Bottom Section)
│ │ ├── Results Header
│ │ │ ├── "Query Results" Title
│ │ │ ├── Results Summary
│ │ │ │ ├── Row Count Display
│ │ │ │ ├── Column Count Display
│ │ │ │ └── Execution Time
│ │ │ └── Results Actions
│ │ │ ├── Export to CSV Button
│ │ │ ├── Refresh Results Button
│ │ │ └── Clear Results Button
│ │ ├── Data Table Container
│ │ │ ├── Table Header Row
│ │ │ │ ├── Column Names
│ │ │ │ ├── Data Type Indicators
│ │ │ │ └── Sort Controls
│ │ │ ├── Table Body
│ │ │ │ ├── Data Rows
│ │ │ │ ├── Cell Value Display
│ │ │ │ └── Null Value Indicators
│ │ │ └── Table Footer
│ │ │ ├── Pagination Controls
│ │ │ │ ├── Previous Page Button
│ │ │ │ ├── Page Number Display
│ │ │ │ ├── Next Page Button
│ │ │ │ └── Rows Per Page Selector
│ │ │ └── Results Navigation Info
│ │ │ ├── "Showing X-Y of Z rows"
│ │ │ └── Jump to Page Input
│ │ └── Empty Results State
│ │ ├── "No results to display" Message
│ │ └── Query Suggestion Text
│ └── Right Sidebar (File Metadata Panel)
│ ├── Metadata Header
│ │ ├── "File Details" Title
│ │ └── Minimize/Expand Toggle
│ ├── Active File Information
│ │ ├── File Properties
│ │ │ ├── File Name Display
│ │ │ ├── File Type Badge
│ │ │ ├── File Size
│ │ │ ├── Upload Date/Time
│ │ │ └── File Path
│ │ ├── Data Statistics
│ │ │ ├── Total Rows Count
│ │ │ ├── Total Columns Count
│ │ │ ├── Data Types Summary
│ │ │ └── Memory Usage
│ │ └── Table Schema Details
│ │ ├── Column Information List
│ │ │ ├── Column Name
│ │ │ ├── Data Type
│ │ │ ├── Nullable Status
│ │ │ └── Sample Values Preview
│ │ └── Schema Actions
│ │ ├── Copy Schema Button
│ │ └── View Full Schema Link
│ └── Multiple Files State
│ ├── File Selector Dropdown
│ └── Aggregated Statistics
│ ├── Total Files Count
│ ├── Combined Data Size
│ └── Total Tables Available
└── Application Footer
├── Status Information
│ ├── DuckDB Connection Status
│ ├── Session Duration
│ └── Memory Usage Indicator
├── Quick Links
│ ├── Documentation Link
│ ├── GitHub Repository
│ └── Version Information
└── Performance Metrics
├── Last Query Time
└── Total Queries Executed
