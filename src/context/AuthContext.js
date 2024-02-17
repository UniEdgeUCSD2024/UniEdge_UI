import React, { useContext, useEffect, useState } from 'react'
import { auth, database } from '../auth/firebaseAuthSDK'
import { set, ref, onValue } from 'firebase/database';

export const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [userKeys, setUserKeys] = useState(null);

  async function signup(email, password) {
    await auth.createUserWithEmailAndPassword(email, password);    
    return;
  }

  async function login(email, password) {
    await auth.signInWithEmailAndPassword(email, password);
    return;
  }

  // async function fetchKeys(userId) {
  //   const dbRef = ref(database, 'users/'+userId);
  //   onValue(dbRef, (snapshot) => {
  //     const data = snapshot.val();
  //     setUserKeys(data);
  //   });
  //   return;
  // }

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