import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  // where,
} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
// import { useGetUserInfo } from "./useGetUserInfo";

export const useGetCotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);

  const cotizacionCollectionRef = collection(db, "cotizaciones");
  // const { userID } = useGetUserInfo();

  const getCotizaciones = async () => {
    let unsubscribe;
    try {
      const queryCotizaciones = query(
        cotizacionCollectionRef,
        // where("userID", "==", userID),
        orderBy("createdAt")
      );
      unsubscribe = onSnapshot(queryCotizaciones, (snapshot) => {
        let docs = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;
          // const createdAt = doc.createdAt;

          docs.push({ ...data, id });

          // console.log("</> → createdAt:", createdAt);
          // console.log("</> → docs:", docs);
        });
        setCotizaciones(docs);
      });
    } catch (error) {
      console.error(error);
    }

    return () => unsubscribe;
  };

  useEffect(() => {
    getCotizaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { cotizaciones };
};
