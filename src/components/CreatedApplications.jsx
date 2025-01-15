import { getApplicationsByUser } from "@/api/apiApplications";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";

const CreatedApplications = () => {
  const { user, isLoaded } = useUser();
  const [createdApplications, setCreatedApplications] = React.useState([]);

  const fetchApplicationsForUser = async () => {
    const applications = await getApplicationsByUser(user.id);
    setCreatedApplications(applications);
  };

  useEffect(() => {
    fetchApplicationsForUser();
  }, []);

  if (!isLoaded) {
    return <BarLoader className="mb-4 " width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {createdApplications.map((application) => {
        return (
          <ApplicationCard key={application.id} application={application} isCandidate={true}/>
        );
      })}
    </div>
  );
};

export default CreatedApplications;
