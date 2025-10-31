import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";

const AdminVisits = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Visitas</h1>
          <p className="text-muted-foreground">Em desenvolvimento...</p>
        </div>
      </main>
    </div>
  );
};

export default AdminVisits;
