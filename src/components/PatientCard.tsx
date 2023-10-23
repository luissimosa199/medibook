import {
  faPenToSquare,
  faVideoCamera,
  faMessage,
  faBoxArchive,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import router from "next/router";
import React, { FunctionComponent } from "react";
import { Session } from "next-auth";
import { CldImage } from "next-cloudinary";
import { noProfileImage } from "@/utils/noProfileImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Patient } from "@/types";
import { toggleFavorite } from "@/utils/toggleFavorite";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

interface UserInterface {
  paciente: {
    name: string;
    email: string;
    image: string;
    _id: string;
    isArchived: boolean;
  };
  session: Session | null;
  favoritesLoading: boolean;
  isFavorites: boolean;
}

const PatientCard: FunctionComponent<UserInterface> = ({
  paciente,
  session,
  favoritesLoading,
  isFavorites,
}) => {
  const queryClient = useQueryClient();

  const handleArchivePatient = async (id: string) => {
    const response = await fetch(`/api/pacientes?id=${id}`, {
      method: "PATCH",
    });

    const data = await response.json();
    return data;
  };

  const archiveMutation = useMutation(handleArchivePatient, {
    onMutate: (patientId) => {
      // Backup the current patients list
      const previousPatients = queryClient.getQueryData(["pacientes"]);

      // Optimistically update the cache
      queryClient.setQueryData(
        ["pacientes"],
        (current: Patient[] | undefined) => {
          return current?.map((patient) => {
            if (patient._id === patientId) {
              // Check if isArchived exists and toggle, if not, set it to true
              return {
                ...patient,
                isArchived: patient.hasOwnProperty("isArchived")
                  ? !patient.isArchived
                  : true,
              };
            }
            return patient;
          });
        }
      );

      // Return the previous patients list to rollback on error
      return { previousPatients };
    },
    onError: (err, patientId, context: any) => {
      // If the mutation fails, roll back to the previous state
      if (context?.previousPatients) {
        queryClient.setQueryData(["pacientes"], context.previousPatients);
      }
    },
  });

  const favoriteMutation = useMutation(toggleFavorite, {
    onMutate: ({ _id, method }) => {
      queryClient.cancelQueries(["favorites"]);
      const previousFavorites =
        queryClient.getQueryData<string[]>(["favorites"]) || [];

      if (Array.isArray(previousFavorites)) {
        if (method === "DELETE") {
          queryClient.setQueryData(
            ["favorites"],
            previousFavorites.filter((fav) => fav !== _id)
          );
        } else {
          queryClient.setQueryData(["favorites"], [...previousFavorites, _id]);
        }
      }

      return { previousFavorites };
    },
  });

  return (
    <li
      key={paciente._id}
      className="py-4 space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-full h-[50px] min-w-[50px] border-2 overflow-hidden relative">
          <Link href={`/pacientes/${paciente._id}`}>
            <CldImage
              alt={`foto de ${paciente.name}`}
              src={paciente.image || noProfileImage}
              fill
              className="absolute object-cover"
            />
          </Link>
        </div>
        <Link href={`/pacientes/${paciente._id}`}>
          <div className="flex flex-col">
            <p className="text-lg font-medium">{paciente.name}</p>
            {paciente.isArchived && (
              <p className="text-sm text-slate-400 font-medium">(archivado)</p>
            )}
          </div>
        </Link>

        <div className="ml-auto flex gap-2">
          <button
            className={`${
              favoritesLoading
                ? "animate-pulse"
                : isFavorites
                ? "text-yellow-500 hover:text-black"
                : "text-black hover:text-yellow-500"
            } w-6`}
            onClick={(e) => {
              e.preventDefault();
              const method = isFavorites ? "DELETE" : "POST";
              favoriteMutation.mutate({ _id: paciente._id, method });
            }}
          >
            <FontAwesomeIcon
              size="lg"
              icon={isFavorites ? faStar : farStar}
            />
          </button>

          {session?.user && (
            <button
              className="hover:text-green-500 transition"
              onClick={(e) => {
                e.preventDefault();
                router.push(
                  `/chat/${(session?.user?.email as string).split("@")[0]}y${
                    paciente.name
                  }`
                );
              }}
            >
              <FontAwesomeIcon
                size="lg"
                icon={faMessage}
              />
            </button>
          )}

          {session?.user && (
            <button
              className="hover:text-blue-500 transition"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/videocall?name=${paciente.name}`);
              }}
            >
              <FontAwesomeIcon
                size="lg"
                icon={faVideoCamera}
              />
            </button>
          )}

          <button
            className="hover:text-blue-500 transition"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/pacientes/edit/${paciente._id}`);
            }}
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              size="lg"
            />
          </button>

          <button
            className="hover:text-yellow-500 transition"
            onClick={(e) => {
              e.preventDefault();
              archiveMutation.mutate(paciente._id);
            }}
          >
            <FontAwesomeIcon
              icon={faBoxArchive}
              size="lg"
            />
          </button>
        </div>
      </div>
    </li>
  );
};

export default PatientCard;
