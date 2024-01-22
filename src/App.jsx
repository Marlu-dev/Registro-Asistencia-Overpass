import React, { useEffect, useState } from 'react'
import './App.css'
import Select from './components/Select'

import {
  doc,
  getDoc,
  updateDoc,
  query,
  collection,
  onSnapshot,
  where
} from 'firebase/firestore'
import { db } from '../public/firebase'
import logo from './assets/img-removebg-preview.png'
import BarraTitulo from './components/BarraTitulo'
import PDF from './components/PDF'
import { PDFDownloadLink } from '@react-pdf/renderer'

function App () {
  const [miembroSeleccionado, setMiembroSeleccionado] = useState('')
  const [listaDeOpciones, setListaOpciones] = useState([])
  const [estado, setEstado] = useState(false)
  const [datos, setDatos] = useState([])
  const [entrada, setEntrada] = useState()
  const [salida, setSalida] = useState()
  const [cantidadDeHoras, setCantidadDeHoras] = useState(0)
  const [totalDeHoras, setTotalDeHoras] = useState()
  const onSelectChange = (e) => {
    setMiembroSeleccionado(e.target.value)
  }

  useEffect(() => {
    const q = query(collection(db, 'miembros'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coincidencia = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          nombre: doc.data().nombre,
          fecha: doc.data().registro.length
            ? doc.data().registro
            : 'No hay registros'
        }
      })
      setDatos(coincidencia)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    console.log(datos)

    for (let i = 0; i < datos.length; i++) {
      // quiero restar impares con pares
      let cantidadDeHoras = 0
      let cantidadDeHorasAcumuladas = 0
      for (let j = 0; j < datos[i].fecha.length; j++) {
        if (datos[i].fecha[j].tipo === 'Entrada') {
          setEntrada(datos[i].fecha[j].fecha)
        } else if (datos[i].fecha[j].tipo === 'Salida') {
          setSalida(datos[i].fecha[j].fecha)
          cantidadDeHoras = datos[i].fecha[j].fecha - datos[i].fecha[j - 1].fecha
          cantidadDeHorasAcumuladas += cantidadDeHoras
          console.log(cantidadDeHorasAcumuladas / 60 / 60)
          console.log(cantidadDeHoras / 60 / 60)
          datos[i].cantidadDeHorasAcumuladas = cantidadDeHorasAcumuladas
          console.log(datos[i].cantidadDeHorasAcumuladas)
        }
      }
    }
  }, [datos])

  useEffect(() => {
    console.log(entrada)
    console.log(salida)
  }, [entrada, salida])

  useEffect(() => {
    console.log(Math.round(cantidadDeHoras / 60 / 60))
  }, [cantidadDeHoras])

  async function agregarRegistro (datos, codigo, estado) {
    const coleccionRef = doc(db, 'miembros', codigo)

    const documento = await getDoc(coleccionRef)
    if (documento.exists()) {
      const registrosActuales = documento.data().registro || []

      const nuevoArrayRegistro = [...registrosActuales, datos]

      await updateDoc(coleccionRef, {
        registro: nuevoArrayRegistro,
        trabajando: !estado
      })
    } else {
      console.error('El documento no existe')
    }
  }

  useEffect(() => {
    const q = query(
      collection(db, 'miembros'),
      where('nombre', '==', miembroSeleccionado)
    )
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coincidencia = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          nombre: doc.data().nombre,
          trabajando: doc.data().trabajando
        }
      })

      if (coincidencia[0] === undefined) {
        return
      }

      setListaOpciones(coincidencia)
      setEstado(coincidencia[0].trabajando)
    })
    return () => unsubscribe()
  }, [miembroSeleccionado, estado])

  const registrar = () => {
    const datos = {
      fecha: new Date(),
      tipo: estado === false ? 'Entrada' : 'Salida'
    }
    agregarRegistro(datos, listaDeOpciones[0].id, estado)
  }

  return (
    <div className='contenedor-principal'>
      <div className='barra-de-titutlo'>
        <BarraTitulo />
      </div>

      <div className='app'>
        <div className='logo'>
          <img src={logo} alt='trabajando' />
        </div>
        <div className='registro-asistencias'>
          <div style={{ width: '100%' }}>
            <h1>Control de Asistencia</h1>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: 'auto',
              paddingLeft: '1.2em',
              marginTop: '1em'
            }}
          >
            <label>Usuario: </label>
            <Select coleccion='miembros' onSelectChange={onSelectChange} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: 'auto',
              paddingLeft: '1.2em',
              marginTop: '1em'
            }}
          >
            <label>Fecha: </label>
            <label style={{ display: 'flex', marginLeft: '10%' }}>
              {new Date().toLocaleDateString()}
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* <button onClick={registrar}>
            {estado ? 'Registrar Salida' : 'Registrar Entrada'}
          </button> */}
            {estado
              ? (
                <button
                  style={{ backgroundColor: 'red', color: 'white' }}
                  onClick={registrar}
                >
                  Registrar Salida
                </button>
                )
              : (
                <button
                  style={{ backgroundColor: 'blue', color: 'white' }}
                  onClick={registrar}
                >
                  Registrar Entrada
                </button>
                )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            {datos && datos.length > 0
              ? (
                <PDFDownloadLink
                  document={<PDF datos={datos} />}
                  fileName='reporte.pdf'
                >
                  {({ loading }) =>
                    loading ? 'Cargando documento...' : 'Descargar PDF'}
                </PDFDownloadLink>
                )
              : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '15.6%',
                    marginLeft: '5%'
                  }}
                >
                  <h3>No hay datos para exportar</h3>
                </div>
                )}
          </div>
        </div>
        {/* <div className='lista-trabajando'>
        <RegistroTrabajando />
      </div> */}
      </div>
    </div>
  )
}

export default App
