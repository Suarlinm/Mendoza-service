"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Props = {
  children: ReactNode;
};

export default function AdminGuard({ children }: Props) {
  const router = useRouter();

  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    async function verificarUsuario() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin-login");
        return;
      }

      setVerificando(false);
    }

    verificarUsuario();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_evento, session) => {
        if (!session) {
          router.replace("/admin-login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (verificando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-yellow-500" />

          <p className="mt-4 font-semibold text-gray-600">
            Verificando acceso...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}