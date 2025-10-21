import { Spin } from "antd";

export type Props = {
  children: React.ReactNode;
  type?: "primary" | "normal";
  onClick?: () => void;
  loading?: boolean;
  className?: string;
};

export default function PetButton({ children, type = "normal", onClick, loading = false, className }: Props) {
  return (
    <div
      className={`rounded-xl  text-base font-bold py-2 px-4 text-center inline-flex items-center justify-center
        ${type === "primary" ? "bg-primary-500 text-white hover:bg-primary-400" : ""}
        ${type === "normal" ? "bg-primary-50 shadow-2xs border-dashed border-2 border-primary-400 text-primary-600 hover:bg-primary-100" : ""}
        ${loading ? "cursor-not-allowed" : "cursor-pointer"}
        ${className}
        `}
      onClick={() => (loading ? null : onClick?.())}
    >
      {loading ? <Spin className="mr-2" size="small" /> : null}
      {children}
    </div>
  );
}
