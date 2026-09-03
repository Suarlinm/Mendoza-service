import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />

        <main className="pt-16 lg:ml-72 lg:pt-0">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}