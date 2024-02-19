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

  async function signup(email, userName, password, selectedRole) {
    const response = await auth.createUserWithEmailAndPassword(email, password);
    const userId = response.user.uid;
      set(ref(database, 'users/'+userId), {
        email: email,
        selectedRole: selectedRole,
        userName: userName
      })  
    return;
  }

  async function login(email, password) {
    const response = await auth.signInWithEmailAndPassword(email, password);
    console.log(response)
    const userId = response.user.uid;
    await fetchKeys(userId);
    return;
  }

  async function fetchKeys(userId) {
    const dbRef = ref(database, 'users/'+userId);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setUserKeys(data);
      console.log(data)
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