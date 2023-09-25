import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row md:justify-around p-10 bg-base-200 text-base-content">
      <div className="flex flex-col gap-2 mb-4">
        <Link href="/">
          <span className="hover:underline">Homepage</span>
        </Link>

        <Link href="/perfil">
          <span className="hover:underline">Perfil</span>
        </Link>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <Link href="/videocall">
          <span className="hover:underline">Iniciar consulta</span>
        </Link>

        <Link href="/pacientes">
          <span className="hover:underline">Pacientes</span>
        </Link>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <Link href="/videocall">
          <span className="hover:underline">Videollamadas</span>
        </Link>
      </div>

      {/* <div className="mb-4">
        <span className="mb-4 font-semibold uppercase opacity-50">
          Newsletter
        </span>

        <div className="flex flex-col w-80">
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="username@site.com"
              className="h-12 pl-4 text-base leading-6 border rounded w-full pr-16"
            />
            <button className="bg-blue-400 px-4 h-full absolute top-0 right-0 text-white rounded rounded-l-none">
              Suscribite
            </button>
          </div>
        </div>
      </div> */}

      {/* <div className="flex flex-col gap-2 mb-4">
        <span className="mb-2 font-semibold uppercase opacity-50">Links</span>
        <ul>
          <li className="mb-2">
            <Link href="/ejercicio">
              <span className="hover:underline">Ejercicios</span>
            </Link>
          </li>
          <li>
            <Link href="/comidas">
              <span className="hover:underline">Comidas</span>
            </Link>
          </li>
        </ul>
      </div> */}
    </footer>
  );
};

export default Footer;
