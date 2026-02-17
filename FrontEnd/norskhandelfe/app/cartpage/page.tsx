import Cart from '@/components/Cart'

const CartPage = () => {
  return (
    <section className="min-h-screen bg-rose-50 py-10">
      <div className="max-w-7xl mx-auto px-6 space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Carts
          </h1>
          <p className="text-sm text-gray-500">
            Monitor active customer carts
          </p>
        </div>

        <Cart />

      </div>
    </section>
  )
}

export default CartPage;
