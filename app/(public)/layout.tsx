import NavbarCrew from "@/components/navbar-crew";
import { Toaster } from "sonner";

const CrewUploadLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavbarCrew />
      <div className="flex justify-center">
        <div className="p-5 w-full md:max-w-[1140px]">{children}</div>
        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default CrewUploadLayout;
