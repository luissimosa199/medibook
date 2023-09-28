import InputList from "@/components/FlexInputList";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const EditPatient = () => {
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [patient, setPatient] = useState<any>(null);

  const fetchData = async (id: string) => {
    const response = await fetch(`/api/pacientes?id=${id}`, { method: "GET" });
    const data = await response.json();
    setPatient(data);
    setTags(data.tags);
    return data;
  };

  useEffect(() => {
    if (id) {
      fetchData(id as string);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    if (status === "unauthenticated") {
      setErrorMessage(
        "Necesita ingresar con su cuenta para editar un paciente"
      );
      return;
    }

    const response = await fetch(`/api/pacientes?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...Object.fromEntries(formData), tags }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      router.push("/pacientes");
    } else {
      setErrorMessage(data.error);
      setIsLoading(false);
    }
  };

  const deletePatient = async (_id: string) => {
    const response = await fetch(`/api/pacientes?id=${_id}`, {
      method: "DELETE",
    });
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
      onSuccess: () => {
        router.push("/pacientes");
      },
    }
  );

  if (!router.isReady || !patient) {
    return <p className="text-xl p-4 min-h-screen">Cargando...</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Nombre
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="name"
            type="text"
            id="name"
            defaultValue={patient.name}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="email"
            type="email"
            id="email"
            defaultValue={patient.email}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="tlf"
          >
            Número de contacto (opcional)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="tlf"
            type="tel"
            id="tlf"
            defaultValue={patient.tlf}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="details"
          >
            Detalles
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="details"
            type="text"
            id="details"
            defaultValue={patient.details}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="details"
          >
            Categoría
          </label>
          <InputList
            type={"tag"}
            inputList={tags}
            setInputList={setTags}
            showState={true}
          />
        </div>

        {errorMessage && (
          <div className="mb-6">
            <p className="text-sm text-red-600 font-semibold text-center">
              Error: {errorMessage}
            </p>
          </div>
        )}
        <div className="flex flex-row gap-1 items-center justify-between">
          <button
            className="w-1/3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all"
            type="button"
            onClick={async (e) => {
              e.preventDefault();

              const result = await Swal.fire({
                title: "Estas seguro?",
                text: "Se borrará el paciente",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Borrar",
                cancelButtonText: "Volver",
              });

              if (result.isConfirmed) {
                deleteMutation.mutate(id as string);
                Swal.fire(
                  "Borrado!",
                  "El paciente ha sido eliminado",
                  "success"
                );
              }
            }}
          >
            <FontAwesomeIcon
              size="lg"
              icon={faTrashCan}
            />
          </button>
          <button
            className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Actualizando..." : "Actualizar paciente"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPatient;
