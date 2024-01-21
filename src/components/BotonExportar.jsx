import React, { useEffect, useState } from 'react'
import { exportToExcel } from 'react-json-to-excel'
import {
  query,
  collection,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../../public/firebase.js'

const BotonExportar = () => {
  const [datos, setDatos] = useState([])

  useEffect(() => {
    const q = query(
      collection(db, 'miembros')
    )
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coincidencia = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          nombre: doc.data().nombre,
          fecha: doc.data().fecha
        }
      })
      setDatos(coincidencia)
    }
    )
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    console.log(datos)
  }, [datos])

  const samplejson2 = [
    { name: 'name01', age: '20', sex: 'M' },
    { name: 'name02', age: '22', sex: 'F' },
    { name: 'name03', age: '20', sex: 'M' }
  ]

  return (
    <div>
      <button onClick={() => exportToExcel(samplejson2, 'downloadfilename')}>
        Download using method
      </button>
    </div>
  )
}

export default BotonExportar
