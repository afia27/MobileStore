import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <Card className="inline-block px-8 py-10 bg-stone-900 border-stone-800 text-stone-100">
        <h1 className="text-3xl font-semibold mb-3">Payment successful</h1>
        <p className="text-stone-400 mb-6">Thank you for your purchase. Your order is being processed.</p>
        <a href="/">
          <Button variant="secondary">Return to home</Button>
        </a>
      </Card>
    </div>
  );
}


