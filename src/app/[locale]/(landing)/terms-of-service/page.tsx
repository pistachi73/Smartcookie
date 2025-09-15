"use client";

import { Heading } from "@/shared/components/ui/heading";
import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";

export default function TermsOfServicePage() {
  return (
    <div className="p-[2%] md:p-6 bg-white space-y-24 pb-24!">
      <div className="rounded-b-2xl p-6 py-24 pt-42 bg-zinc-800 -mt-24">
        <MaxWidthWrapper className="py-8 lg:py-12">
          <Heading
            level={1}
            className="text-2xl sm:text-4xl text-bg text-center mb-12"
          >
            Terms of Service
          </Heading>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="prose max-w-4xl">
        <div className="text-muted-fg space-y-8">
          <section className="mb-8">
            <p className="text-lg mb-6">
              <strong>Effective Date:</strong> January 1, 2025
            </p>
            <p className="text-lg mb-6">
              Welcome to SmartCookie. These Terms of Service ("Terms") govern
              your use of our website and services. By accessing or using our
              platform, you agree to be bound by these Terms. If you do not
              agree to these Terms, please do not use our services.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              1. Acceptance of Terms
            </Heading>
            <p>
              By accessing and using SmartCookie's services, you accept and
              agree to be bound by the terms and provision of this agreement.
              These Terms constitute a legally binding agreement between you and
              SmartCookie.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              2. Description of Service
            </Heading>
            <p>
              SmartCookie provides an online platform for educational services,
              including but not limited to course management, student tracking,
              feedback collection, and educational analytics. Our services are
              designed to enhance the learning experience for both educators and
              students.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              3. User Accounts and Registration
            </Heading>
            <div className="space-y-4">
              <p>
                To access certain features of our service, you may be required
                to create an account. When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>
                  Maintain and update your information to keep it accurate
                </li>
                <li>Maintain the security of your password and account</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
              </ul>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              4. Acceptable Use Policy
            </Heading>
            <div className="space-y-4">
              <p>You agree not to use our service to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful, threatening, or offensive content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of our service</li>
                <li>
                  Use our service for any commercial purpose without permission
                </li>
                <li>Collect or harvest user information without consent</li>
              </ul>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              5. Intellectual Property Rights
            </Heading>
            <div className="space-y-4">
              <p>
                All content, features, and functionality of our service are
                owned by SmartCookie and are protected by international
                copyright, trademark, patent, trade secret, and other
                intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, or create derivative
                works of our content without our express written permission.
              </p>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              6. Privacy and Data Protection
            </Heading>
            <p>
              Your privacy is important to us. Our collection and use of
              personal information is governed by our Privacy Policy, which is
              incorporated into these Terms by reference. By using our service,
              you consent to the collection and use of information as described
              in our Privacy Policy.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              7. Payment Terms
            </Heading>
            <div className="space-y-4">
              <p>
                If you purchase a subscription or other paid services, you agree
                to pay all applicable fees as described on our website. All fees
                are non-refundable unless otherwise stated.
              </p>
              <p>
                We reserve the right to change our pricing at any time. Price
                changes will be communicated to existing subscribers with at
                least 30 days' notice.
              </p>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              8. Termination
            </Heading>
            <div className="space-y-4">
              <p>
                We may terminate or suspend your account and access to our
                service immediately, without prior notice, for any reason,
                including if you breach these Terms.
              </p>
              <p>
                You may terminate your account at any time by contacting us or
                using the account deletion feature in your account settings.
              </p>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              9. Disclaimers and Limitations of Liability
            </Heading>
            <div className="space-y-4">
              <p>
                Our service is provided "as is" and "as available" without
                warranties of any kind, either express or implied. We do not
                warrant that our service will be uninterrupted, secure, or
                error-free.
              </p>
              <p>
                To the maximum extent permitted by law, SmartCookie shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, including but not limited to loss of profits,
                data, or use, arising out of or relating to your use of our
                service.
              </p>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              10. Indemnification
            </Heading>
            <p>
              You agree to indemnify and hold harmless SmartCookie and its
              officers, directors, employees, and agents from any claims,
              damages, or expenses arising out of your use of our service or
              violation of these Terms.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              11. Changes to Terms
            </Heading>
            <p>
              We reserve the right to modify these Terms at any time. We will
              notify users of any material changes by posting the new Terms on
              our website and updating the "Effective Date." Your continued use
              of our service after such changes constitutes acceptance of the
              new Terms.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              12. Contact Information
            </Heading>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <p>
                <strong>Email:</strong> martinamonreal@gmail.com
              </p>
              <p>
                <strong>Address:</strong> Carrer Conca nº8, Terrassa (08227) -
                España
              </p>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              13. Severability
            </Heading>
            <p>
              If any provision of these Terms is found to be unenforceable or
              invalid, that provision will be limited or eliminated to the
              minimum extent necessary so that these Terms will otherwise remain
              in full force and effect.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              14. Entire Agreement
            </Heading>
            <p>
              These Terms, together with our Privacy Policy and any other legal
              notices published by us on our service, constitute the entire
              agreement between you and SmartCookie concerning our service.
            </p>
          </section>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
