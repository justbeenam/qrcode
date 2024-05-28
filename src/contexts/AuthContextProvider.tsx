import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import Loading from '~/components/Loading';
import { auth, db } from '~/configs/database';

function AuthContextProvider({ children }: AuthContextProfiverProps) {
  const [currentUser, setCurrentUser] = useState<CurrentUserContents>({
    uid: '',
    displayName: '',
    email: '',
    photoURL: '',
    nameCompany: '',
    role: 2,
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const dataUser: any = (await getDoc(doc(db, 'users', user.uid))).data();
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: dataUser.role,
          nameCompany: dataUser.nameCompany,
        });
        setShow(true);
      } else {
        setCurrentUser({ uid: '', displayName: '', email: '', photoURL: '', nameCompany: '', role: 2 });
        setShow(true);
      }
    });
  }, []);

  return show ? (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AuthContext.Provider>
  ) : (
    <Loading />
  );
}
const AuthContext = createContext<AuthContextContent>({
  currentUser: {
    uid: '',
    displayName: '',
    email: '',
    photoURL: '',
    nameCompany: '',

    role: 2,
  },
  setCurrentUser: () => {},
});

interface AuthContextProfiverProps {
  children: ReactNode;
}
type AuthContextContent = {
  currentUser: {
    uid: string | null | '';
    displayName: string | null | '';
    email: string | null | '';
    photoURL: string | null | '';
    nameCompany: string | null | '';

    role: number | null | 2;
  };
  setCurrentUser: Dispatch<SetStateAction<CurrentUserContents>>;
};
export interface CurrentUserContents {
  uid: string | null | '';
  displayName: string | null | '';
  email: string | null | '';
  photoURL: string | null | '';
  nameCompany: string | null | '';
  role: number | null;
}
export const useAuthContext = () => useContext(AuthContext);
export default AuthContextProvider;
