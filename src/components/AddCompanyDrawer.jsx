import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { addNewCompany } from "@/api/apiCompanies";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        (file[0] && file[0].type.includes("png")) ||
        file[0].type.includes("jpeg"),
      { message: "Only Images are allowed" }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const onSubmit = (companyData) => {
    try {
      addNewCompany({
        ...companyData,
        logo: "",
      });
    } catch (error) {
      console.error("Error adding new company:", error);
    } finally {
      fetchCompanies();
    }
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>

        <form className="flex gap-4 p-4 pb-0">
          <Input placeholder="Company Name" {...register("name")} />
          <Input
            type="file"
            accept="image/*"
            className="file:text-gray-500"
            {...register("logo")}
          />
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-40"
          >
            Add
          </Button>
        </form>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
