export default function SuccessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <div className="inline-block border rounded-lg px-8 py-10">
        <h1 className="text-3xl font-semibold mb-3">Payment successful</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your order is being processed.</p>
        <a href="/" className="inline-block border rounded px-5 py-2">Return to home</a>
      </div>
    </div>
  );
}


