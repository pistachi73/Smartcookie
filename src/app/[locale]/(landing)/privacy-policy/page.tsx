"use client";

import { Heading } from "@/shared/components/ui/heading";
import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";

export default function PrivacyPolicyPage() {
  return (
    <div className="p-[2%] md:p-6 bg-white space-y-24 pb-24!">
      <div className="rounded-b-2xl p-6 py-24 pt-42 bg-zinc-800 -mt-24">
        <MaxWidthWrapper className="py-8 lg:py-12">
          <Heading level={1} className="sm:text-6xl! text-bg text-center mb-12">
            Privacy Policy
          </Heading>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="prose max-w-4xl">
        <div className="text-muted-fg space-y-8">
          <section className="mb-8">
            <p className="text-lg mb-6">
              Martina Monreal Carnicero is the data controller and is
              responsible for processing the personal data of users in this
              section. For the purposes of compliance with Regulation (EU)
              2016/679 of the European Parliament of April 27, 2016 (GDPR), and
              Organic Law 3/2018, of December 5, on the Protection of Personal
              Data and Guarantee of Digital Rights (LOPDGDD), the following
              information is provided.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              Data Controller
            </Heading>
            <div className="bg-muted p-6 rounded-lg">
              <p>
                <strong>Business Name:</strong> Martina Monreal Carnicero
              </p>
              <p>
                <strong>NIF:</strong> 53637848P
              </p>
              <p>
                <strong>Address:</strong> Carrer Conca nº8, Terrassa (08227) -
                España
              </p>
              <p>
                <strong>Email:</strong> martinamonreal@gmail.com
              </p>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              Purpose
            </Heading>
            <p>
              The information provided by interested parties via any of the
              forms available on the website will be processed to manage the
              delivery of the requested information. A commercial profile may be
              created, based on the provided information, if necessary.
              Automated decisions will not be made based on this profile.
              Personal data will be retained as long as the commercial
              relationship is maintained and until the data subject requests its
              deletion.
            </p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              Legal Basis
            </Heading>
            <p>
              The consent of the interested party is requested for processing
              their data and the prospective offering of products and services.
            </p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              Recipients
            </Heading>
            <p>
              Personal data will not be transferred to third parties, except for
              cases where it is necessary for administrative purposes within the
              group companies.
            </p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              Rights
            </Heading>
            <p>
              Interested parties have the right to access their personal data,
              as well as to request the rectification of inaccurate data or, if
              applicable, request the deletion of data when they are no longer
              necessary for the purposes for which they were collected.
              Interested parties, in certain circumstances, may also limit or
              oppose the processing of their data, as well as request the
              portability of their data. You also have the right to withdraw
              your consent and to file a complaint with the Supervisory
              Authority. To exercise your rights, please contact the Data
              Controller at the address provided above, along with a copy of the
              data subject's identity document.
            </p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              1. Who is responsible for processing your personal data?
            </Heading>
            <p>
              Martina Monreal Carnicero, NIF: 53637848P, Address: Carrer Conca
              nº8, Terrassa (08227) - Spain, and Email: martinamonreal@gmail.com
              is the DATA CONTROLLER of your personal data and informs you that
              this data will be processed in accordance with Regulation (EU)
              2016/679 (GDPR) and Organic Law 3/2018 (LOPDGDD).
            </p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              2. What is the purpose of processing the data and what legal basis
              legitimizes it?
            </Heading>
            <p>
              The information provided by interested parties is processed to
              manage the delivery of requested information and, if necessary, to
              create a commercial profile based on the provided data. This
              includes processing orders, requests, responding to inquiries, or
              any other type of request made by the USER through any available
              contact form on the website.
            </p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              3. How long will the data be retained?
            </Heading>
            <p>
              Personal data provided will be retained as long as the commercial
              relationship is maintained and until the data subject requests its
              deletion. When no longer necessary, the data will be deleted
              securely.
            </p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              4. What rights do you have and how can you exercise them?
            </Heading>
            <p>
              Interested parties have the right to access their personal data,
              request the rectification of inaccurate data, or request its
              deletion when no longer necessary. They may also oppose or limit
              the processing of their data in certain circumstances.
              Additionally, they have the right to withdraw their consent at any
              time and file a complaint with the Data Protection Authority.
            </p>
            <p className="mt-4">
              To exercise your rights, please contact the Data Controller at the
              address provided above.
            </p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              5. Who do we share your personal data with?
            </Heading>
            <p>
              Personal data will not be transferred to third parties, except in
              cases where it is necessary for internal administrative purposes
              within the company or as required by law.
            </p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              6. Do we make automated decisions?
            </Heading>
            <p>
              No automated decisions will be made based on the commercial
              profile.
            </p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              7. Do we transfer data internationally?
            </Heading>
            <p>We do not carry out international data transfers.</p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              8. Why do we process your personal data?
            </Heading>
            <p>
              We ask for the consent of the interested party to process their
              data and offer prospective products and services. The personal
              data collected through the website forms will be processed based
              solely on the consent provided by the user by accepting the
              checkbox for this purpose. This consent may be withdrawn at any
              time. The legitimate interest of the data controller also applies
              for statistical purposes regarding website usage.
            </p>
          </section>

          <section>
            <Heading level={2} className=" sm:text-2xl mb-4">
              Legal Notice
            </Heading>
            <p>
              All texts, photographs, logos, coupons, products, services, and
              images viewed, as well as voice messages, are collected by Martina
              Monreal Carnicero under the sole and exclusive responsibility of
              the advertiser, who is responsible for the veracity of the
              information contained on the website. Complaint forms are
              available for consumers at the address of Martina Monreal
              Carnicero: Carrer Conca nº8, Terrassa (08227) - Spain, and can be
              contacted at any time via email at martinamonreal@gmail.com. In
              accordance with national and EU consumer protection legislation,
              an online dispute resolution mechanism is available via the
              platform provided by the Commission at the following link:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=EN"
                className="text-blue-400 hover:text-blue-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=EN
              </a>
            </p>
          </section>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
