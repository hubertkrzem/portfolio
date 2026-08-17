import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonOptions {
  label?: string;
  link?: string;
}

type ButtonProps = ButtonOptions & ButtonHTMLAttributes<HTMLButtonElement>;

const baseClassName = `py-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 font-bold text-2xl text-center  transition-colors`;

export default function Button({ label, link, className, ...props }: ButtonProps) {
  const combinedClassName = `${baseClassName} ${className ?? ""}`.trim();

  if (link) {
    if (link.startsWith("#")) {
      return (
        <a href={link} className={combinedClassName}>
          {label}
        </a>
      );
    }

    return (
      <Link href={link} className={combinedClassName}>
        {label}
      </Link>
    );
  }

  return (
    <button {...props} className={combinedClassName}>
      {label}
    </button>
  );
}
