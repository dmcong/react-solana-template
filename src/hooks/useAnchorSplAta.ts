import { Spl } from '@project-serum/anchor'
import { useMemo } from 'react'

import { useAnchorProvider } from './useAnchorProvider'

export const useAnchorSplAta = () => {
  const provider = useAnchorProvider()

  const splata = useMemo(() => {
    if (!provider) return null
    return Spl.associatedToken(provider)
  }, [provider])

  return splata
}
