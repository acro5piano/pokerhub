import React from 'react'
import { Text, View } from 'react-native'
import { useRoom } from './hooks'

export function App() {
  const room = useRoom()

  // console.log(room)
  return (
    <View>
      <Text>hello</Text>
    </View>
  )
}
