import { getDb } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function UserTransactionsById({ params }: { params: { user_id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session as any).userId !== params.user_id) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Unauthorized</div>;
  }
  const db = await getDb();
  const tx = await db.collection("transactions").find({ userId: params.user_id }).sort({ createdAt: -1 }).toArray();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Your transactions</h1>
      {tx.length === 0 ? (
        <p className="text-gray-600">No transactions yet.</p>
      ) : (
        <ul className="space-y-3">
          {tx.map((t: any) => (
            <li key={String(t._id)} className="border rounded p-4">
              <div className="font-medium">Order {t.orderId}</div>
              <div className="text-sm text-gray-600">Amount: ${(t.amount / 100).toFixed(2)} USD</div>
              <div className="text-sm text-gray-600">{new Date(t.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


