'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Terms and Conditions
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 mb-6">
                By accessing and using शुभ विवाह, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Eligibility
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>You must be at least 18 years old to use our services</li>
                <li>You must be legally eligible to marry</li>
                <li>You must provide accurate and complete information</li>
                <li>You must not be banned from using the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. User Responsibilities
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide truthful and accurate information</li>
                <li>Respect the privacy of other users</li>
                <li>Do not engage in fraudulent activities</li>
                <li>Do not share inappropriate content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Premium Services
              </h2>
              <p className="text-gray-600">
                Premium services include advanced search features, unlimited messaging, and priority customer support. These services are subject to payment terms and conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Content Guidelines
              </h2>
              <p className="text-gray-600">
                Users are prohibited from posting false, offensive, or illegal content. We reserve the right to remove any content that violates our guidelines.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Account Termination
              </h2>
              <p className="text-gray-600">
                We reserve the right to terminate accounts that violate our terms of service, engage in fraudulent activities, or misuse our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-600 mb-6">
                शुभ विवाह is not responsible for user interactions, accuracy of information, or technical issues. Users are responsible for their own safety and decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Changes to Terms
              </h2>
              <p className="text-gray-600">
                We may modify these terms at any time. Users will be notified of significant changes, and continued use of the service constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Contact Information
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  For any questions or concerns regarding these Terms and Conditions, please contact us at:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:info@therobustrix.com" className="hover:text-purple-600">
                      info@therobustrix.com
                    </a>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:01141653157" className="hover:text-purple-600">
                      Phone: 011-41653157
                    </a>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <a href="https://wa.me/919090020245" className="hover:text-purple-600">
                      WhatsApp: +91-9090020245
                    </a>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 