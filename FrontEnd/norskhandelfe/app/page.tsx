export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <main className="max-w-6xl mx-auto px-6 space-y-16">

        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900">
            NorskHandel
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A structured commerce backend built with ASP.NET Core,
            designed for scalability, performance, and seamless AI integration.
          </p>
        </section>

        {/* Core Vision */}
        <section className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Enterprise Backend
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Clean architecture, domain-driven design, and full C# backend control.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              AI-Ready Infrastructure
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Built to integrate modern AI-powered commerce systems and automation engines.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Structured Administration
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Manage products, customers, brands, categories, and carts with precision.
            </p>
          </div>

        </section>

        {/* Vision Statement */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Intelligent Commerce Infrastructure
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            NorskHandel is not just an admin dashboard — it is a backend-first
            commerce foundation built to evolve into AI-driven trade systems.
          </p>
        </section>

      </main>
    </div>
  );
}
