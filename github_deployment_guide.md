# GitHub Deployment Guide 🚀

Follow these steps to upload your "Smart Finance Tracker" project to GitHub.

## Prerequisites
1.  **Git Installed**: Ensure Git is installed on your Windows machine (`git --version`).
2.  **GitHub Account**: Log in to [github.com](https://github.com).

---

## Step 1: Create a New Repository on GitHub
1.  Go to [GitHub New Repository](https://github.com/new).
2.  **Repository Name**: `smart-finance-tracker` (or your preferred name).
3.  **Visibility**: Public or Private.
4.  **CRITICAL**: Do **NOT** initialize with `README`, `.gitignore`, or `License`. Keep it empty.
5.  Click **Create repository**.
6.  **Copy the Remote URL** (e.g., `https://github.com/your-username/smart-finance-tracker.git`).

---

## Step 2: Initialize Git Locally
Open your terminal in the root directory (`c:\Users\PALANI KATHIRVEL\OneDrive\Desktop\financetracker`) and run:

```powershell
# Initialize git
git init

# Add all project files
git add .

# Create initial commit
git commit -m "Initialize Smart Finance Tracker: Modern UI + Advanced Features"
```

---

## Step 3: Link and Push to GitHub
Replace `YOUR_URL` with the URL you copied in Step 1.

```powershell
# Set the main branch
git branch -M main

# Add the remote repository
git remote add origin YOUR_URL

# Push the code
git push -u origin main
```

---

## Troubleshooting & Tips

### 1. `.gitignore` Check
Ensure your `.gitignore` includes:
- `node_modules/`
- `target/`
- `.env`
- `.DS_Store`

### 2. Large File Errors
If you get errors about file size, ensure you aren't pushing the `backend/target` or `frontend/dist` folders.

### 3. Authentication
Windows might pop up a "GitHub Sign-In" window. Click "Sign in with your browser" to authorize the push.

---

**Success!** Your project is now securely hosted on GitHub. You can now use `git add`, `git commit`, and `git push` for all future updates.
