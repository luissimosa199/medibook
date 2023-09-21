import { IconDefinition, faChartBar, faDollarSign, faLifeRing, faStethoscope, faUsers, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { FunctionComponent } from 'react'

const buttons = [
    // { icon: faStethoscope, href: "videocall", name: "Iniciar consulta", color: 'bg-sky-400' },
    { icon: faUsers, href: "pacientes", name: "Pacientes", color: 'bg-emerald-400' },
    // { icon: faLifeRing, href: "soporte", name: "Soporte", color: 'bg-yellow-400' },
    { icon: faVideo, href: "pacientes", name: "Videollamadas", color: 'bg-violet-400' },
    // { icon: faDollarSign, href: "promo", name: "Promoción", color: 'bg-green-400' },
    // { icon: faChartBar, href: "estadisticas", name: "Ver estadísticas", color: 'bg-teal-400' },
]

// interface ProfileButtonsPanelProps {
//     buttons: {
//         icon: IconDefinition;
//         href: string;
//         name: string;
//         color: string;
//     }[]
// }


const ProfileButtonsPanel: FunctionComponent = () => {
    return (
        // <div className="w-fit max-w-[632px] mx-auto flex justify-center p-4">
        //     <div className="flex flex-wrap gap-2">
        //         {buttons.map((e, idx) => {
        //             return (
        //                 <div key={`${e}-${idx}`} className={`w-36 h-36 p-2 cursor-pointer ${e.color} rounded-md hover:bg-opacity-70 transition duration-300`}>
        //                     <Link href={`/${e.href}`} className="text-sm text-center text-white border border-transparent">
        //                         <div className="w-2/5 h-2/5 my-2 mx-auto flex justify-center">
        //                             <FontAwesomeIcon className="h-full" icon={e.icon} />
        //                         </div>
        //                         <span className="text-base font-semibold">
        //                             {e.name}
        //                         </span>
        //                     </Link>
        //                 </div>
        //             )
        //         })}
        //     </div>
        // </div>

        <ul>
            {buttons.map((e, idx) => {
                return (
                    <li key={idx} className="underline text-lg mb-2 hover:opacity-70">
                        <Link href={e.href}>
                            {e.name}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default ProfileButtonsPanel