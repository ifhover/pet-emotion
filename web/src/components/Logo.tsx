import Link from "next/link";

type Props = {
  className?: string;
};
export default function Logo(props: Props) {
  return (
    <Link
      className={`text-xl font-bold text-transparent from-primary-700 to-primary-600 bg-gradient-to-r bg-clip-text ${props.className}`}
      href="/"
    >
      PetEmotionAI
    </Link>
  );
}
