import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { ImpactProjection, LensAnalysis } from "@/types/orbit";

export async function saveLensAnalysis(userId: string, analysis: LensAnalysis) {
  const db = getFirebaseDb();

  if (!db) {
    return null;
  }

  return addDoc(collection(db, "users", userId, "lensAnalyses"), {
    ...analysis,
    createdAt: serverTimestamp()
  });
}

export async function saveSimulation(userId: string, projection: ImpactProjection) {
  const db = getFirebaseDb();

  if (!db) {
    return null;
  }

  return addDoc(collection(db, "users", userId, "simulations"), {
    ...projection,
    createdAt: serverTimestamp()
  });
}
