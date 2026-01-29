import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  login: (email, password) => {
    const userData = { email };
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });
    set({ user: userData, isAuthenticated: true });
  },

  logout: () => {
    Cookies.remove('user');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const userData = Cookies.get('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        set({ user: parsed, isAuthenticated: true, isInitialized: true });
      } catch (error) {
        Cookies.remove('user');
        set({ user: null, isAuthenticated: false, isInitialized: true });
      }
    } else {
      set({ user: null, isAuthenticated: false, isInitialized: true });
    }
  }
}));

export default useAuthStore;
