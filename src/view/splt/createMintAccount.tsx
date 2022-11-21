import { useState } from 'react'
import { utils, web3 } from '@project-serum/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Token } from '@solana/spl-token'

import { Button, Col, Row, Typography } from 'antd'
import { useAnchorSplToken } from 'hooks/useAnchorSplToken'
import { useAnchorProvider } from 'hooks/useAnchorProvider'

const CreateMintAccount = () => {
  const [loading, setLoading] = useState(false)
  const [mintAddress, setMintAddress] = useState('')
  const { connection } = useConnection()
  const provider = useAnchorProvider()
  const splt = useAnchorSplToken()

  const onCreateNewMint = async () => {
    try {
      if (!splt) throw new Error('Invalid anchor splt token!')
      if (!provider) throw new Error('Connect wallet fist!')
      setLoading(true)

      const newMint = web3.Keypair.generate()
      const lamports = await Token.getMinBalanceRentForExemptMint(connection)

      // Create rent instruction
      const rentIx = web3.SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: newMint.publicKey,
        space: splt.account.mint.size,
        lamports,
        programId: utils.token.TOKEN_PROGRAM_ID,
      })

      // Create initialize mint instruction
      const initMintIx = await splt.methods
        .initializeMint(9, provider.publicKey, provider.publicKey)
        .accounts({ mint: newMint.publicKey, rent: web3.SYSVAR_RENT_PUBKEY })
        .instruction()

      // Build transaction
      const transaction = new web3.Transaction().add(rentIx, initMintIx)
      // Send and confirm transaction
      await provider.sendAndConfirm(transaction, [newMint])
      return setMintAddress(newMint.publicKey.toBase58())
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={6}>
        <Button
          type="primary"
          block
          onClick={onCreateNewMint}
          loading={loading}
        >
          Create Mint
        </Button>
      </Col>

      <Col flex="auto">
        <Typography.Text>{mintAddress}</Typography.Text>
      </Col>
    </Row>
  )
}

export default CreateMintAccount
