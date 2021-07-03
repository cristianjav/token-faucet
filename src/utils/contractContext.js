import { createContext } from 'react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/addresses'

const ContractContext = createContext({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI
})

export default ContractContext