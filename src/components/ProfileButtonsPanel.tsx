import { faChartBar, faDollarSign, faLifeRing, faStethoscope, faUsers, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

const links = [
    { icon: faStethoscope, href: "videocall", name: "Iniciar consulta", color: 'bg-sky-400' },
    { icon: faUsers, href: "pacientes", name: "Pacientes", color: 'bg-emerald-400' },
    { icon: faLifeRing, href: "soporte", name: "Soporte", color: 'bg-yellow-400' },
    { icon: faVideo, href: "pacientes", name: "Iniciar Videollamada", color: 'bg-violet-400' },
    { icon: faDollarSign, href: "promo", name: "Promoción", color: 'bg-green-400' },
    { icon: faChartBar, href: "estadisticas", name: "Ver estadísticas", color: 'bg-teal-400' },

]


const ProfileButtonsPanel = () => {
    return (
        <div className="w-full flex flex-wrap p-4 gap-2 ">
            {links.map((e, idx) => {
                return (
                    <div key={`${e}-${idx}`} className={` w-36 h-36 p-2 cursor-pointer ${e.color} rounded-md hover:bg-opacity-70 transition duration-300`}>
                        <Link href={`/${e.href}`} className="text-sm text-center text-white">
                            <div className="w-3/5 h-3/5 my-2 mx-auto flex justify-center">
                                <FontAwesomeIcon className="h-full" icon={e.icon} />
                            </div>
                            <span className="">
                                {e.name}
                            </span>
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}

export default ProfileButtonsPanel