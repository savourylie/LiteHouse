# LiteHouse Frontend

A modern, responsive SQL workbench interface built with Next.js and Shadcn UI components.

## Features Implemented

### 🎨 UI Components

- **Dashboard Layout**: Resizable panels with header, sidebars, and main content area
- **File Upload Zone**: Drag-and-drop interface supporting CSV, Parquet, JSON, SQLite files
- **SQL Editor**: Monaco Editor integration with syntax highlighting and query examples
- **Results Display**: Paginated table with sorting, export, and search functionality
- **Schema Explorer**: Collapsible sidebar showing table schemas and column details
- **Metadata Panel**: File properties, statistics, and schema information

### 🔧 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Shadcn UI components
- **Editor**: Monaco Editor for SQL syntax highlighting
- **File Upload**: React Dropzone for drag-and-drop functionality
- **Icons**: Lucide React
- **Notifications**: Sonner for toast messages
- **State Management**: React hooks (useState)

### 📱 Responsive Design

- Resizable panels for optimal workspace utilization
- Mobile-responsive layout
- Collapsible sidebars for smaller screens
- Adaptive component sizing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Component Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── dashboard.tsx       # Main dashboard container
│   └── dashboard/          # Dashboard-specific components
│       ├── header.tsx      # Application header
│       ├── schema-explorer.tsx  # Left sidebar
│       ├── file-upload-zone.tsx # File upload area
│       ├── sql-editor.tsx  # SQL editor with Monaco
│       ├── results-display.tsx  # Results table
│       ├── metadata-panel.tsx   # Right sidebar
│       └── footer.tsx      # Application footer
├── hooks/
│   └── use-mobile.ts       # Mobile detection hook
└── lib/
    └── utils.ts            # Utility functions
```

## Key Features

### File Upload

- Drag-and-drop interface with visual feedback
- Support for multiple file formats (CSV, Parquet, JSON, SQLite)
- Progress indicators and file validation
- File metadata display with removal options

### SQL Editor

- Monaco Editor with SQL syntax highlighting
- Auto-completion and error highlighting
- Query examples dropdown
- Query formatting and execution status
- Execution time tracking

### Results Display

- Paginated table with customizable page sizes
- Column sorting and type indicators
- CSV export functionality
- Jump-to-page navigation
- Null value indicators

### Schema Explorer

- Hierarchical table and column display
- Expandable column details with data types
- Row count badges and file type icons
- Empty state with upload instructions

### Metadata Panel

- File properties and statistics
- Memory usage indicators
- Column schema with sample values
- Multi-file support with file selector

## Mock Data

The application currently uses mock data for demonstration purposes:

- Simulated file upload progress
- Mock query execution with random delays
- Sample table schemas and data
- Placeholder statistics and metadata

## Future Enhancements

- Backend API integration
- Real-time query execution
- Advanced data visualization
- Query history and saved queries
- Collaborative features
- Performance optimizations

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Adding New Components

1. Create component in appropriate directory
2. Follow Shadcn UI patterns and conventions
3. Add proper TypeScript types
4. Include responsive design considerations
5. Add to main dashboard if needed

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Ensure responsive design compatibility
4. Add proper error handling
5. Include appropriate loading states
