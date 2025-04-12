# Intelligent Virtual Career Advisor

An AI-powered platform designed to help individuals make informed, strategic career decisions by analyzing their skills, the job market, and networking potential.

## 🚀 Features

- Interactive skill assessment
- Job market analysis
- Career path recommendations
- Resume & interview coaching
- Network insights integration

## 🛠️ Tech Stack

### Frontend
- React.js
- Material-UI
- Framer Motion
- Chart.js
- Axios

### Backend
- FastAPI
- PostgreSQL
- OpenAI API
- scikit-learn
- SQLAlchemy

## 📦 Installation

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## 🌐 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📁 Project Structure

```
career-advisor/
├── frontend/           # React frontend application
├── backend/            # FastAPI backend application
│   ├── app/           # Main application code
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── services/      # Business logic
└── data/              # Data files and resources
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/career_advisor
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License. 