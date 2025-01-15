import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplications";
import { Button } from "./ui/button";

const ApplicationCard = ({ application, isCandidate = false }) => {
  //!! Finish this function
  const handleDownload = () => {
    console.log("Download resume");
  };
  const handleStatusChange = (status) => {
    updateApplicationStatus(application.id, application.jobId, status);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company}`
            : `${application?.name}`}
          <Download
            size={18}
            className="w-8 h-8 text-black bg-white rounded-full p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col justify-between md:flex-row">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={15} />
            {application?.experience} years of experience
          </div>
          <div className="flex items-center gap-2">
            <School size={15} />
            {application?.education}
          </div>
          <div className="flex items-center gap-2">
            <Boxes size={15} />
            Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>

      <CardFooter className="flex justify-between">
        <span>{new Date(application?.createdAt).toLocaleString()}</span>
        {isCandidate ? (
          <span className="font-bold capitalize">
            Status:{application?.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
