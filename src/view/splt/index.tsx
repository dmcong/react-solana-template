import { Collapse } from 'antd'
import CreateMintAccount from './createMintAccount'
import MintTo from './mintTo'
import Transfer from './transfer'

const { Panel } = Collapse

const Splt = () => {
  return (
    <Collapse defaultActiveKey={['create-mint-account']}>
      <Panel header="Create Mint Account" key="create-mint-account">
        <CreateMintAccount />
      </Panel>
      <Panel header="Mint To" key="2">
        <MintTo />
      </Panel>
      <Panel header="Transfer" key="3">
        <Transfer />
      </Panel>
    </Collapse>
  )
}

export default Splt
