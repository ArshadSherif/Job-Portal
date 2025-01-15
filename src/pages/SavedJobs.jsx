import { getSavedJobs } from "@/api/apiJobs";
import { JobCard } from "@/components/JobCard";
import { useUser } from "@clerk/clerk-react";

import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

export const SavedJobs = () => {
  const { isLoaded, user } = useUser();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      setLoadingJobs(true);
      const savedJobs = await getSavedJobs(user.id);
      setSavedJobs(savedJobs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingJobs(false);
    }
  };


  useEffect(() => {
    if (isLoaded) {
      fetchSavedJobs();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <BarLoader className="mb-4 " width={"100%"} color="#36d7b7" />;
  }
  return (
    <div>
      <h1 className="pb-8 text-6xl font-extrabold text-center gradient-title sm:text-7xl">
        SavedJobs
      </h1>

      {loadingJobs === false ? (
        savedJobs?.length > 0 ? (
          <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} isSaved={true} onJobSaved={fetchSavedJobs} />
            ))}
          </div>
        ) : (
          <div>No saved Jobs Found 👀</div>
        )
      ) : (
        <BarLoader className="mb-4 " width={"100%"} color="#36d7b7" />
      )}
    </div>
  );
};
