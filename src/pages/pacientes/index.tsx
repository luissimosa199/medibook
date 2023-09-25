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
  const queryClient = useQueryClient();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchUsers = async () => {
    const response = await fetch("/api/pacientes", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const deletePatient = async (_id: string) => {
    const response = await fetch(`/api/pacientes?id=${_id}`, {
      method: "DELETE",
    });
    // const data = await response.json();
    return response;
  };

  const deleteMutation = useMutation(
    async (_id: string) => deletePatient(_id),
    {
      onMutate: (_id: string) => {
        const previousPatientsData = queryClient.getQueryData<any[]>([
          "pacientes",
        ]);

        queryClient.setQueryData(["pacientes"], (oldData: any[] | undefined) =>
          oldData?.filter((patient) => patient._id !== _id)
        );

        return { previousPatientsData };
      },
      onError: (error, variables, context: any) => {
        console.log(error);
        queryClient.setQueryData(["pacientes"], context.previousPatientsData);
      },
    }
  );

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

  const filteredPatients = pacientes.filter((paciente: UserInterface) => {
    return selectedTags.every((tag) => paciente.tags.includes(tag));
  });

  return (
    <div className="mt-4 bg-white p-6 rounded-lg shadow-md min-h-screen">
      <Link href="/pacientes/register">Registrar nuevo paciente</Link>

      <PatientsFilters
        tags={tags}
        setSelectedTags={setSelectedTags}
      />

      <ul className="divide-y divide-gray-200">
        {pacientes.length === 0 && (
          <li className="py-4 space-y-4">
            <div className="flex items-center gap-4">
              <p>No has registrado pacientes</p>
            </div>
          </li>
        )}

        {selectedTags.length > 0
          ? filteredPatients.map((paciente: UserInterface, idx: number) => {
              return (
                <PatientCard
                  key={idx}
                  session={session}
                  paciente={paciente}
                  deleteMutation={deleteMutation}
                />
              );
            })
          : pacientes.map((paciente: UserInterface, idx: number) => {
              return (
                <PatientCard
                  key={idx}
                  session={session}
                  paciente={paciente}
                  deleteMutation={deleteMutation}
                />
              );
            })}
      </ul>
    </div>
  );
};

export default Usuarios;
