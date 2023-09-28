import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import PatientCard from "@/components/PatientCard";
import { useState } from "react";
import PatientsFilters from "@/components/PatientsFilters";

interface UserInterface {
  name: string;
  email: string;
  image: string;
  _id: string;
  tags: string[];
}

const Usuarios = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState("");

  const fetchUsers = async () => {
    const response = await fetch("/api/pacientes", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const {
    data: pacientes,
    error,
    isLoading,
  } = useQuery(["pacientes"], fetchUsers);

  if (status === "unauthenticated") {
    router.push("/login");
  }

  if (isLoading)
    return (
      <div className="mt-4 min-h-screen bg-white p-6 rounded-lg shadow-md animate-pulse">
        <ul className="divide-y divide-gray-200">
          {[...Array(6)].map((_, index) => (
            <li
              key={index}
              className="py-4 space-y-4"
            >
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

  const tags = Array.from(
    new Set(pacientes.flatMap((e: UserInterface) => e.tags))
  ) as string[];

  const filteredPatients = pacientes
    .filter((paciente: UserInterface) => {
      if (nameFilter) {
        return paciente.name.toLowerCase().includes(nameFilter.toLowerCase());
      }
      return true;
    })
    .filter((paciente: UserInterface) => {
      return selectedTags.every((tag) => paciente.tags.includes(tag));
    });

  return (
    <div className="mt-4 bg-white p-6 rounded-lg shadow-md min-h-screen">
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="p-2 mt-4 border rounded"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <PatientsFilters
          tags={tags}
          setSelectedTags={setSelectedTags}
        />

        <Link
          className="w-fit inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-800 transition ease-in-out duration-150"
          href="/pacientes/register"
        >
          Registrar nuevo paciente
        </Link>
      </div>

      <ul className="divide-y divide-gray-200">
        {pacientes.length === 0 && (
          <li className="py-4 space-y-4">
            <div className="flex items-center gap-4">
              <p>No has registrado pacientes</p>
            </div>
          </li>
        )}

        {selectedTags.length > 0 || nameFilter
          ? filteredPatients.map((paciente: UserInterface, idx: number) => {
              return (
                <PatientCard
                  key={idx}
                  session={session}
                  paciente={paciente}
                />
              );
            })
          : pacientes.map((paciente: UserInterface, idx: number) => {
              return (
                <PatientCard
                  key={idx}
                  session={session}
                  paciente={paciente}
                />
              );
            })}
      </ul>
    </div>
  );
};

export default Usuarios;
