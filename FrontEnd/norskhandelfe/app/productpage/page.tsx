import Products from "@/components/Products";

const ProductPage = () => {
  return (
    <section className="min-h-screen bg-amber-50 py-10">
      <div className="max-w-7xl mx-auto px-6 space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Products
          </h1>
          <p className="text-sm text-gray-500">
            Manage and monitor all available products
          </p>
        </div>

        <Products/>

      </div>
    </section>
  );
};

export default ProductPage;
