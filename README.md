# Korean With Us - Admin Dashboard

A comprehensive, frontend-only admin dashboard for managing a Korean language school website. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🎯 User Management
- Create, edit, and delete users (students, teachers, admin staff)
- Manage roles and permissions (Admin, Editor, Viewer, Teacher)
- View user activity logs (login history, active/suspended users)
- Display user details and enrollment history
- Search and filter users

### 📚 Course Management
- Create and manage courses (Beginner, Intermediate, Speaking, TOPIK)
- Update course details (descriptions, fees, schedules)
- Upload learning resources or media
- Manage class timetables and batch schedules
- Course level categorization

### ✅ Enrollment Management
- Approve or reject new enrollment requests
- Track student progress and enrollment status
- Filter enrollments by date, course, and status
- Export enrollment lists (CSV/PDF)
- Progress tracking with visual indicators

### 📊 Analytics & Dashboard Metrics
- Total users, total enrollments, and enrollment trends
- Daily, weekly, and monthly enrollment charts
- Most popular course identification
- Conversion rates (visitors → sign-ups)
- Downloadable reports
- Interactive charts using Recharts

### 📧 Contact / Inquiry Management
- Handle contact form messages and enrollment inquiries
- Mark inquiries as "pending", "replied", or "closed"
- AI-generated reply suggestions
- Reply management interface

### 📅 Timetable Management
- Manage daily timetables with course level, start/end times
- Teacher selection and room assignment
- Occupancy tracking with visual indicators
- Day-by-day schedule view
- Room capacity management

### 🖼️ Content Management
- Display vibrant photos and videos of classes, cultural events, and student achievements
- Upload and manage media content
- Categorize content by type (class, cultural_event, achievement)
- Filter by type and category

### ⚙️ Website Settings
- Edit homepage text, contact info, images
- Manage teacher information
- Update pricing and schedules
- Control notifications and maintenance mode
- Social media links management

### 🔒 Security & Access Control
- Manage admin accounts and reset passwords
- Track activity logs of admin actions (who changed what)
- Password policy settings
- Session management
- IP whitelist configuration

### 🤖 AI Assistant (Advanced Feature)
- Integrated AI assistant in the dashboard
- Chat interface for getting help and insights
- Automated email suggestions for inactive students
- Report generation assistance
- Data insights and recommendations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Utilities**: clsx

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd admin-korean-with-us
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will automatically redirect to `/dashboard`.

## Project Structure

```
admin-korean-with-us/
├── app/
│   ├── dashboard/          # Main dashboard page
│   ├── users/              # User management
│   ├── courses/            # Course management
│   ├── enrollments/       # Enrollment management
│   ├── analytics/          # Analytics and reports
│   ├── inquiries/          # Contact/inquiry management
│   ├── timetable/          # Timetable management
│   ├── content/            # Content management
│   ├── settings/           # Website settings
│   ├── security/           # Security and access control
│   ├── ai-assistant/       # AI assistant
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects to dashboard)
├── components/
│   └── layout/             # Layout components (Sidebar, Header, MainLayout)
├── lib/
│   ├── mockData.ts         # Mock data for demonstration
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts            # TypeScript type definitions
└── public/                  # Static assets
```

## Features Overview

### Dashboard
- Overview of key metrics
- Enrollment trends (daily, weekly, monthly)
- Most popular course
- Quick action buttons
- Conversion rate tracking

### User Management
- Full CRUD operations for users
- Role-based access control
- Activity log tracking
- User status management (active/suspended)
- Search and filter functionality

### Course Management
- Course creation and editing
- Resource upload interface
- Schedule management
- Teacher assignment
- Course level categorization

### Enrollment Management
- Approval/rejection workflow
- Progress tracking
- Status filtering
- Export functionality (CSV/PDF)
- Detailed enrollment information

### Analytics
- Interactive charts and graphs
- Trend analysis
- Course distribution
- Downloadable reports
- Key performance indicators

## Mock Data

The application uses mock data stored in `lib/mockData.ts` for demonstration purposes. In a production environment, you would replace this with actual API calls to your backend.

## Customization

### Adding New Features
1. Create a new page in the `app/` directory
2. Add the route to the sidebar navigation in `components/layout/Sidebar.tsx`
3. Update types in `types/index.ts` if needed
4. Add mock data in `lib/mockData.ts` if required

### Styling
The project uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.ts`
- Global styles in `app/globals.css`
- Component-specific styles using Tailwind classes

## Future Enhancements

- Backend API integration
- Real authentication system
- Database integration
- File upload functionality
- Email notifications
- Multi-language support for admin panel
- Advanced AI features
- Real-time updates
- Advanced reporting

## License

This project is created for demonstration purposes.

## Support

For questions or issues, please refer to the project documentation or contact the development team.
