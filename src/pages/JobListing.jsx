import { getCompanies } from "@/api/apiCompanies";
import { getJobswithCompanies, getSavedJobs } from "@/api/apiJobs";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
// import { useUser } from "@clerk/clerk-react";

export const JobListing = () => {
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(true);
  const { isLoaded, user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [companies, setCompanies] = useState([]);

  //** FOR PAGINATION START */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const totalJobs = jobs.length;

  const paginatedJobs = jobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //** PAGINATION END */

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const fetchedJobs = await getJobswithCompanies({
        location,
        company_id,
        searchQuery,
      });
      setJobs(fetchedJobs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const SavedJobs = await getSavedJobs(user.id);
      const jobIds = SavedJobs.map((job) => job.jobId.id);
      setSavedJobs(new Set(jobIds));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompanies = async () => {
    const companyData = await getCompanies();
    setCompanies(companyData);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setLocation("");
    setCompany_id("");
    setSearchQuery("");
  };

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedJobs();
    }

    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, company_id, location]);

  if (!isLoaded) {
    return <BarLoader className="mb-4 " width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="pb-8 text-6xl font-extrabold text-center sm:text-7xl gradient-title">
        Latest Jobs
      </h1>
      {/* // TODO : add filters  */}

      <form
        onSubmit={handleSearch}
        className="flex items-center w-full gap-2 mb-3 h-14"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title..."
          className="flex-1 h-full px-4 text-md"
          name="search-query"
        />

        <Button variant="blue" type="submit " className="h-full sm:w-28">
          Search
        </Button>
      </form>

      <div className="flex flex-col gap-2 sm:flex-row ">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies.map(({ name, id }) => {
                return (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="destructive"
          className="sm:w-1/2"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4 mb-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && jobs?.length > 0 && (
        <>
          <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedJobs.map((job) => (
              <JobCard key={job.id} job={job} isSaved={savedJobs.has(job.id)} />
            ))}
          </div>

          {/* //* Pagination */}

          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {[...Array(Math.ceil(totalJobs / pageSize)).keys()].map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={() => handlePageChange(page + 1)}
                        className={currentPage === page + 1 ? "active" : ""}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(
                        Math.min(
                          Math.ceil(totalJobs / pageSize),
                          currentPage + 1
                        )
                      )
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};
