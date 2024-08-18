import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { onValue, ref, set } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { auth, database } from '../auth/firebaseAuthSDK';

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userKeys, setUserKeys] = useState(null);

  async function signup(email, password) {
    const response = await auth.createUserWithEmailAndPassword(email, password);
    console.log('response', response);
    const userId = response.user.uid;
    await set(ref(database, 'users/' + userId), {
      email: email,
    });
    console.log('user created');
    const token = await response.user.getIdToken();
    localStorage.setItem('token', token);
    console.log({ token });
    return;
  }

  async function login(email, password) {
    const auth = getAuth();
    const response = await signInWithEmailAndPassword(auth, email, password);
    const userId = response.user.uid;
    const token = await response.user.getIdToken(); // Get the JWT token
    await fetchKeys(userId);
    localStorage.setItem('token', token); // Optionally store the token in localStorage
    return response.user;
  }

  async function fetchKeys(userId) {
    const dbRef = ref(database, 'users/' + userId);
    return new Promise((resolve, reject) => {
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        setUserKeys(data);
        resolve(data);
      });
    });
    return;
  }

  function logout() {
    setUserKeys(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      fetchKeys(user?.uid);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userKeys,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
