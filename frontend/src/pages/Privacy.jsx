import { Container } from '@/components/ui/Container';

const Privacy = () => {
    return (
        <div className="bg-white min-h-screen pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-[var(--color-text)] mb-8 text-center">Privacy Policy</h1>

                <div className="prose prose-lg mx-auto text-gray-600 space-y-8">
                    <p className="font-medium text-sm text-gray-400 uppercase tracking-widest text-center mb-12">Effective Date: 1-24-26</p>

                    <p>
                        At Mazel Tote Bags, we are committed to protecting your privacy and ensuring that your personal information is handled responsibly. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website and purchase our products. By using our services, you agree to the practices described in this policy.
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">1. Information We Collect</h2>
                        <p className="mb-4">We may collect the following types of information:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Personal Information:</strong> Name, email address, shipping address, billing address, phone number, and payment details necessary to process orders.</li>
                            <li><strong>Account Information:</strong> If you create an account, we collect your username and password.</li>
                            <li><strong>Usage Information:</strong> Details about your interactions with our website, such as pages visited, time spent, and clicks.</li>
                            <li><strong>Communication Data:</strong> Any messages or correspondence you send us.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">Your information is used to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Process and fulfill your orders.</li>
                            <li>Communicate with you about your order status, updates, and promotional offers (if you opt-in).</li>
                            <li>Improve our website, products, and services.</li>
                            <li>Personalize your experience.</li>
                            <li>Comply with legal obligations and prevent fraud.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">3. Sharing Your Information</h2>
                        <p className="mb-4">We do not sell or rent your personal information. However, we may share your data with:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Service Providers:</strong> Payment processors, shipping companies, and IT service providers who assist in delivering our services.</li>
                            <li><strong>Legal Compliance:</strong> When required by law or to protect our legal rights.</li>
                            <li><strong>Charities:</strong> When you select a charity to receive proceeds from your purchase, your donation information may be shared with that charity for processing purposes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">4. Your Rights and Choices</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Access and Correction:</strong> You can request access to your personal data and request corrections.</li>
                            <li><strong>Opt-Out:</strong> You can opt out of receiving promotional emails by following the unsubscribe link in our communications.</li>
                            <li><strong>Delete Data:</strong> You may request the deletion of your personal data, subject to legal obligations.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">5. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your data from unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">6. Cookies and Tracking Technologies</h2>
                        <p>
                            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage your cookie preferences through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">7. Children's Privacy</h2>
                        <p>
                            Our website and products are not directed to children under the age of 13, and we do not knowingly collect personal information from children.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">8. Changes to This Privacy Policy</h2>
                        <p>
                            We may update this policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">9. Contact Us</h2>
                        <p className="mb-4">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
                        <ul className="list-none space-y-1">
                            <li><strong>Email:</strong> support@mazeltotel.com</li>
                            <li><strong>Phone:</strong> n/a</li>
                            <li><strong>Address:</strong> n/a</li>
                        </ul>
                    </section>

                    <div className="border-t border-gray-200 pt-8 mt-12 text-center">
                        <p className="italic font-medium text-[var(--color-primary)]">
                            "Mazel Tote Bags is honored to carry a message of hope, kindness, and acceptance. Thank you for trusting us with your information."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
