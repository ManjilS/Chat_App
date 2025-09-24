# Chat App

A real-time chat application built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (signup/login/logout)
- Real-time messaging
- Profile picture upload
- Email notifications
- Responsive design with Tailwind CSS

## Tech Stack

**Frontend:**
- React 19
- Tailwind CSS + DaisyUI
- Zustand (state management)
- React Router DOM
- Axios
- Lucide React (icons)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Cloudinary (image upload)
- Resend (email service)
- bcryptjs (password hashing)

## Prerequisites

- Node.js >= 22.12.0
- MongoDB database
- Cloudinary account
- Resend account

## Environment Variables

Create `.env` file in `/backend` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=production
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email@domain.com
EMAIL_FROM_NAME=Your Name
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ManjilS/Chat.git
cd chat_app
```

2. Install dependencies:
```bash
npm run build
```

3. Start the application:
```bash
npm start
```

## Development

**Backend development:**
```bash
cd backend
npm run dev
```

**Frontend development:**
```bash
cd frontend
npm run dev
```

## Deployment

The app is configured for deployment on platforms like Sevalla, Vercel, or Heroku.

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```



## License

ISC