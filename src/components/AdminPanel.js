import { Contract } from "@ethersproject/contracts"
import { useEffect, useState, useContext } from "react"
import { useWeb3Context } from "web3-react"
import ContractContext from "../utils/contractContext"

const Admin = (props) => {
    const contractData = useContext(ContractContext)
    const context = useWeb3Context()
    const [isOwner, setIsOwner] = useState()
    const [amountTkn, setAmountTkn] = useState()

    useEffect(() => {
        checkIfOwner()
    });

    async function checkIfOwner() {
        const contract = new Contract(contractData.address, contractData.abi, context.library)
        const owner = await contract.owner()
        if (owner.toLowerCase() == context.account.toLowerCase()) {
            setIsOwner(true)
        }
    }

    return (
        <div>
            <p>{isOwner ? 'Es el Owner' : 'No es el Owner'}</p>
            <p>{context.account}</p>
        </div>
    )
}

export default Admin