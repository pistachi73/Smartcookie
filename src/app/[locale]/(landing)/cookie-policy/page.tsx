"use client";

import { Heading } from "@/shared/components/ui/heading";
import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";

export default function CookiePolicyPage() {
  return (
    <div className="p-[2%] md:p-6 bg-white space-y-24 pb-24!">
      <div className="rounded-b-2xl p-6 py-24 pt-42 bg-zinc-800 -mt-24">
        <MaxWidthWrapper className="py-8 lg:py-12">
          <Heading
            level={1}
            className="text-2xl sm:text-4xl text-bg text-center mb-12"
          >
            Cookie Policy
          </Heading>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="prose max-w-4xl">
        <div className="text-muted-fg space-y-8">
          <section className="mb-8">
            <p className="text-lg mb-6">
              In accordance with Law 34/2002, of July 11, on Information Society
              Services and Electronic Commerce (LSSI), in relation to Regulation
              (EU) 2016/679 of the European Parliament and Council, of April 27,
              2016, General Data Protection Regulation (GDPR), and Organic Law
              3/2018, of December 5, on the Protection of Personal Data and
              Guarantee of Digital Rights (LOPDGDD), it is mandatory to obtain
              the express consent of users on websites that use non-essential
              cookies, before they navigate through them. This cookie policy
              aims to inform you clearly and precisely about the cookies we use
              to facilitate your browsing, distinguish you from other users, and
              analyze your browsing habits.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              What is a "Cookie"?
            </Heading>
            <p>
              Cookies are small text files used to store information. These
              cookies are stored on your device when you access a website via
              your browser. They help us run the website, improve security,
              enhance the user experience, and understand how the website
              behaves, so we can improve or fix any issues.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              Why Should I Allow Cookies?
            </Heading>
            <p>
              Allowing cookies will give you a better experience on our website,
              allowing smoother and more personalized navigation. Additionally,
              certain basic actions, such as purchasing products or accessing
              the client area, require cookies.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              Types and Purposes of Cookies
            </Heading>
            <div className="space-y-6">
              <div>
                <Heading level={3} className="text-xl mb-3">
                  First-party Cookies
                </Heading>
                <p>
                  These are cookies managed by the website owner. They may serve
                  technical purposes, analytical purposes, or personalization
                  purposes, depending on the case.
                </p>
              </div>
              <div>
                <Heading level={3} className="text-xl mb-3">
                  Third-party Cookies
                </Heading>
                <p>
                  These cookies are managed by service providers outside the
                  website owner, such as advertising or analytics providers.
                  These cookies help tailor advertising and improve the user
                  experience.
                </p>
              </div>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              Cookies Based on Retention Time
            </Heading>
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">Session Cookies:</p>
                <p>
                  These cookies are stored only during your visit to the website
                  and are deleted when you close the browser.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">Persistent Cookies:</p>
                <p>
                  These cookies remain stored for a longer period, depending on
                  the cookie's specific configuration.
                </p>
              </div>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              Disabling Cookies
            </Heading>
            <div className="space-y-6">
              <div>
                <Heading level={3} className="text-xl mb-3">
                  What happens if I block cookies?
                </Heading>
                <p>
                  Blocking cookies may affect the proper functioning of certain
                  website features, limiting your user experience.
                </p>
              </div>
              <div>
                <Heading level={3} className="text-xl mb-3">
                  How can I block or allow cookies?
                </Heading>
                <p className="mb-4">
                  Most browsers are set by default to accept cookies, but you
                  can change the settings to block some or all cookies if you
                  prefer. If you don't like how this affects your online
                  experience, it's just as easy to change things back.
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">
                      Microsoft Internet Explorer
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>
                        For older versions, go to Tools &gt; Internet Options
                        &gt; Privacy.
                      </li>
                      <li>
                        For the latest version, click the Settings icon &gt;
                        Internet Options &gt; Privacy.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Mozilla Firefox</p>
                    <p>
                      Click the Menu button and select Preferences. Then go to
                      the Privacy &amp; Security panel.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Google Chrome</p>
                    <p>
                      Open Chrome on your computer, go to Settings &gt; Advanced
                      &gt; Site Settings &gt; Cookies.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Safari</p>
                    <p>
                      In the Safari app, go to Preferences &gt; Privacy and
                      adjust cookie settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
