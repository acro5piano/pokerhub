import * as React from 'react'
import { Howl } from 'howler'
import Eventually from '~/assets/eventually.mp3'

const sound = new Howl({
  src: [Eventually],
})

export function useRing({ ring }: { ring: boolean }) {
  React.useEffect(() => {
    if (ring) {
      sound.play()
    }
  }, [ring])
}
