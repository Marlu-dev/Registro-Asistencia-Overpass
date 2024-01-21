import React, { useEffect } from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
// import { query, collection, onSnapshot } from 'firebase/firestore'
// import { db } from '../../public/firebase.js'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  section: {
    flexDirection: 'column',
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    margin: 8,
    flexDirection: 'row'
  },
  grupo: {
    flexDirection: 'row',
    margin: 2
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
          <View key={index} style={styles.section}>
            {item && Array.isArray(item.fecha) && item.fecha.length > 0
              ? (
                  item.fecha.map((fechaItem, fechaIndex) => (
                    <View key={`${index}-${fechaIndex}`} style={styles.grupo}>
                      <Text style={styles.text}>{item.nombre}</Text>
                      <Text style={styles.text}>
                        {fechaItem.fecha.toDate().toLocaleDateString()} {fechaItem.fecha.toDate().toLocaleTimeString()}
                      </Text>
                    </View>
                  ))
                )
              : (
                <View style={styles.section}>
                  <View style={styles.grupo}>
                    <Text style={styles.text}>{item.nombre}</Text>
                    <Text style={styles.text}>No hay datos</Text>
                  </View>
                </View>

                )}
          </View>
        ))}
      </Page>
    </Document>

  )
}

export default PDF
