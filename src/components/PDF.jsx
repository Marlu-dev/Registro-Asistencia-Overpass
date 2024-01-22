import React, { useEffect } from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
// import { query, collection, onSnapshot } from 'firebase/firestore'
// import { db } from '../../public/firebase.js'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 20
  },
  section: {
    flexDirection: 'column',
    marginBottom: 20
  },
  grupo: {
    flexDirection: 'row',
    marginVertical: 2
  },
  text: {
    fontSize: 16,
    margin: 8
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  noDataText: {
    fontStyle: 'italic',
    color: 'gray'
  },
  totalHoursText: {
    fontWeight: 'bold',
    marginTop: 10
  }
})

const PDF = ({ datos }) => {
  useEffect(() => {
    console.log(datos)
  }, [datos])

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {datos.map((item, index) => (
          <React.Fragment key={index}>
            <View style={styles.section}>
              {item && Array.isArray(item.fecha) && item.fecha.length > 0
                ? (
                    item.fecha.map((fechaItem, fechaIndex) => (
                      <View key={`${index}-${fechaIndex}`} style={styles.grupo}>
                        <Text style={styles.text}>{item.nombre}</Text>
                        <Text style={styles.text}>
                          {fechaItem.fecha.toDate().toLocaleDateString()}{' '}
                          {fechaItem.fecha.toDate().toLocaleTimeString()}
                        </Text>
                        <Text style={styles.text}>{fechaItem.tipo}</Text>
                      </View>
                    ))
                  )
                : (
                  <View style={styles.section}>
                    <View style={styles.grupo}>
                      <Text style={styles.text}>{item.nombre}</Text>
                      <Text style={[styles.text, styles.noDataText]}>No hay datos</Text>
                    </View>
                  </View>
                  )}
              <Text style={[styles.text, styles.totalHoursText]}>
                {'Horas TOTALES acumuladas: '}
                {item.cantidadDeHorasAcumuladas
                  ? Math.round(item.cantidadDeHorasAcumuladas / 60 / 60)
                  : '0'}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </Page>
    </Document>
  )
}

export default PDF
