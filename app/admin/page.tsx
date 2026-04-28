import AdminForm from "@/components/AdminForm";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-6">
        <h1 className="font-mono text-3xl font-black uppercase text-[#1A1A1A] md:text-4xl">
          Админка
        </h1>
        <p className="mt-1 font-mono text-sm text-gray-500">
          Добавляйте и редактируйте товары. Данные хранятся в localStorage.
        </p>
      </div>
      <AdminForm />
    </div>
  );
}
