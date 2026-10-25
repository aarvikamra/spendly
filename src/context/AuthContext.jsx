import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  SESSION_KEY, USERS_KEY, hashPassword, readJSON, readString, writeJSON,
} from "../utils/helpers.js";

// Context API: any component can read the signed-in user without prop drilling
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const email = readString(SESSION_KEY, "");
    const users = readJSON(USERS_KEY, {});
    return email && users[email] ? { email, name: users[email].name } : null;
  });

  const begin = useCallback((next) => {
    try {
      localStorage.setItem(SESSION_KEY, next.email);
    } catch {
      /* ignore */
    }
    setUser(next);
    return { ok: true, user: next };
  }, []);

  const register = useCallback(
    async ({ name, email, password }) => {
      const key = email.trim().toLowerCase();
      const users = readJSON(USERS_KEY, {});
      if (users[key]) {
        return { ok: false, error: "An account with this email already exists. Sign in instead." };
      }
      const salt = crypto.randomUUID();
      const hash = await hashPassword(password, salt);
      writeJSON(USERS_KEY, { ...users, [key]: { name: name.trim(), salt, hash } });
      return begin({ email: key, name: name.trim() });
    },
    [begin]
  );

  const login = useCallback(
    async ({ email, password }) => {
      const key = email.trim().toLowerCase();
      const account = readJSON(USERS_KEY, {})[key];
      const hash = account ? await hashPassword(password, account.salt) : null;
      if (!account || hash !== account.hash) {
        return { ok: false, error: "Incorrect email or password." };
      }
      return begin({ email: key, name: account.name });
    },
    [begin]
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
