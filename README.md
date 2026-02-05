# 📋 Casemate - Legal Document Management System

A comprehensive legal document and case management system built with the MERN stack, designed to streamline law firm operations, client management, and document workflows.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.3.1-blue)
![MongoDB](https://img.shields.io/badge/mongodb-6.12.0-green)

## 🌟 Features

### For Attorneys
- **Case Management**: Create, track, and manage legal cases with detailed information
- **Client Management**: Comprehensive client profiles and communication history
- **Document Management**: Upload, organize, and share legal documents securely
- **Task Management**: Assign and track tasks across team members
- **Team Collaboration**: Manage team members and delegate responsibilities
- **Dashboard Analytics**: Overview of cases, clients, and pending tasks

### For Assistants
- **Task Tracking**: View and manage assigned tasks
- **Document Access**: Access shared documents and case files
- **Client Communication**: Manage client interactions and updates
- **Case Support**: Assist with case-related documentation and follow-ups

### General Features
- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🔍 **Search & Filter**: Advanced search capabilities across cases, clients, and documents
- 📊 **Analytics Dashboard**: Real-time insights and statistics
- 🔔 **Notifications**: Stay updated on case developments and deadlines
- 📁 **Document Version Control**: Track document changes and revisions
- 🗓️ **Calendar Integration**: Manage appointments and court dates

## 🏗️ Project Structure

```
casemate-legaldoc-management/
├── client-frontend/          # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Assistant/   # Assistant-specific components
│   │   │   ├── Attorney/    # Attorney-specific components
│   │   │   ├── Auth/        # Authentication components
│   │   │   └── dashboard/   # Dashboard components
│   │   ├── context/         # React Context API
│   │   ├── services/        # API service layer
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js       # Vite configuration
│
└── server-backend/           # Node.js/Express backend
    ├── src/                 # Source code
    │   ├── controllers/     # Route controllers
    │   ├── models/          # MongoDB models
    │   ├── routes/          # API routes
    │   ├── middleware/      # Custom middleware
    │   └── config/          # Configuration files
    ├── google-service-account.json  # Google Cloud credentials
    ├── package.json
    └── .env                 # Environment variables

```

## 🚀 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Google Cloud Storage** - Document storage

## 📦 Installation

### Prerequisites
- Node.js (>= 16.0.0)
- npm or yarn
- MongoDB (local or Atlas)
- Google Cloud account (for document storage)

### 1. Clone the Repository
```bash
git clone https://github.com/sahilsonawanesb/Casemate-LegalDoc-Management.git
cd Casemate-LegalDoc-Management
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd server-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/casemate
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/casemate

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=7d

# Google Cloud Storage
GCS_BUCKET_NAME=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=./google-service-account.json

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png
```

**Google Cloud Setup:**
1. Create a Google Cloud project
2. Enable Cloud Storage API
3. Create a service account and download the JSON key
4. Save the key as `google-service-account.json` in the `server-backend` directory
5. Create a Cloud Storage bucket

```bash
# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd client-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Configure your frontend `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Casemate
```

```bash
# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎯 Usage

### First Time Setup

1. **Register an Account**
   - Navigate to `http://localhost:5173`
   - Click "Register" and create an account
   - Choose role: Attorney or Assistant

2. **Login**
   - Use your credentials to log in
   - You'll be redirected to the appropriate dashboard

### For Attorneys

1. **Add Clients**
   - Go to Client Management
   - Click "Add New Client"
   - Fill in client details

2. **Create Cases**
   - Navigate to Case Management
   - Click "Create Case"
   - Associate with a client and add case details

3. **Upload Documents**
   - Go to Document Management
   - Select a case
   - Upload relevant documents

4. **Assign Tasks**
   - Navigate to Task Management
   - Create tasks and assign to team members
   - Set deadlines and priorities

### For Assistants

1. **View Assigned Tasks**
   - Check "My Tasks" section
   - Update task status as you complete them

2. **Access Documents**
   - Browse documents by case
   - Download or view documents as needed

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/profile      - Get user profile
PUT    /api/auth/profile      - Update user profile
```

### Cases
```
GET    /api/cases             - Get all cases
POST   /api/cases             - Create new case
GET    /api/cases/:id         - Get case by ID
PUT    /api/cases/:id         - Update case
DELETE /api/cases/:id         - Delete case
```

### Clients
```
GET    /api/clients           - Get all clients
POST   /api/clients           - Create new client
GET    /api/clients/:id       - Get client by ID
PUT    /api/clients/:id       - Update client
DELETE /api/clients/:id       - Delete client
```

### Documents
```
GET    /api/documents         - Get all documents
POST   /api/documents         - Upload document
GET    /api/documents/:id     - Get document by ID
DELETE /api/documents/:id     - Delete document
```

### Tasks
```
GET    /api/tasks             - Get all tasks
POST   /api/tasks             - Create new task
GET    /api/tasks/:id         - Get task by ID
PUT    /api/tasks/:id         - Update task
DELETE /api/tasks/:id         - Delete task
```

### Team
```
GET    /api/team              - Get team members
POST   /api/team              - Add team member
DELETE /api/team/:id          - Remove team member
```

## 🧪 Testing

```bash
# Backend tests
cd server-backend
npm test

# Frontend tests
cd client-frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | Yes |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT | Yes |
| JWT_EXPIRE | JWT expiration time | Yes |
| GCS_BUCKET_NAME | Google Cloud Storage bucket | Yes |
| CORS_ORIGIN | Allowed CORS origin | Yes |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |
| VITE_APP_NAME | Application name | No |

## 🚢 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Prepare for deployment**
   ```bash
   cd server-backend
   npm run build  # if you have a build script
   ```

2. **Set environment variables** on your hosting platform

3. **Deploy**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend**
   ```bash
   cd client-frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Or deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

**Important:** Update `VITE_API_URL` to your production backend URL

## 🔒 Security Considerations

- ✅ All passwords are hashed using bcrypt
- ✅ JWT tokens for secure authentication
- ✅ Role-based access control (RBAC)
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Secure file upload with type validation
- ✅ Environment variables for sensitive data
- ⚠️ Enable HTTPS in production
- ⚠️ Implement rate limiting
- ⚠️ Regular security audits

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use ESLint for code linting
- Follow Airbnb JavaScript Style Guide
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 🐛 Known Issues

- [ ] File upload progress indicator
- [ ] Real-time notifications using WebSockets
- [ ] Advanced search filters
- [ ] Export functionality for reports

## 📅 Roadmap

- [ ] Calendar integration for court dates
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with legal research APIs
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PDF generation for documents
- [ ] E-signature integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Sahil Sonawane**
- GitHub: [@sahilsonawanesb](https://github.com/sahilsonawanesb)
- Repository: [Casemate-LegalDoc-Management](https://github.com/sahilsonawanesb/Casemate-LegalDoc-Management)

## 🙏 Acknowledgments

- React Team for the amazing library
- MongoDB for the flexible database
- Google Cloud for storage solutions
- The open-source community

## 📞 Support

For support, email [your-email@example.com](mailto:your-email@example.com) or create an issue in the repository.

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Case Management
![Cases](./screenshots/cases.png)

### Document Management
![Documents](./screenshots/documents.png)

---

**Note:** Remember to replace placeholder values (email, screenshots, etc.) with actual information before publishing.

Made with ❤️ for the legal community