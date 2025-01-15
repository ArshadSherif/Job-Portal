import { db } from "@/firebase/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export async function getCompanies() {
  const companyCollectionRef = collection(db, "companies");
  const companySnaphot = await getDocs(companyCollectionRef);
  const companies = companySnaphot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("inside getCompaniesAPI companies:", companies);
  return companies;
}

export async function addNewCompany(companyData) {
  const companyCollectionRef = collection(db, "companies");
  await addDoc(companyCollectionRef, companyData);
}
