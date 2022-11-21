import { Spl } from '@project-serum/anchor'
import { useMemo } from 'react'

import { useAnchorProvider } from './useAnchorProvider'

export const useAnchorSplToken = () => {
  const provider = useAnchorProvider()

  const splt = useMemo(() => {
    if (!provider) return null
    return Spl.token(provider)
  }, [provider])

  return splt
}
