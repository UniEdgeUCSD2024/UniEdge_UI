import React, { useContext, useEffect, useState } from 'react'
import { auth, database } from '../auth/firebaseAuthSDK'
import { set, ref, onValue } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [userKeys, setUserKeys] = useState(null);

  async function signup(email, username, password, role) {
    const response = await auth.createUserWithEmailAndPassword(email, password);
    const userId = response.user.uid;
      set(ref(database, 'users/'+userId), {
        email: email,
        role: role,
        username: username
      })  
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
    const dbRef = ref(database, 'users/'+userId);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setUserKeys(data);
    });
    return;
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      fetchKeys(user?.uid);
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userKeys,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}