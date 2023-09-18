import { faClock, faDollarSign, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react'

const Videocall = () => {

    const router = useRouter()
    const { data: session, status } = useSession()
    
    const [pacient, setPacient] = useState('');
    const [amount, setAmount] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (amount === "" || time === "") {
            return;
        }
        if (session && session.user) {
            router.push(`/videocall/lobby?username=${encodeURIComponent(session.user.name as string)}&pacient=${encodeURIComponent(pacient)}&time=${encodeURIComponent(time)}&amount=${encodeURIComponent(amount)}`);
            setAmount('');
            setTime('');
            setPacient('')
        }
    };

    return (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit}>

                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                        Ingrese nombre del paciente
                    </label>
                    <div className="flex relative">
                        <span className="text-lg mr-2 leading-10 left-2 absolute">
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                        <input
                            onChange={(e) => setPacient(e.target.value)}
                            value={pacient}
                            type="text"
                            id="pacient"
                            className="p-2 border pl-8 text-lg leading-tight rounded-md w-full focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>


                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                        Ingrese monto de la consulta
                    </label>
                    <div className="flex relative">
                        <span className="text-lg mr-2 leading-10 left-2 absolute">
                            <FontAwesomeIcon icon={faDollarSign} />
                        </span>
                        <input
                            onChange={(e) => setAmount(e.target.value)}
                            value={amount}
                            type="text"
                            id="amount"
                            className="p-2 border pl-8 text-lg leading-tight rounded-md w-full focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                        Ingrese tiempo en minutos
                    </label>
                    <div className="flex relative">
                        <span className="text-lg absolute leading-10 left-2 ">
                            <FontAwesomeIcon icon={faClock} />
                        </span>
                        <input
                            onChange={(e) => setTime(e.target.value)}
                            value={time}
                            type="text"
                            id="time"
                            className="p-2 border pl-8 text-lg leading-tight rounded-md w-full focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <button disabled={status !== "authenticated"} className="bg-blue-500 w-full text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none">
                    Crear consulta
                </button>
            </form>
        </div>

    )
}

export default Videocall