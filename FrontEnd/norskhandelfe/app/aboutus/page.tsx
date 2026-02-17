const AboutUs = () => {
  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-10">

        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About NorskHandel
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            NorskHandel is a backend-first commerce infrastructure built with
            ASP.NET Core and structured around clean architecture principles.
            The project focuses on creating a scalable and maintainable
            trade system designed for real-world commerce operations.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Purpose
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The goal of NorskHandel is to establish a fully structured backend
            environment where products, customers, brands, categories, and carts
            are managed through well-defined domain logic and API layers.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            This platform is designed to evolve into an AI-integrated commerce
            system, capable of interacting with modern AI-powered trade platforms.
            The architecture supports automation, intelligent data handling,
            and scalable commerce workflows.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700 text-sm leading-relaxed">
            NorskHandel represents the foundation of intelligent commerce —
            where strong backend engineering meets the future of AI-driven trade.
          </p>
        </div>

      </div>
    </section>
  )
}

export default AboutUs
