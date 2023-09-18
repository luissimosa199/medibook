import { useRouter } from 'next/router'
import React from 'react'

const Paciente = () => {

    const router = useRouter()

    if (!router.isReady) {
        return <p>Cargando...</p>
    }

    return (
        <div>Paciente: {router.query.id}</div>
    )
}

export default Paciente