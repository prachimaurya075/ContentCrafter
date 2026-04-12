# Auth Pages Update Task

## Plan Steps:
- [x] Replace `frontend/src/module/pages/Login.jsx` with improved version (Google One Tap, password toggle).
- [x] Replace `frontend/src/module/pages/Signup.jsx` with improved version (dual password toggles, UI polish).
- [ ] Test updates:
  - `cd frontend && npm run dev`
  - Test `/login`: email/password, Google sign-in (check VITE_GOOGLE_CLIENT_ID).
  - Test `/signup`: form validation, password toggles, submission.
  - Verify navigation to `/user-dashboard`.
- [ ] Check Firebase console: Google Client ID authorized.
- [ ] Pre-existing issues: Fix chat-input.jsx syntax if needed.

Both Login and Signup now have matching polished UI/UX.
