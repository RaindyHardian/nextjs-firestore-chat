import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';

export const getUserList = async () => {
  const usersRef = collection(firestore, 'users');
  const querySnapshot = await getDocs(usersRef);

  const userList = [];
  querySnapshot.forEach((doc) => {
    userList.push(doc.data());
  });

  return userList;
};

export const getUserById = async (userId) => {
  const userRef = doc(firestore, 'users', userId.toString());
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};
