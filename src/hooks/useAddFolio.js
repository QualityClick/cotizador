import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export const useAddFolio = () => {
  const folioCollectionRef = collection(db, "folios");

  const addFolio = async ({ num }) => {
    await addDoc(folioCollectionRef, {
      num,
    });
  };

  return { addFolio };
};
