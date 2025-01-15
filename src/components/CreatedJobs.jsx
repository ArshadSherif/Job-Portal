import { getCreatedJobs } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { JobCard } from "./JobCard";

const CreatedJobs = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [createdJobs, setcreatedJobs] = useState([]);

  const fetchCreatedJobs = async () => {
    try {
      setLoading(true);
      const createdJobs = await getCreatedJobs(user.id);
      setcreatedJobs(createdJobs);
    } catch (error) {
      console.error("Error fetching created jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatedJobs();
  }, []);

  if (!isLoaded || loading) {
    return <BarLoader className="mb-4 " width={"100%"} color="#36d7b7" />;
  }

  return <div>
          {loading === false ? (
            createdJobs?.length > 0 ? (
              <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
                {createdJobs.map((job) => (
                  <JobCard key={job.id} job={job} isSaved={true} isMyJob={true} onJobSaved={fetchCreatedJobs} />
                ))}
              </div>
            ) : (
              <div>No saved Jobs Found 👀</div>
            )
          ) : (
            <BarLoader className="mb-4 " width={"100%"} color="#36d7b7" />
          )}
  </div>;
};

export default CreatedJobs;
