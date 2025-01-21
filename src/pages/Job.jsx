import { getApplicationsForJob, hasUserApplied } from "@/api/apiApplications";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import ApplicationCard from "@/components/ApplicationCard";
import ApplyJobDrawer from "@/components/ApplyJob";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/clerk-react";

import MDEditor from "@uiw/react-md-editor";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

export const Job = () => {
  const { user, isLoaded } = useUser();
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applications, setApplications] = useState([]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      const jobData = await getSingleJob(id);
      setJob(jobData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (job?.id) {
      try {
        const application = await getApplicationsForJob(job.id);
        setApplications(application);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    }
  };

  const handleStatusChange = async (value) => {
    const isOpen = value === "open";
    await updateHiringStatus(id, isOpen);
    fetchJobData();
  };

  useEffect(() => {
    async function checkIfApplied() {
      if (job?.id && user?.id) {
        const applied = await hasUserApplied(user.id, job.id);
        setHasApplied(applied);
      }
    }
    checkIfApplied();
  }, [job?.id, user?.id]);

  useEffect(() => {
    fetchJobData();
  }, []);

  useEffect(() => {
    if (job?.id) {
      fetchApplications();
    }
  }, [job]);

  if (loading || !isLoaded) {
    return <BarLoader className="mb-4 " width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col items-center justify-between gap-6 reverse md:flex-row">
        <h1 className="pb-3 text-4xl font-extrabold gradient-title sm:text-6xl">
          {job?.title}
        </h1>
        <img
          src={job?.company?.image}
          className="h-12"
          alt={job?.company?.name}
        />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {job.location}
        </div>

        <div className="flex gap-2">
          <Briefcase /> {applications?.length} Applicants
        </div>

        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen />
              Open
            </>
          ) : (
            <>
              <DoorClosed />
              Closed
            </>
          )}
        </div>
      </div>

      {/* //**Hiring Status */}

      {user?.id === job?.recruiterId && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}
          >
            <SelectValue
              placeholder={
                "Hiring Status: " + (job?.isOpen ? "Open" : "Closed")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl font-bold sm:text-3xl">About the Job</h2>
      <p className="sm:text-lg">{job?.description}</p>
      <h2 className="text-2xl font-bold sm:text-3xl">
        What we are looking for{" "}
      </h2>

      {/* //** FIx this thing */}

      <MDEditor.Markdown
        source={job?.requirements}
        className="bg-transparent custom-markdown sm:text-lg"
      />

      {user?.id !== job?.recruiterId && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fetchJobData}
          applied={hasApplied}
        />
      )}

      {/* render Applications */}

      {applications?.length > 0 && job?.recruiterId === user.id && (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold sm:text-3xl">Applications</h2>
          {applications.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} />
            );
          })}
        </div>
      )}
    </div>
  );
};
