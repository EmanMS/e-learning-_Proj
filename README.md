# E-Learning Platform

A full-stack e-learning platform built with Django (backend) and React (frontend), featuring course management, PayPal payment integration, quizzes, assignments, and analytics.

## Features

- 👤 **User Authentication** - JWT-based auth with role-based access (Student/Instructor)
- 📚 **Course Management** - Complete CRUD for courses, modules, and content
- 💳 **PayPal Integration** - Secure payment processing for paid courses
- 📝 **Assessments** - Quizzes and assignments with grading system
- 💬 **Communication** - Discussion forums and notifications
- 📊 **Analytics** - Instructor dashboard with course performance metrics
- 📱 **Responsive Design** - Mobile-friendly interface

## Tech Stack

### Backend
- Django 5.1.3
- Django REST Framework
- PostgreSQL / SQLite
- PayPal REST SDK
- JWT Authentication

### Frontend
- React 18
- React Router
- Axios
- Vite
- Tailwind CSS
- Lucide Icons
- PayPal JavaScript SDK

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

### Frontend (config.js)
```javascript
export const PAYPAL_CLIENT_ID = "your-paypal-client-id";
```

## Deployment

- **Frontend**: Vercel (see `vercel.json`)
- **Backend**: Railway / Heroku
- **Database**: PostgreSQL

See `deployment_guide.md` for detailed instructions.

## License

MIT

## Author

Eman Salem
