import Category from "@/components/Category";

const CategoryPage = () => {
  return (
    <section className="min-h-screen bg-emerald-50 py-10">
      <div className="max-w-7xl mx-auto px-6 space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Categories
          </h1>
          <p className="text-sm text-gray-500">
            Manage product categories
          </p>
        </div>

        <Category />

      </div>
    </section>
  );
};

export default CategoryPage;
