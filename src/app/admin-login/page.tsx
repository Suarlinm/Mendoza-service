"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setCargando(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-5 py-12">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500 text-black">
            <LockKeyhole size={30} />
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-white">
            Administración
          </h1>

          <p className="mt-2 text-gray-400">
            Ingresa para administrar la página web.
          </p>
        </div>

        {/* FORMULARIO */}
        <div className="rounded-2xl bg-white p-7 shadow-2xl sm:p-9">
          <h2 className="text-xl font-extrabold text-gray-900">
            Iniciar sesión
          </h2>

          <form
            onSubmit={iniciarSesion}
            className="mt-7 space-y-5"
          >
            {/* CORREO */}
            <div>
              <label
                htmlFor="correo"
                className="mb-2 block text-sm font-bold text-gray-800"
              >
                Correo electrónico
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  placeholder="admin@empresa.com"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                />
              </div>
            </div>

            {/* CONTRASEÑA */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-gray-800"
              >
                Contraseña
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* BOTÓN */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-lg bg-yellow-500 px-6 py-4 font-extrabold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando
                ? "Iniciando sesión..."
                : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <a
          href="/"
          className="mt-6 block text-center text-sm font-semibold text-gray-400 transition hover:text-white"
        >
          ← Volver a la página
        </a>
      </div>
    </main>
  );
}