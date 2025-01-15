import { db } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const applyToJob = async (data) => {
  try {
    const applicationsRef = collection(db, "jobs", data.jobId, "applications");
    await addDoc(applicationsRef, data);
  } catch (error) {
    console.error("Error adding application ", error);
  }
};

export const hasUserApplied = async (userId, jobId) => {
  try {
    const applicationsRef = collection(db, "jobs", jobId, "applications");
    const q = query(applicationsRef, where("candidateId", "==", userId));
    const querySnapshot = await getDocs(q);

    console.log(
      "Applications matching query:",
      querySnapshot.docs.map((doc) => doc.data())
    );
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if user applied:", error);
    return false; // Return false if there's an error
  }
};

export const getApplicationsForJob = async (jobId) => {
  try {
    const applicationsRef = collection(db, "jobs", jobId, "applications");
    const querySnapshot = await getDocs(applicationsRef);

    const applications = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the applicationId
      ...doc.data(), // Spread the document data
    }));

    console.log("Applications for job inside apiApplications:", applications);
    return applications;
  } catch (error) {
    console.error("Error fetching applications for job:", error);
    return [];
  }
};

export const updateApplicationStatus = async (
  applicationId,
  jobId,
  newStatus
) => {
  try {
    const applicationDocRef = doc(
      db,
      "jobs",
      jobId,
      "applications",
      applicationId
    );

    await updateDoc(applicationDocRef, {
      status: newStatus,
    });
  } catch (e) {
    console.error("Error updating application status:", e);
  }
};

// export const getApplicationsByUser = async (userId) => {
//   try {
//     const applicationsRef = collectionGroup(db, "applications");
//     const q = query(applicationsRef, where("candidateId", "==", userId));
//     const querySnapshot = await getDocs(q);

//     const applications = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     console.log("Applications for user inside apiApplications:", applications);
//     return applications;
//   } catch (error) {
//     console.error("Error fetching applications for user:", error);
//     return [];
//   }
// };


export const getApplicationsByUser = async (userId) => {
  try {
    const jobsRef = collection(db, "jobs");
    const jobsSnapshot = await getDocs(jobsRef);

    const applications = [];

    for (const jobDoc of jobsSnapshot.docs) {
      const jobId = jobDoc.id;

      try {
        const applicationsRef = collection(db, `jobs/${jobId}/applications`);
        const applicationsQuery = query(applicationsRef, where("candidateId", "==", userId));
        const applicationsSnapshot = await getDocs(applicationsQuery);

        applicationsSnapshot.docs.forEach((doc) => {
          applications.push({
            id: doc.id,
            ...doc.data(),
            jobId,
          });
        });
      } catch (e) {
        console.warn(`No applications subcollection found for jobId: ${jobId}`);
      }
    }

    console.log("Applications for user:", applications);
    return applications;
  } catch (error) {
    console.error("Error fetching applications for user:", error);
    return [];
  }
};