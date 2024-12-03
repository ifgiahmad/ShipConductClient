import ThemeToggler from "@/components/ThemeToggler";
import { Toaster } from "sonner";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh] flex items-center justify-center relative">
      <div className="absolute bottom-5 right-0 text-white">
        <ThemeToggler />
      </div>
      {children}
      <Toaster position="top-right" />
    </div>
  );
};

export default AuthLayout;
