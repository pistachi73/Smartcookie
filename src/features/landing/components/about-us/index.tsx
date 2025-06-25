"use client";

import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import { UserGroupIcon } from "@hugeicons-pro/core-solid-rounded";

import { cn } from "@/shared/lib/classes";
import Image from "next/image";
import { LandingSectionHeader } from "../landing-section-header";
import martinaImage from "./assets/martina.jpg";
import oscarImage from "./assets/oscar.jpeg";
const teamMembers = [
  {
    name: "Martina Monreal",
    role: "Co-Founder & CEO",
    experience: "9+ years teaching languages",
    image: martinaImage,
    bio: "Since 2016, Martina has taught over 4,000 hours to more than 1,000 students of Spanish, Catalan, English, and German. She speaks at global teaching events and actively develops her teaching expertise through training. With a background in Mathematics, Business, and Psychology, Martina integrates a deep understanding of learning and teaching with real-world practice.",
    companies: [
      {
        src: "/logos/adidas_logo.svg",
        alt: "Adidas Logo",
        id: "martina-adidas-logo",
      },
      {
        src: "/logos/astrazeneca_text_logo.svg",
        alt: "AstraZeneca Logo",
        id: "martina-astrazeneca-logo",
      },
      {
        src: "/logos/IBM_logo.svg",
        alt: "IBM Logo",
        id: "martina-ibm-logo",
      },
      {
        src: "/logos/roche_Logo.svg",
        alt: "Roche Logo",
        id: "martina-roche-logo",
      },
      {
        src: "/logos/uab_logo.svg",
        alt: "UAB Logo",
        id: "martina-uab-logo",
      },
      {
        src: "/logos/coca_cola_logo.svg",
        alt: "Coca-Cola Logo",
        id: "martina-coca-cola-logo",
      },
    ],
    reversed: false,
  },
  {
    name: "Óscar Pulido",
    role: "Co-Founder & CTO",
    experience: "7+ years developing software",
    image: oscarImage,
    bio: "Since 2018, Óscar has coded thousands of hours building full-stack applications across diverse industries. He currently works as a Frontend Engineer at Gartner, tackling complex challenges in an international, cutting-edge environment. Always eager to expand his skills, Óscar continuously explores new technologies like Web3, smart contracts, and creative fields such as graphic design and 2D animation.",
    companies: [
      {
        src: "/logos/gartner_logo.svg",
        alt: "Gartner Logo",
        id: "oscar-gartner-logo",
      },
      {
        src: "/logos/boehringer_ingelheim_logo.svg",
        alt: "Boehringer Ingelheim Logo",
        id: "oscar-boehringer-logo",
      },
      {
        src: "/logos/new_work_logo.svg",
        alt: "New Work Logo",
        id: "oscar-newwork-logo",
      },
    ],
    reversed: true,
  },
];

export const AboutUs = () => {
  return (
    <MaxWidthWrapper
      as="section"
      id="about"
      className="items-center h-full flex justify-center flex-col space-y-12"
    >
      {/* Header Section */}
      <LandingSectionHeader
        title="The faces behind SmartCookie"
        description="A language teacher and a software developer with over 15 years of combined experience, uniting forces to empower busy professionals like you."
        badge="About us"
        icon={UserGroupIcon}
      />

      <div className="space-y-14">
        {teamMembers.map(
          ({ name, role, experience, image, bio, companies, reversed }) => (
            <article
              key={name}
              className="grid grid-rows-[auto_auto] md:grid-rows-1 grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 w-full"
            >
              <div
                className={cn(
                  "aspect-video",
                  "md:aspect-[9/16] lg:aspect-[9/12]",
                  "xl:aspect-square relative rounded-xl overflow-hidden",
                  reversed ? " md:col-start-2" : "row-start-1 col-start-1",
                )}
              >
                <Image src={image} alt={name} fill className="object-cover" />
              </div>
              <section
                className={cn(
                  " flex flex-col justify-between gap-8 md:gap-12",
                  "py-0",
                  "md:p-6 md:py-8",
                  "lg:p-8 lg:py-10",
                  reversed
                    ? "md:col-start-1 md:row-start-1"
                    : "pl-0 md:pl-0 lg:pl-0 col-start-1 row-start-2 md:col-start-2 md:row-start-1",
                )}
              >
                <div className=" space-y-4 md:space-y-6">
                  <div className="space-y-1 ">
                    <p className="text-3xl font-bold tracking-tight">{name}</p>
                    <p className="text-lg text-muted-fg font-medium">{role}</p>
                    <p className="text-muted-fg text-medium text-base">
                      {experience}
                    </p>
                  </div>
                  <p className="text-base leading-relaxed">{bio}</p>
                </div>

                <div className="space-y-4">
                  <p className="text-base text-muted-fg font-medium">
                    Trusted by
                  </p>
                  <div className="flex items-center gap-6 flex-wrap mt-4">
                    {companies.map((company) => (
                      <img
                        key={company.id}
                        id={company.id}
                        src={company.src}
                        alt={company.alt}
                        className="h-6 w-auto"
                      />
                    ))}
                  </div>
                </div>
              </section>
            </article>
          ),
        )}
      </div>
    </MaxWidthWrapper>
  );
};
