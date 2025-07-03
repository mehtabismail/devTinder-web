import React from "react";

export default function Footer() {
  return (
    <footer className='footer sm:footer-horizontal footer-center bg-transparent p-4 '>
      <aside>
        <p className='mb-2 block text-xs text-[#6B7280]'>
          Copyright © {new Date().getFullYear()} - All right reserved by Mehtab
          Ismail
        </p>
        <p className='text-xs text-[#6B7280]'>
          <span className='font-semibold text-[#6B7280]'>
            About this website:
          </span>{" "}
          built with React & Next.js (App Router & Server Actions), TypeScript,
          Tailwind CSS, Framer Motion, React Email & Resend, Vercel hosting.
        </p>
      </aside>
    </footer>
  );
}
