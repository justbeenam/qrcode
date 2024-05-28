import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';
import config from '~/configs';

import { auth, db } from '~/configs/database';

const provider = new GoogleAuthProvider();

export const login = () => signInWithPopup(auth, provider);

export const logout = async () => {
  await signOut(auth);
  <Navigate to={config.routes.home} />;
  localStorage.clear();
};
export const checkUser = async (uid: any) => {
  const docUser = doc(db, 'users', uid);
  const getDocUser = await getDoc(docUser);
  return getDocUser.exists() ? getDocUser.data() : undefined;
};
export const addUser = async (currentUser: any) => {
  const userCollect = doc(db, 'users', currentUser.uid);
  const data = {
    uid: currentUser.uid,
    displayName: currentUser.displayName,
    email: currentUser.email,
    photoURL: currentUser.photoURL,
    nameCompany: '',
    role: 2,
  };
  try {
    await setDoc(userCollect, data);
  } catch (error) {
    console.error(error);
  }
};
