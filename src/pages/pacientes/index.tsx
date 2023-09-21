import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from '@tanstack/react-query';

interface UserInterface {
    name: string;
    email: string;
    image: string;
    _id: string;
}

const Usuarios = () => {

    const { data: session } = useSession()

    const fetchUsers = async () => {
        const response = await fetch('/api/pacientes', {
            method: 'GET',

        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    const { data: pacientes, error, isLoading } = useQuery(['pacientes'], fetchUsers);

    if (isLoading) return (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md animate-pulse">
            <ul className="divide-y divide-gray-200">
                {[...Array(6)].map((_, index) => (
                    <li key={index} className="py-4 space-y-4">
                        <div className="flex items-center gap-4">
                            {/* Skeleton for profile image */}
                            <div className="rounded-full h-[150px] w-[150px] bg-gray-300"></div>
                            {/* Skeleton for user name */}
                            <div className="flex flex-col">
                                <div className="h-6 bg-gray-300 w-1/2 rounded"></div>
                            </div>
                            {/* Skeleton for video call icon */}
                            <div className="h-6 w-6 bg-gray-300 rounded ml-4"></div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

    if (error) return <p>Error {JSON.stringify(error)} </p>;

    return (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
            <Link href="/pacientes/register">Registrar nuevo paciente</Link>
            <ul className="divide-y divide-gray-200">
                {pacientes.length === 0 && <li className="py-4 space-y-4">
                    <div className="flex items-center gap-4">
                        <p>No has registrado pacientes</p>
                    </div>
                </li>}
                {pacientes.map((paciente: UserInterface) => {
                    return (
                        <li key={paciente._id} className="py-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full h-[150px] w-[150px] border-2 overflow-hidden relative">
                                    <Link href={`/pacientes/${paciente.email.split('@')[0]}`}>
                                        <Image
                                            alt={`foto de ${paciente.name}`}
                                            src={paciente.image || "/noprofile.png"}
                                            fill
                                            className="absolute object-cover"
                                        />
                                    </Link>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-lg font-medium">{paciente.name}</p>
                                </div>

                                {/* <Link href="/usuarios/id">Ver publicaciones</Link> */}

                                {session?.user?.email !== paciente.email && <div className="ml-auto">
                                    <Link className="underline text-lg mb-2 hover:opacity-70" href={`/videocall/${(session!.user!.email as string).split('@')[0]}y${paciente.email.split('@')[0]}`}>
                                        Iniciar videollamada
                                    </Link>
                                </div>}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>

    );
}

export default Usuarios;