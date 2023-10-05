import React from "react";

const FormExito = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">¡Éxito!</h2>
        <p className="mb-4">
          La información se ha registrado exitosamente, gracias.
        </p>
        <div className="flex space-x-4">
          <a
            href="https://doxadoctor.com"
            className="text-blue-500 hover:underline text-lg font-semibold"
          >
            Ir a doxadoctor.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default FormExito;
