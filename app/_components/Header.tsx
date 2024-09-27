"use client";
import { Button } from "@/components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <nav
      className="bg-transparent py-4 px-4 fixed top-0 left-0 z-20 lg:px-16 xl:py-4 w-full md:px-8 xl:px-24 xxl:px-40"
      id="navbar"
    >
      <div className="flex items-center justify-between gap-4 relative">
        <div
          className="mb-2 sm:mb-0 flex flex-row
      "
        >
          <div>
            <Link
              href="/"
              className="text-3xl no-underline text-blue-700 font-sans font-bold max-[430px]:text-[20px]"
            >
              Byte<span className="text-green-800">Webster</span>
            </Link>
          </div>
        </div>

        <div className="w-1/2 text-right sm:hidden">
          <button type="button" className="navbar-toggler">
            <span className="navbar-toggler-bar"></span>
            <span className="navbar-toggler-bar"></span>
            <span className="navbar-toggler-bar"></span>
          </button>
        </div>

        <div className="w-full hidden justify-center navigation-menu xl:flex relative">
          <div className="flex flex-col md:flex-row pt-8 pb-2 md:pt-0 md:pb-0 md:items-center relative">
            <Link href="#" className="font-semibold hover:text-gray-600">
              Rates
            </Link>
            <Link
              href="#"
              className="block mt-4 font-semibold max-w-3xl md:ml-6 lg:inline hover:text-gray-600 md:mt-0"
            >
              About Us
            </Link>
            <Link
              href="#"
              className="block mt-3 font-semibold md:ml-6 hover:text-gray-600 md:mt-0 menu_item"
            >
              Resources
            </Link>
            <Link
              href="#"
              className="block mt-3 font-semibold md:ml-6 hover:text-gray-600 md:mt-0"
            >
              FAQs
            </Link>
            <Link
              href="#"
              className="block mt-3 font-semibold md:ml-6 hover:text-gray-600 md:mt-0"
            >
              Services
            </Link>
          </div>
        </div>
        <div className="flex gap-5">
          <LoginLink>
            {" "}
            <Button variant="ghost" className="font-semibold">
              Login
            </Button>
          </LoginLink>
          <RegisterLink>
            <Button>Get Started</Button>
          </RegisterLink>
        </div>
      </div>
    </nav>
  );
}

export default Header;
