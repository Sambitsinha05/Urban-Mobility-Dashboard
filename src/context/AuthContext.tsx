import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, CityPreset } from '../types';
import { DEMO_USERS, CITY_PRESETS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => boolean;
  loginAsDemo: (role: UserRole) => void;
  register: (name: string, email: string, role: UserRole, department: string, organization: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';

  // Global Dashboard state
  currentCity: CityPreset;
  setCity: (cityId: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  timeWindow: 'live' | 'morning_peak' | 'evening_peak' | 'past_24h' | 'past_7d';
  setTimeWindow: (time: 'live' | 'morning_peak' | 'evening_peak' | 'past_24h' | 'past_7d') => void;
  isLiveSimulating: boolean;
  toggleLiveSimulation: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeGetStorage = (key: string): string | null => {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null;
  } catch (e) {
    return null;
  }
};

const safeSetStorage = (key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    // ignore
  }
};

const safeRemoveStorage = (key: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    // ignore
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state safely
  const [user, setUser] = useState<User | null>(() => {
    const saved = safeGetStorage('urban_mobility_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return DEMO_USERS[0];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [currentCity, setCurrentCity] = useState<CityPreset>(CITY_PRESETS[0]);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (safeGetStorage('urban_mobility_theme') as 'dark' | 'light') || 'dark';
  });
  const [timeWindow, setTimeWindow] = useState<'live' | 'morning_peak' | 'evening_peak' | 'past_24h' | 'past_7d'>('live');
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);

  useEffect(() => {
    try {
      if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      } else {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      }
      safeSetStorage('urban_mobility_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const saveUserSession = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      safeSetStorage('urban_mobility_user', JSON.stringify(newUser));
    } else {
      safeRemoveStorage('urban_mobility_user');
    }
  };

  const login = (email: string, role?: UserRole): boolean => {
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      saveUserSession(found);
      setIsAuthModalOpen(false);
      return true;
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: role || 'planner',
      department: 'Urban Transport Division',
      organization: 'City Transport Bureau',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      savedScenariosCount: 0
    };
    saveUserSession(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginAsDemo = (role: UserRole) => {
    const demo = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    saveUserSession(demo);
    setIsAuthModalOpen(false);
  };

  const register = (name: string, email: string, role: UserRole, department: string, organization: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      department: department || 'Transport Planning',
      organization: organization || 'City Municipal Department',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      savedScenariosCount: 0
    };
    saveUserSession(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    saveUserSession(null);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const setCity = (cityId: string) => {
    const found = CITY_PRESETS.find(c => c.id === cityId);
    if (found) setCurrentCity(found);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleLiveSimulation = () => {
    setIsLiveSimulating(prev => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsDemo,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        currentCity,
        setCity,
        theme,
        toggleTheme,
        timeWindow,
        setTimeWindow,
        isLiveSimulating,
        toggleLiveSimulation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
