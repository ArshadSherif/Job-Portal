import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

export const JobCard = ({
  job,
  isMyJob = false,
  onJobSaved = () => {},
  isSaved,
}) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const [saved, setSaved] = useState(isSaved);

  const handleSaveJob = async () => {
    await saveJob(job.id, user.id);
    onJobSaved();
    setSaved(!saved);
  };

  const handleDeleteJob = async () => {
    try {
      setLoading(true);
      await deleteJob(job.id);
      onJobSaved();
    } catch (e) {
      console.error("Error deleting job:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      {loading && (
        <BarLoader className="mt-4" width={"100%"} color={"#36d7b7"} />
      )}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="cursor-pointer text-red"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        <div className="flex justify-between">
          {job.company && (
            <img src={job.company.image} alt="company-image" className="h-6" />
          )}
          <div className="flex items-center gap-2">
            <MapPinIcon size={15} />
            {job.location}
          </div>
        </div>
        <hr />
        {job?.description?.substring(0, job.description.indexOf("."))} ...
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details{" "}
          </Button>
        </Link>

        {!isMyJob && (
          <Button variant="outline" className="w-15" onClick={handleSaveJob}>
            <Heart
              size={20}
              stroke={saved ? "red" : "white"}
              fill={saved ? "red" : "none"}
              className="cursor-pointer"
            />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
