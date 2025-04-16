# MERN Todo App - Frontend

A modern, responsive todo application frontend built with React and Tailwind CSS. This application provides a beautiful user interface for task management with advanced features like analytics, calendar view, and AI assistance.

## Features

- 🎨 Beautiful responsive UI with light/dark mode
- 📊 Analytics dashboard with task statistics and charts
- 📅 Calendar view for scheduled tasks
- 📝 Kanban board for visual task management
- 🔍 Advanced filtering and search capabilities
- 🏷️ Task categorization with tags
- 🔔 Browser notifications
- 🔄 Recurring tasks support
- 📱 Mobile-friendly design
- 🎯 Subtasks for breaking down complex tasks
- 📋 Task dependencies
- 🧠 AI-powered task creation assistant
- 📤 Export tasks to PDF and JSON

## Tech Stack

- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive charts for analytics
- **React DnD** - Drag and drop for Kanban board
- **React Hot Toast** - Notification system
- **Axios** - HTTP client
- **Context API** - State management
- **jsPDF** - PDF generation

## Prerequisites

- Node.js (v14 or higher)
- Backend API running (refer to backend README)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mern-todo/frontend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file in the root directory with your backend URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   bun dev
   ```

5. Access the application at `http://localhost:5173`

## Main Components

### TodoModal

The task creation and editing modal with fields for:
- Basic task information (title, description)
- Status and priority
- Due date and category
- Tags and dependencies
- Subtasks
- Scheduling options
- Natural language input

### TodoList

Displays tasks in a table view with:
- Sortable columns
- Status toggle
- Priority indicator
- Due date display
- Actions menu

### KanbanBoard

Visual task management with draggable cards organized by status.

### Analytics Dashboard

Provides visual insights with:
- Task completion rate
- Tasks by priority
- Tasks over time
- Task trends

### Calendar View

Calendar-based task visualization showing:
- Tasks due on specific dates
- Scheduled tasks
- Task details on click

## Features in Detail

### Task Management

- Create, edit, and delete tasks
- Mark tasks as complete or in progress
- Set priorities (low, medium, high)
- Categorize tasks (work, personal, etc.)
- Add tags for additional organization
- Set due dates and reminders
- Break tasks into subtasks
- Set task dependencies
- Recurring tasks with various patterns

### User Experience

- Dark/light mode toggle
- Mobile-responsive layout
- Toast notifications
- Browser notifications
- Celebration animations on task completion
- Keyboard shortcuts

### Data Features

- Search and advanced filtering
- Sort by multiple columns
- Export tasks to PDF
- Export/import tasks as JSON
- View task history

### AI Assistant

- Natural language task creation
- AI subtask suggestions
- Smart scheduling recommendations

## State Management

The application uses React Context for state management:
- AuthContext - Authentication state
- TodoContext - Task data and operations
- ThemeContext - UI theme preferences
- NotificationContext - Notification management

## Building for Production

To create a production build:

```bash
bun build
```

The build artifacts will be located in the `dist/` directory.

## Testing

```bash
bun test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.