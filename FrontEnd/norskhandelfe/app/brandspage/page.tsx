import Brand from "@/components/Brand";

const BrandPage = () => {
  return (
    <section className="min-h-screen bg-purple-50 py-10">
      <div className="max-w-7xl mx-auto px-6 space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Brands
          </h1>
          <p className="text-sm text-gray-500">
            Manage product brands
          </p>
        </div>

        <Brand/>

      </div>
    </section>
  );
};

export default BrandPage;
