import {
  faPenToSquare,
  faVideoCamera,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import router from "next/router";
import React, { FunctionComponent } from "react";
import { Session } from "next-auth";
import { CldImage } from "next-cloudinary";

interface UserInterface {
  paciente: { name: string; email: string; image: string; _id: string };
  session: Session | null;
}

const PatientCard: FunctionComponent<UserInterface> = ({
  paciente,
  session,
}) => {
  return (
    <li
      key={paciente._id}
      className="py-4 space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-full h-[110px] w-[110px] border-2 overflow-hidden relative">
          <Link href={`/pacientes/${paciente._id}`}>
            <CldImage
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

        <div className="ml-auto flex gap-2">
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
                router.push(
                  `/videocall/${
                    (session?.user?.email as string).split("@")[0]
                  }y${paciente.name}`
                );
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
        </div>
      </div>
    </li>
  );
};

export default PatientCard;
