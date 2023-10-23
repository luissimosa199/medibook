import { useSession } from "next-auth/react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import PatientCard from "@/components/PatientCard";
import { useState } from "react";
import PatientsFilters from "@/components/PatientsFilters";
import { Patient } from "@/db/models/patientModel";
import AsideMenu from "@/components/AsideMenu";

interface UserInterface {
  name: string;
  email: string;
  image: string;
  _id: string;
  tags: string[];
  isArchived: boolean;
}

const Usuarios = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [filterByFavorites, setFilterByFavorites] = useState<boolean>(false);

  const fetchPatients = async () => {
    const response = await fetch("/api/pacientes", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = response.json();
    return data;
  };

  const {
    data: pacientes,
    error,
    isLoading,
  } = useQuery(["pacientes"], fetchPatients);

  const {
    data: favorites,
    isLoading: favoritesLoading,
  }: { data: string[] | undefined; isLoading: boolean } = useQuery(
    ["favorites"],
    async () => {
      if (!session) {
        return [];
      }
      const response = await fetch(`/api/user/favorites`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Could not fetch favorites");
      }
    }
  );

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
    .filter((paciente: Patient) => {
      // If no filters are applied, take archived status into account
      if (!nameFilter && selectedTags.length === 0) {
        if (showArchived) {
          return paciente.isArchived === true;
        } else {
          return paciente.isArchived !== true; // handles both undefined and false cases
        }
      }
      return true; // If any filter is applied, we don't filter out by archived status here.
    })
    .filter((paciente: UserInterface) => {
      // Handle name filtering
      return nameFilter
        ? paciente.name.toLowerCase().includes(nameFilter.toLowerCase())
        : true;
    })
    .filter((paciente: UserInterface) => {
      // Handle tag filtering
      return selectedTags.length > 0
        ? selectedTags.every((tag) => paciente.tags.includes(tag))
        : true;
    })
    .filter((paciente: UserInterface) => {
      // Handle favorites filtering
      return filterByFavorites && favorites
        ? favorites.includes(paciente._id)
        : true;
    })
    .sort((a: Patient, b: Patient) => {
      // If 'a' is archived and 'b' is not, 'a' comes last
      if (a.isArchived && !b.isArchived) return 1;
      // If 'b' is archived and 'a' is not, 'b' comes last
      if (b.isArchived && !a.isArchived) return -1;
      // Otherwise, no change in order
      return 0;
    });

  return (
    <div className="mt-4 bg-white p-6 rounded-lg shadow-md min-h-[130vh] max-w-[850px] mx-auto">
      <div className="flex flex-col">
        <div className="my-4 2xl:absolute 2xl:left-8 2xl:p-8 bg-white ">
          <AsideMenu />
          <PatientsFilters
            tags={tags}
            setSelectedTags={setSelectedTags}
            filterByFavorites={filterByFavorites}
            setFilterByFavorites={setFilterByFavorites}
          />
        </div>

        <div className="flex justify-between">
          <Link
            className="w-fit inline-flex items-center p-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-800 transition ease-in-out duration-150"
            href="/pacientes/register"
          >
            Nuevo paciente
          </Link>

          <button
            className="w-fit inline-flex items-center p-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-800 transition ease-in-out duration-150"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Pacientes activos" : "Pacientes archivados"}
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="p-2 mt-4 border rounded"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>

      <ul className="divide-y divide-gray-200">
        {pacientes.length === 0 && (
          <li className="py-4 space-y-4">
            <div className="flex items-center gap-4">
              <p>No has registrado pacientes</p>
            </div>
          </li>
        )}

        {filteredPatients.map((paciente: UserInterface, idx: number) => {
          return (
            <PatientCard
              key={idx}
              session={session}
              paciente={paciente}
              favoritesLoading={favoritesLoading}
              isFavorites={
                Array.isArray(favorites) && favorites.includes(paciente._id)
              }
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Usuarios;
