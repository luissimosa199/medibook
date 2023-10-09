import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Turnos = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    telefono: "",
    horarioPreferido: "",
    obraSocial: "",
    otroEspecialista: true,
    fechaNacimiento: "",
    tipoConsulta: "cualquiera",
    provincia: "",
    localidad: "",
    dni: "",
    comentario: "",
    id: "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement; // Type assertion here
    const { name, value, type } = target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await fetch("/api/formulario/turnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      router.push("/formulario/exito");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    if (router.query.id) {
      setFormData((prevData) => ({
        ...prevData,
        id: router.query.id as string,
      }));
    }
  }, [router.query]);

  return (
    <div className="p-6 bg-gray-100 ">
      <h2 className="text-2xl font-bold mb-4">Formulario para los turnos</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md max-w-[850px] mx-auto"
      >
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          hidden
        />
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Nombre completo:
          </label>
          <input
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Teléfono:</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Horario preferido para la consulta:
          </label>
          <input
            type="text"
            name="horarioPreferido"
            value={formData.horarioPreferido}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Obra Social:</label>
          <input
            type="text"
            name="obraSocial"
            value={formData.obraSocial}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="otroEspecialista"
              checked={formData.otroEspecialista}
              onChange={handleChange}
              className="mr-2"
            />
            ¿Estás dispuesto a verte con otro especialista?
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Fecha de nacimiento:
          </label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <span className="text-sm font-medium">Tipo de consulta:</span>
          <div className="mt-2">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                name="tipoConsulta"
                value="presencial"
                checked={formData.tipoConsulta === "presencial"}
                onChange={handleChange}
                className="mr-2"
              />
              Presencial
            </label>
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                name="tipoConsulta"
                value="videoconferencia"
                checked={formData.tipoConsulta === "videoconferencia"}
                onChange={handleChange}
                className="mr-2"
              />
              Videoconferencia
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoConsulta"
                value="cualquiera"
                checked={formData.tipoConsulta === "cualquiera"}
                onChange={handleChange}
                className="mr-2"
              />
              Cualquiera
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Localidad:</label>
          <input
            type="text"
            name="localidad"
            value={formData.localidad}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Provincia:</label>
          <input
            type="text"
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">DNI:</label>
          <input
            type="number"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Comentario:</label>
          <textarea
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Turnos;
