import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";

const Doctores = () => {
  const router = useRouter();
  const id = router.query.id;

  const [responseOk, setResponseOk] = useState<boolean>(false);

  const sendData = async (data: { [key: string]: string }) => {
    const response = await fetch("/api/formulario/doctores", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setResponseOk(true);

      setTimeout(() => {
        setResponseOk(false);
      }, 3000);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formElement = e.target as HTMLFormElement;

    const formDataObject = new FormData(formElement);

    const formData: { [key: string]: string } = {};
    formDataObject.forEach((value, key) => {
      formData[key] = value.toString();
    });

    sendData(formData);

    formElement.reset();
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between py-10 px-4 sm:px-8 lg:px-36 xl:px-64 lg:gap-8 xl:gap-24 min-h-screen bg-stone-200">
      <div className="flex-1 mx-auto">
        <div className="text-red-500 text-3xl mb-10 font-semibold">
          Conectá con una amplia red de pacientes
        </div>
        <h2 className="text-5xl font-bold mb-10 text-slate-800">
          ¿Sos un profesional médico buscando incrementar tu lista de pacientes?
          facilitamos ese proceso.
        </h2>
        <p className="mb-10 text-slate-800 text-3xl font-semibold">
          ¿Por qué elegirnos? Ofrecemos conexión directa con pacientes
          eliminando la necesidad de invertir en publicidad. Te conectamos con
          pacientes reales.
        </p>
      </div>

      <div className="max-w-sm mx-auto h-fit p-6 xl:p-12 xl:mt-6 border rounded shadow-lg bg-white">
        <p className="mb-4 text-center font-semibold ">
          Solo cobramos una pequeña tarifa por cada paciente que agende una cita
          a través de nuestra plataforma.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="hidden"
              name="id"
              defaultValue={id}
            />
            <label
              htmlFor="firstName"
              className=""
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="tlf"
              className=""
            >
              Teléfono
            </label>
            <input
              type="text"
              id="tlf"
              name="tlf"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className=""
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border rounded"
            />
          </div>
          <button className="w-full p-2 bg-red-500 text-white rounded font-semibold text-lg">
            {responseOk ? "Enviado!" : "¡Registrate Ahora!"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Doctores;
