import { db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function getJobswithCompanies({
  location,
  company_id,
  searchQuery,
}) {
  try {
    const jobCollectionRef = collection(db, "jobs");
    let jobQuery = jobCollectionRef;

    //! TODO: Fix the filters not woking together */

    // const filters = [];
    // if (location) {
    //   filters.push(where("location", "==", location));
    // }
    // if (company_id) {
    //   const companyDocRef = doc(db, "companies", company_id);
    //   filters.push(where("companyId", "==", companyDocRef));
    // }
    // if (searchQuery) {
    //   filters.push(
    //     where("title", ">=", searchQuery),
    //     where("title", "<=", searchQuery + "\uf8ff")
    //   );
    // }

    // // Apply all filters
    // if (filters.length > 0) {
    //   jobQuery = query(jobCollectionRef, ...filters);
    // }

    // const data = await getDocs(jobQuery);

    if (location) {
      jobQuery = query(jobQuery, where("location", "==", location));
    }
    if (company_id) {
      const companyDocRef = doc(db, "companies", company_id);
      jobQuery = query(jobQuery, where("companyId", "==", companyDocRef));
    }
    if (searchQuery) {
      jobQuery = query(
        jobQuery,
        where("title", ">=", searchQuery),
        where("title", "<=", searchQuery + "\uf8ff")
      );
    }

    // Execute the query
    const data = await getDocs(jobQuery);

    // Fetch company details for each job
    const jobsWithCompanies = await Promise.all(
      data.docs.map(async (doc) => {
        const jobData = doc.data();

        let companyData = {};
        if (jobData.companyId) {
          const companySnapshot = await getDoc(jobData.companyId);
          if (companySnapshot.exists()) {
            companyData = companySnapshot.data();
          }
        }

        return {
          id: doc.id,
          ...jobData,
          company: companyData,
        };
      })
    );
    console.log("Jobs with company data:", jobsWithCompanies);
    return jobsWithCompanies;
  } catch (error) {
    console.error("Error fetching jobs with company data:", error);
  }
}

export async function getSavedJobs(user_id) {
  const savedJobsCollectionRef = collection(db, "savedJobs");
  const savedJobsQuery = query(
    savedJobsCollectionRef,
    where("userId", "==", user_id)
  );
  const savedJobsSnapshot = await getDocs(savedJobsQuery);
  const savedJobs = await Promise.all(
    savedJobsSnapshot.docs.map(async (doc) => {
      const jobSnapshot = await getDoc(doc.data().jobId);
      let companyData = {};
      if (jobSnapshot.data().companyId) {
        const companySnapshot = await getDoc(jobSnapshot.data().companyId);
        if (companySnapshot.exists()) {
          companyData = companySnapshot.data();
        }
      }
      return {
        id: jobSnapshot.id,
        ...jobSnapshot.data(),
        company: companyData,
      };
    })
  );
  return savedJobs;
}

export async function saveJob(job_id, user_id) {
  try {
    const savedJobsCollectionRef = collection(db, "savedJobs");
    const jobDocRef = doc(db, "jobs", job_id);
    const savedJobsQuery = query(
      savedJobsCollectionRef,
      where("userId", "==", user_id),
      where("jobId", "==", jobDocRef)
    );
    const savedJobsSnapshot = await getDocs(savedJobsQuery);
    if (savedJobsSnapshot.docs.length > 0) {
      const jobToDelete = savedJobsSnapshot.docs[0];
      const docRef = doc(db, "savedJobs", jobToDelete.id);
      await deleteDoc(docRef);
      console.log(" iside saveJobs in apiJobs, Job deleted:");
    } else {
      await addDoc(savedJobsCollectionRef, {
        userId: user_id,
        jobId: jobDocRef,
        createdAt: serverTimestamp(),
      });
      console.log(" iside saveJobs in apiJobs, Job added:");
    }
  } catch (e) {
    console.error("Error saving job:", e);
  }
}

export async function getSingleJob(job_id) {
  const jobDocRef = doc(db, "jobs", job_id);
  const jobSnapshot = await getDoc(jobDocRef);

  let companyData = {};
  if (jobSnapshot.data().companyId) {
    const companySnapshot = await getDoc(jobSnapshot.data().companyId);
    if (companySnapshot.exists()) {
      companyData = companySnapshot.data();
    }
  }
  return {
    id: jobSnapshot.id,
    ...jobSnapshot.data(),
    company: companyData,
  };
}

export const updateHiringStatus = async (job_id, isOpen) => {
  try {
    const jobDocRef = doc(db, "jobs", job_id);

    await updateDoc(jobDocRef, {
      isOpen: isOpen,
    });
  } catch (error) {
    console.error("Error updating hiring status:", error);
  }
};

export const addNewJob = async (jobData) => {
  console.log("inside addNewJob in apiJobs, jobData:", jobData);
  const jobCollectionRef = collection(db, "jobs");
  try {
    // Convert companyId to a document reference
    if (jobData.companyId) {
      jobData.companyId = doc(db, "companies", jobData.companyId);
    }
    await addDoc(jobCollectionRef, jobData);
  } catch (error) {
    console.error("Error adding job ", error);
  }
};

export const getCreatedJobs = async (user_id) => {
  const jobCollectionRef = collection(db, "jobs");
  const jobQuery = query(jobCollectionRef, where("recruiterId", "==", user_id));
  const jobSnapshot = await getDocs(jobQuery);
  const jobs = jobSnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  return jobs;
};

export const deleteJob = async (job_id) => {
  try {
    const jobDocRef = doc(db, "jobs", job_id);
    await deleteDoc(jobDocRef);
  } catch (error) {
    console.error("Error deleting job:", error);
  }
};
