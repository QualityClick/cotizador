import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase/firebase-config";

export const useUpdateCotizacion = () => {
  const [tempUpdateId, setTempUpdateId] = useState("");

  const onClickUpdate = (id) => {
    setTempUpdateId(id);
    // console.log("hola");
    console.log(tempUpdateId);
  };

  const onUpdate = async (e) => {
    console.log(tempUpdateId);
    console.log(e.target.value);
    const docRef = doc(db, "cotizaciones", tempUpdateId);
    await updateDoc(docRef, {
      status: "hola",
    });
  };
  return { onClickUpdate, onUpdate };
};
