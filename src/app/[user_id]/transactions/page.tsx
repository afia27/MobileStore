import { getDb } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Card } from "@/components/ui/card";

export default async function UserTransactionsById({ params }: { params: { user_id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session as any).userId !== params.user_id) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-stone-100">Unauthorized</div>;
  }
  const db = await getDb();
  const tx = await db.collection("transactions").find({ userId: params.user_id }).sort({ createdAt: -1 }).toArray();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4 text-stone-100">Your transactions</h1>
      {tx.length === 0 ? (
        <p className="text-stone-400">No transactions yet.</p>
      ) : (
        <ul className="space-y-3">
          {tx.map((t: any) => (
            <li key={String(t._id)}>
              <Card className="p-4 bg-stone-900 border-stone-800 text-stone-100">
                <div className="font-medium">Order {t.orderId}</div>
                <div className="text-sm text-stone-400">Amount: ${(t.amount / 100).toFixed(2)} USD</div>
                <div className="text-sm text-stone-400">{new Date(t.createdAt).toLocaleString()}</div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


