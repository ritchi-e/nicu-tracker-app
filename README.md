# NICU Tracker Application

A comprehensive tracking system for Neonatal Intensive Care Units (NICU) that allows multiple users to access and update patient data in real-time.

## System Architecture

The application follows a client-server architecture:
- **Backend Server**: Django REST API server that handles data storage and business logic
- **Frontend Clients**: React-based web applications that can run on multiple machines
- **Database**: PostgreSQL database (can be configured to use SQLite for development)

## Prerequisites

### For Backend Server:
- Python 3.8 or higher
- pip (Python package manager)
- PostgreSQL (for production) or SQLite (for development)
- Virtual environment (recommended)

### For Frontend Clients:
- Node.js 16 or higher
- npm or yarn package manager
- Modern web browser

## Backend Server Setup

1. Clone the repository:
```bash
git clone https://github.com/ritchi-e/nicu-tracker-app.git
cd nicu-tracker-app/nicu_backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:


4. Configure the database:
   - For development (SQLite):
     - No additional configuration needed
   - For production (PostgreSQL):
     - Create a PostgreSQL database
     - Update `nicu_server/settings.py` with database credentials

5. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser (admin):
```bash
python manage.py createsuperuser
```

7. Start the backend server:
```bash
python manage.py runserver 0.0.0.0:8000
```

The backend server will be accessible at `http://<server-ip>:8000`

## Frontend Client Setup

1. Navigate to the frontend directory:
```bash
cd ../local-data-canvas
```

2. Install dependencies:
```bash
npm install
```

3. Configure the backend server URL:
   - Create a `.env` file in the frontend directory
   - Add the following line (replace with your server's IP):
   ```
   VITE_API_URL=http://<server-ip>:8000
   ```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will be accessible at `http://localhost:5173`

## Running in Production

### Backend Server (Production)

1. Install production dependencies:
```bash
pip install gunicorn
```

2. Configure environment variables:
   - Create a `.env` file in the backend directory
   - Add necessary environment variables (SECRET_KEY, DATABASE_URL, etc.)

3. Run with Gunicorn:
```bash
gunicorn nicu_server.wsgi:application --bind 0.0.0.0:8000
```

### Frontend Client (Production)

1. Build the frontend:
```bash
npm run build
```

2. Serve the built files using a web server (e.g., Nginx, Apache)

## Security Considerations

1. **Backend Server**:
   - Always run the backend server behind a reverse proxy (Nginx/Apache)
   - Enable HTTPS using SSL certificates
   - Configure CORS properly in `nicu_server/settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://<client-ip>:5173",  # Development
       "https://your-domain.com",  # Production
   ]
   ```

2. **Frontend Clients**:
   - Use environment variables for sensitive configuration
   - Implement proper authentication
   - Use HTTPS in production

## Data Consistency

The application ensures data consistency through:
- RESTful API endpoints with proper validation
- Database transactions
- Real-time updates (optional, can be implemented using WebSockets)
- Proper error handling and conflict resolution

## Troubleshooting

1. **Backend Connection Issues**:
   - Check if the backend server is running
   - Verify the server IP and port in frontend configuration
   - Check firewall settings
   - Ensure CORS is properly configured

2. **Frontend Issues**:
   - Clear browser cache
   - Check browser console for errors
   - Verify environment variables
   - Ensure all dependencies are installed

## Development Guidelines

1. **Code Style**:
   - Backend: Follow PEP 8 guidelines
   - Frontend: Use ESLint and Prettier
   - Use meaningful commit messages

2. **Version Control**:
   - Create feature branches
   - Use pull requests for code review
   - Keep the main branch stable

## License

[Your License Here]

## Support

For support, please [contact details or issue tracker information] 