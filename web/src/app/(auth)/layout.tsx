import Logo from "@/components/Logo";
import "./style.scss";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-[100vh] bg-gray-100">
      <div className="container mx-auto flex flex-col items-center">
        <div className="pt-10 pb-5">
          <Logo className="text-3xl!" />
        </div>
        {children}
      </div>
    </div>
  );
}
