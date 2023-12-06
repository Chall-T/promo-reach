import { authActions } from "features/users/authSlice";
export const authMiddleware = (store) => (next) => (action) => {
    if (authActions.login.match(action)) {
      localStorage.setItem('isAuthenticated', 'true');
    } else if (authActions.logout.match(action)) {
      localStorage.setItem('isAuthenticated', 'false');
    }
    return next(action);
  };