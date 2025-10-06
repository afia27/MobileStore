export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">Online Mobile Store</h1>
      <p className="mb-6">Welcome! Browse our <a className="text-blue-600 underline" href="/products">products</a> and add them to your cart.</p>
      <a className="border rounded px-4 py-2" href="/cart">Go to Cart</a>
    </main>
  );
}
