import './App.css'
import Select from './components/Select'
import { useEffect, useState } from 'react'
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
// import RegistroTrabajando from './components/RegistroTrabajando'
import img from './assets/img-removebg-preview.png'

function App () {
  const [miembroSeleccionado, setMiembroSeleccionado] = useState('')
  const [listaDeOpciones, setListaOpciones] = useState([])
  const [estado, setEstado] = useState(false)

  const onSelectChange = (e) => {
    setMiembroSeleccionado(e.target.value)
  }

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
    <div className='app'>
      <div className='logo'>
        <img src={img} alt='trabajando' />
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
          <label style={{ display: 'flex', marginLeft: '10%' }}>{new Date().toLocaleDateString()}</label>

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* <button onClick={registrar}>
            {estado ? 'Registrar Salida' : 'Registrar Entrada'}
          </button> */}
          {
            estado
              ? <button style={{ backgroundColor: 'red', color: 'white' }} onClick={registrar}>Registrar Salida</button>
              : <button style={{ backgroundColor: 'blue', color: 'white' }} onClick={registrar}>Registrar Entrada</button>
          }
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <a href=''>Generar Reporte</a>
        </div>
      </div>
      {/* <div className='lista-trabajando'>
        <RegistroTrabajando />
      </div> */}
    </div>
  )
}

export default App
