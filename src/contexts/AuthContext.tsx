import { createContext, useState, useContext, useEffect } from 'react';
import {
  User, updatePassword,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getIsAdmin } from '../utils/firestore';
import { useDispatch } from 'react-redux';

interface AuthContextProps {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setNewPassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAdmin: false,
  login: () => Promise.resolve(undefined),
  logout: () => Promise.resolve(undefined),
  setNewPassword: () => Promise.resolve(undefined),
});

//@ts-ignore
export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout(): Promise<void> {
    await signOut(auth);
    dispatch({ type: 'RESET' });
  }

  async function setNewPassword(currentPassword: string, newPassword: string): Promise<void> {
    if (user && user.email) {
      const credentials = await signInWithEmailAndPassword(auth, user.email, currentPassword);
      await updatePassword(credentials.user, newPassword);
    }
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      async function checkIfAdmin(): Promise<boolean> {
        return user ? await getIsAdmin(user.uid) :  false;
      }

      setUser(user);
      setIsAdmin(await checkIfAdmin());
      setLoading(false);
    });
    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, setNewPassword }}>
      { !loading && children }
    </AuthContext.Provider>
  );
};