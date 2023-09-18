import { faUserDoctor, faClock, faDollarSign, faLink, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const VideoCallLobby = () => {
    const router = useRouter();
    const { pacient, username, time, amount } = router.query;

    const [paymentLink, setPaymentLink] = useState<string | null>("https://mp.pago.com/1234567")

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // You can add some feedback here, like showing a tooltip or changing the button text to "Copied!"
    };

    return (
        <div className="bg-white p-6 rounded-md shadow-md w-96 mx-auto mt-10">
            <div className="mb-4">
                <div className="flex gap-2 mb-1 items-center">
                    <FontAwesomeIcon icon={faUserDoctor} />
                    <p className="text-gray-600">Especialista:</p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span>{username}</span>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex gap-2 mb-1 items-center">
                    <FontAwesomeIcon icon={faUser} />
                    <p className="text-gray-600">Paciente:</p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span>{pacient}</span>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex gap-2 mb-1 items-center">
                    <FontAwesomeIcon icon={faClock} className="" />
                    <p className="text-gray-600">Tiempo de la consulta:</p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span>{time} min.</span>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex gap-2 mb-1 items-center">
                    <FontAwesomeIcon icon={faDollarSign} className="" />
                    <p className="text-gray-600">Monto a abonar:</p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span>${amount}</span>
                </div>
            </div>

            {/* <div className="mb-4 mt-2">
                <div className="flex gap-2 mb-1 items-center">
                    <FontAwesomeIcon icon={faLink} className="" />
                    <p className="text-gray-600">Link de pago</p>
                </div>
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span>{paymentLink}</span>
                    <button onClick={() => handleCopy(paymentLink as string)} className="text-blue-500 hover:text-blue-600">
                        Copiar
                    </button>
                </div>
            </div> */}

            <div className="mt-2 bg-blue-500 w-full text-white text-center py-2 px-4 rounded hover:bg-blue-600 focus:outline-none">
                <Link href={`/videocall/${(username as string)}y${(pacient as string)}?time=${time}`} className="">
                    Proceder a la consulta
                </Link>
            </div>

        </div>
    );
}

export default VideoCallLobby