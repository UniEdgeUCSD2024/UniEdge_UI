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
    try {
      const response =  await auth.createUserWithEmailAndPassword(email, password);
      console.log('response', response);
      const userId = response.user.uid;
      await set(ref(database, 'users/' + userId), {
        email: email,
      });
      console.log('user created');
      const token = await response.user.getIdToken();
      localStorage.setItem('token', token);
      console.log('cehck point reached')
      return;
    } catch (error) {
      // Catch Firebase error and throw meaningful messages
      const errorCode = error.code;
      console.log('error code ', errorCode)

      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('This email is already registered. Please login or use another email.');
        case 'auth/invalid-email':
          throw new Error('The email address is not valid. Please enter a valid email.');
        case 'auth/weak-password':
          throw new Error('The password is too weak. Please use a stronger password.');
        default:
          throw new Error('Failed to create account. Please try again.');
      }
    }
  }

  async function login(email, password) {
    try {
      const response = await auth.signInWithEmailAndPassword(email, password);
      const token = await response.user.getIdToken();
      localStorage.setItem('token', token);
      console.log('Token stored after login:', token);
    } catch (error) {
      console.error('Error during login:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('User not found. Please check your email and password.');
        case 'auth/wrong-password':
          throw new Error('Incorrect password. Please try again.');
        case 'auth/invalid-email':
          throw new Error('The email address is not valid.');
        default:
          throw new Error('Failed to log in. Please try again.');
      }
    }
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
