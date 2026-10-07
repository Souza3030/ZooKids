import { signInAnonymously } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { OrderItem } from "./orders";

export async function placeOrder(
  customerName: string,
  items: OrderItem[],
): Promise<string> {
  if (!auth || !db) throw new Error("O Firebase ainda não foi configurado.");
  if (!auth.currentUser) await signInAnonymously(auth);
  const result = await addDoc(collection(db, "orders"), {
    customerName: customerName.trim(),
    items,
    status: "novo",
    source: "site",
    createdAt: serverTimestamp(),
  });
  return result.id;
}
