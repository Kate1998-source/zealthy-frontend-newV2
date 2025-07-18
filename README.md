﻿# Zealthy Onboarding Frontend

React-based custom onboarding flow for Zealthy Full Stack Engineering Exercise.

## 🚀 Live Demo

**Frontend URL:** [Will be updated after Vercel deployment]  
**Backend Repository:** [Will be updated with backend repo URL]

## ✨ Features Implemented

### ✅ Section 1 - User Onboarding
- **3-Step Wizard**: Email/Password → About Me/Address → Birthdate
- **Email Validation**: Real-time check against database
- **Progress Persistence**: Data saved on page refresh
- **Dynamic Components**: Configurable via admin dashboard

### ✅ Section 2 - Admin Interface  
- **Component Management**: Configure Steps 2 & 3 components
- **Drag & Drop Interface**: Intuitive admin controls
- **Real-time Configuration**: Changes reflect immediately

### ✅ Section 3 - Data Table
- **Live User Data**: Real-time table at `/data`
- **Auto-refresh**: Updates every 10 seconds
- **Complete User Info**: All fields displayed

## 🛠 Tech Stack

- **Frontend**: React 18, React Router, React DnD
- **Styling**: Modern inline styles with responsive design
- **API**: Axios with production-ready interceptors
- **Deployment**: Vercel with environment variables
- **Persistence**: localStorage for progress saving

## 🏗 Project Structure

```
src/
├── components/
│   ├── form-components/
│   │   ├── AboutMeComponent.js    # Step 2 component
│   │   ├── AddressComponent.js    # Step 2 component  
│   │   └── BirthdateComponent.js  # Step 3 component
│   ├── AdminDashboard.js          # Admin configuration
│   └── DataTable.js               # User data display
├── api.js                         # Production API client
├── App.js                         # Main application
├── App.css                        # Styles
└── index.js                       # Entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm 8+

### Local Development
```bash
# Clone repository
git clone [your-repository-url]
cd zealthy-onboarding-frontend

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env.local

# Start development server
npm start

# Open http://localhost:3000
```

## 🔧 Environment Variables

```env
# Development
REACT_APP_API_URL=http://localhost:8080/api

# Production (set in Vercel)
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

## 📋 User Flow

1. **Step 1**: Email & password with database validation
2. **Step 2**: About Me + Address components (configurable)
3. **Step 3**: Birthdate + review before completion
4. **Completion**: Data saved to database, flow resets

## 🎛 Admin Features

- Access at `/admin`
- Drag components between Available and Steps 2/3
- Real-time configuration updates
- Component types: About Me, Address, Birthdate

## 🔗 API Integration

**Endpoints Used:**
- `POST /api/users/register-complete` - Complete registration
- `GET /api/users/email/{email}` - Email availability check
- `GET /api/users` - Fetch all users for data table
- `GET/PUT /api/admin/config` - Admin configuration

## 🚀 Production Deployment

### Vercel Deployment
1. Connect GitHub repo to Vercel
2. Set environment variable: `REACT_APP_API_URL`
3. Auto-deploy on push to main branch

### Manual Build
```bash
npm run build
# Deploy 'build' folder to hosting provider
```

## 🐛 Troubleshooting

**API Connection Issues:**
- Verify `REACT_APP_API_URL` is set correctly
- Check backend CORS configuration
- Ensure backend is running and accessible

**Components Not Loading:**
- Check admin configuration endpoint
- Verify default components are rendering
- Check browser console for errors

**Progress Not Saving:**
- Check localStorage in browser dev tools
- Verify data format in localStorage
- Clear localStorage if corrupted

## 📊 Production Features

- **Error Handling**: Comprehensive error boundaries
- **Loading States**: User feedback during operations
- **Auto-refresh**: Data table updates automatically
- **Responsive**: Works on desktop and mobile
- **Debug Mode**: Development logging enabled
- **Fallback Config**: Default components if admin fails



---
*Zealthy Full Stack Engineering Exercise - React Frontend*
