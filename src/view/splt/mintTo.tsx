import { useState } from 'react'
import { BN, utils, web3 } from '@project-serum/anchor'

import { Button, Col, Input, Row, Space, Typography } from 'antd'
import { useAnchorSplToken } from 'hooks/useAnchorSplToken'
import { useAnchorProvider } from 'hooks/useAnchorProvider'
import { useAnchorSplAta } from 'hooks/useAnchorSplAta'

const MintTo = () => {
  const [loading, setLoading] = useState(false)
  const [mintAddress, setMintAddress] = useState('')
  const [amount, setAmount] = useState('')
  const provider = useAnchorProvider()
  const splt = useAnchorSplToken()
  const splata = useAnchorSplAta()

  const onMintTo = async () => {
    try {
      if (!splt || !splata) throw new Error('Invalid anchor program!')
      if (!provider) throw new Error('Connect wallet fist!')
      setLoading(true)

      const associatedAccount = await utils.token.associatedAddress({
        mint: new web3.PublicKey(mintAddress),
        owner: provider.publicKey,
      })

      await splata.methods
        .create()
        .accounts({
          associatedAccount,
          mint: new web3.PublicKey(mintAddress),
          authority: provider.publicKey,
          owner: provider.publicKey,
          rent: web3.SYSVAR_RENT_PUBKEY,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        })
        .rpc()

      await splt.methods
        .mintTo(new BN(amount))
        .accounts({
          authority: provider.publicKey,
          mint: mintAddress,
          to: associatedAccount,
        })
        .rpc()
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={12}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Text>Mint Address</Typography.Text>
          <Input
            placeholder="Mint Address"
            onChange={(e) => setMintAddress(e.target.value)}
          />
        </Space>
      </Col>
      <Col span={12}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Text>Amount</Typography.Text>
          <Input
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </Space>
      </Col>
      <Col span={6}>
        <Button type="primary" block onClick={onMintTo} loading={loading}>
          Mint to
        </Button>
      </Col>
    </Row>
  )
}

export default MintTo
