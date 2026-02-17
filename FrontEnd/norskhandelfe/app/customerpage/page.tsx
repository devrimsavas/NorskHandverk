import Customers from "@/components/Customers";

const CustomerPage=()=> {
    return(
        <section className="min-h-screen bg-amber-50 py-10">
            <div className="max-w-7xl mx-auto px-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Customers
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage and monitor all customers
                    </p>
                </div>
                 <Customers/>
            </div>
           
        </section>
    )
}

export default CustomerPage;