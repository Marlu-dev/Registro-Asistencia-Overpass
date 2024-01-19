import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../public/firebase.js";

const RegistroTrabajando = () => {
  const [lista, setLista] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, "miembros"),
      where("trabajando", "==", true)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coincidencia = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          nombre: doc.data().nombre,
          trabajando: doc.data().trabajando,
        };
      });

      if (coincidencia[0] === undefined) {
        setLista([]);
      }

      if (coincidencia.length === 0) {
        setLista([]);
      }

      setLista(coincidencia);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(lista);
  }, [lista]);

  return (
    <div>
      <h2>Registro Gente Trabajando</h2>
      <ul>
        {lista.map((item) => (
          <li key={item.id}>
            {item.nombre} {item.trabajando ? "Trabajando" : "No Trabajando"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistroTrabajando;
