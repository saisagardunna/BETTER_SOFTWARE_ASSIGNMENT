# Backend Server Start Instructions

## Quick Fix for Login Issue

The login is failing because the backend server isn't running (or crashed when loading the chatbot module).

### Steps to Fix:

1. **Stop any existing backend processes** (if running):
   ```powershell
   # Find Python processes
   Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

2. **Start the backend server**:
   ```powershell
   # Option 1: Using pipenv (recommended)
   pipenv run python run_server.py
   
   # Option 2: If using virtual env directly
   python run_server.py
   ```

3. **Or use the npm script** (if available):
   ```powershell
   npm run serve:backend
   ```

### What to Look For:

The server should start and show:
```
* Running on http://127.0.0.1:5000
* Running on http://localhost:5000
```

If you see any errors related to the chatbot module, they should now be fixed!

### Environment Variables

Make sure you have created a `.env` file in `src/apps/backend/` with your MongoDB connection string:
```bash
# Copy the example file and add your credentials
cp src/apps/backend/.env.example src/apps/backend/.env

# Then edit .env and add your actual credentials:
# MONGODB_URI="your_mongodb_connection_string"
# GROQ_API_KEY="your_groq_api_key"
```

**Note:** The `.env` file is gitignored to keep your credentials secure. Never commit credentials to the repository!

### Test the Backend

Once running, test it's working:
```powershell
# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:5000/api" -UseBasicParsing
```

## What Was Fixed

1. ✅ Removed problematic bson import try/except
2. ✅ Used standard `from bson.objectid import ObjectId` (comes with pymongo)
3. ✅ Chatbot module should now import cleanly

The `bson` module is part of the `pymongo` package which is already installed in your Pipfile!
