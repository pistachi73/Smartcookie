"use client";

import { Heading } from "@/shared/components/ui/heading";
import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";

export default function AccessibilityStatementPage() {
  return (
    <div className="p-[2%] md:p-6 bg-white space-y-24 pb-24!">
      <div className="rounded-b-2xl p-6 py-24 pt-42 bg-zinc-800 -mt-24">
        <MaxWidthWrapper className="py-8 lg:py-12">
          <Heading
            level={1}
            className="text-2xl sm:text-4xl text-bg text-center mb-12"
          >
            Accessibility Statement
          </Heading>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="prose max-w-4xl">
        <div className="text-muted-fg space-y-8">
          <section className="mb-8">
            <p className="text-lg mb-6">
              At SmartCookie, we are committed to ensuring that our website is
              accessible to everyone, including individuals with disabilities.
              We strive to make the web a more inclusive place by adhering to
              the principles of accessibility, enabling all users to access the
              information and services we offer with ease.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              Accessibility Standards
            </Heading>
            <p className="mb-4">
              We aim to comply with the Web Content Accessibility Guidelines
              (WCAG) 2.1, Level AA, which provides a framework for making web
              content more accessible to a wider range of people with
              disabilities. These standards include ensuring that:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>All website features can be navigated with a keyboard.</li>
              <li>
                Text alternatives (e.g., alt text) are provided for non-text
                content.
              </li>
              <li>
                Content is presented in a way that is easy to understand and
                interact with.
              </li>
              <li>
                We offer compatibility with assistive technologies, such as
                screen readers.
              </li>
            </ul>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              Ongoing Efforts
            </Heading>
            <p>
              We are continuously working to improve the accessibility of our
              website. Regular reviews are conducted to ensure that new content
              and features meet accessibility standards. However, if you
              encounter any barriers or have suggestions for improvement, please
              let us know.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              Contact Us
            </Heading>
            <p className="mb-4">
              If you have any trouble accessing any part of our website or need
              assistance, please don't hesitate to contact us. We are happy to
              provide support or alternative formats where possible.
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <p>
                <strong>Email:</strong> martinamonreal@gmail.com
              </p>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              Feedback
            </Heading>
            <p>
              Your feedback is invaluable to us. If you encounter any
              accessibility issues or have any suggestions for improving the
              accessibility of our website, please contact us using the details
              above. We will make every effort to address your concerns
              promptly.
            </p>
          </section>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
