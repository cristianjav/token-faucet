import { useEffect } from "react";
import { useWeb3Context } from "web3-react"

export default function NetworkManager({ children }) {
    const context = useWeb3Context()

    useEffect(() => {
        context.setConnector('MetaMask')
    }, [])

    if (!context.active && !context.error) {
        return 'Cargando...'
    } else if (context.error) {
        console.log(context.error)
        return 'Hubo un error.'
        
    } else {
        return children
    }
}