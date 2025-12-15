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

### Environment Variable

Make sure your MongoDB connection is set:
```powershell
$env:MONGODB_URI='mongodb+srv://saidunna450:Saisagar%40123@cluster0.ww2edzo.mongodb.net/?retryWrites=true&w=majority'
```

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
