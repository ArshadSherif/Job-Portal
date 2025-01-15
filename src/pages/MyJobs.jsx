import CreatedApplications from "@/components/CreatedApplications";
import CreatedJobs from "@/components/CreatedJobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4 " width={"100%"} color="#36d7b7" />;
  }
  return (
    <div>
      <h1 className="pb-8 text-5xl font-extrabold text-center gradient-title sm:text-7xl">
        {user?.unsafeMetadata?.role === "recruiter"
          ? "My Jobs"
          : "My Applications"}
      </h1>

      {user?.unsafeMetadata?.role === "recruiter" ? (
        <CreatedJobs />
      ) : (
        <CreatedApplications />
      )}
    </div>
  );
};

export default MyJobs;
