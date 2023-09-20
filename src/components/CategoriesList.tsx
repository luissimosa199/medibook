import { fetchCategories } from "@/utils/getCategories";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

type DataType = string | { value: string };

const CategoriesList = () => {

    const visibleItems = 20;
    const [showAll, setShowAll] = useState(false);

    const { data, isLoading, error } = useQuery<string[] | Error>({
        queryFn: fetchCategories,
        queryKey: ['categories'],
        staleTime: 1000 * 60 * 2,
        cacheTime: 1000 * 60 * 2,
        keepPreviousData: true,
    })

    if (isLoading) {
        return (
            <div className="">
                <h2 className="text-3xl mb-4">Categorías</h2>
                <ul className="mb-8 flex flex-col gap-1">
                    <li>
                        <p>Cargando...</p>
                    </li>
                </ul>
            </div>
        )
    }

    if (error || data instanceof Error) {
        return (
            <div className="">
                <h2 className="text-3xl mb-4">Categorías</h2>
                <ul className="mb-8 flex flex-col gap-1">
                    <li>
                        <p>Error {JSON.stringify(error)}</p>
                    </li>
                </ul>
            </div>
        )
    }

    return (
        <div className="p-4">
            {data?.length === 0
                ?
                <p>No hay categorías para mostrar</p>
                :
                <div>
                    <h2 className="text-3xl mb-4">Categorías</h2>
                    <ul className="mb-4 flex flex-wrap justify-around gap-2 px-2 overflow-hidden transition-all duration-500" style={{ height: showAll ? 'auto' : `${visibleItems * 0.35}rem` }}>
                        {
                            (data as DataType[]).map((e, idx: number) => {
                                const displayValue = typeof e === 'string' ? e : e.value;

                                return (
                                    <li key={idx} className={`transform transition-all duration-500 ${idx >= visibleItems && !showAll ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                                        <Link className="capitalize py-1 px-2 hover:underline hover:text-gray-600" href={`/nota/search?tags=${displayValue}`}>{displayValue}</Link>
                                    </li>
                                );
                            })
                        }
                    </ul>
                    <button onClick={() => setShowAll(!showAll)} className="focus:outline-none text-gray-500 hover:text-gray-600">
                        <svg className={`w-5 h-5 transform transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </div>}
        </div>
    )
}

export default CategoriesList