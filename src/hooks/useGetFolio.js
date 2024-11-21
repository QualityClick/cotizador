import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";

export const useGetFolio = () => {
  const [folios, setFolios] = useState([]);

  const folioCollectionRef = collection(db, "folios");

  const getFolios = async () => {
    let unsubscribe;
    try {
      const queryFolios = query(folioCollectionRef);
      let docs = [];
      unsubscribe = onSnapshot(queryFolios, (snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          docs.push({ ...data });
          // console.log(data);
        });
        setFolios(docs);
      });
    } catch (err) {
      console.log(err);
    }
    return () => {
      unsubscribe();
    };
  };

  useEffect(() => {
    getFolios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { folios };
};
