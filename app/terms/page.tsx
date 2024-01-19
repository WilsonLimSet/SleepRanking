import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms.",
};
export default function Terms() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center my-4">Terms of Service</h1>
      <p className="text-sm text-gray-600 text-right">Last Updated: Jan 18th 2024</p>

      <section className="my-6">
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to Sleep Ranking. These Terms of Service (&quot;Terms&quot;) govern your
          access to and use of our website www.sleepranking.com and any related
          services provided by Sleep Ranking.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Acceptance of Terms</h2>
        <p>
          By accessing or using our website, you agree to be bound by these
          Terms and our Privacy Policy. If you do not agree to these Terms,
          please do not use our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. We
          will provide notice of significant changes to the Terms by posting the
          updated Terms on our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Use of the Website</h2>
        <ul className="list-disc ml-8 mb-4">
          <li>
            <strong>Eligibility:</strong> You must be at least 13 years old to
            use our website.
          </li>
          <li>
            <strong>Prohibited Activities:</strong> You may not use our website
            for any illegal or unauthorized purpose. You must not, in the use of
            the service, violate any laws in your jurisdiction.
          </li>
          <li>
            <strong>User Content:</strong> You are responsible for your user
            content, including its legality, reliability, and appropriateness.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          5. Intellectual Property Rights
        </h2>
        <ul className="list-disc ml-8 mb-4">
          <li>
            <strong>Website Content:</strong> All content on this website,
            including text, graphics, logos, and images, is the property of
            Sleep Ranking or its content suppliers and is protected by
            intellectual property laws.
          </li>
          <li>
            <strong>User Content:</strong> You retain all rights to your
            content, but grant us a license to use, modify, and display it in
            connection with the service.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          6. Disclaimer of Warranties
        </h2>
        <p>
          Our website and services are provided on an &quot;as is&quot; and &quot;as available&quot;
          basis. Sleep Ranking makes no warranties, express or implied,
          regarding the website and expressly disclaims any implied warranties
          of merchantability or fitness for a particular purpose.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          7. Limitation of Liability
        </h2>
        <p>
          Sleep Ranking shall not be liable for any direct, indirect,
          incidental, special, consequential, or punitive damages resulting from
          your use of or inability to use the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Sleep Ranking and its
          employees, agents, and affiliates from any claims, damages, expenses,
          including attorneys’ fees, arising from your use of the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the jurisdiction in which Sleep Ranking is based, without
          regard to its conflict of law provisions.
        </p>
      </section>
      <section className="my-6">
        <h2 className="text-xl font-semibold">10. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at
          wilsonlimsetiawan@gmail.com.
        </p>
      </section>
    </div>
  );
}
