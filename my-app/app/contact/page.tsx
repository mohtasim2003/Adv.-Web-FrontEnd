
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";

export default function ContactPage() {
  return (
    <main className="bg-base-100">
      <Navbar></Navbar>
      {/* HERO */}
      <section className="bg-base-300 py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-base-content">
            Contact <span className="bg-gradient-to-r from-[#9130f1] to-[#d79a50] bg-clip-text text-transparent">SkyPhonix</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-base-content/70">
            We’re here to help you plan your journey with confidence and ease.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start justify-center">
          {/* Contact Info */}
          <div className="mx-auto">
            <h2 className="text-3xl font-bold text-base-content mb-6 text-center md:text-left">
              Get in Touch
            </h2>
            <p className="text-base-content/70 mb-10 text-center md:text-left">
              Have questions about bookings, discounts, or flight flexibility?
              Our support team is available 24/7 to assist you.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  📍
                </div>
                <div>
                  <p className="font-semibold text-base-content">Head Office</p>
                  <p className="text-base-content/70">
                    SkyPhonix Airlines HQ<br />
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  📧
                </div>
                <div>
                  <p className="font-semibold text-base-content">Email</p>
                  <p className="text-base-content/70">
                    support@skyphonix.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  📞
                </div>
                <div>
                  <p className="font-semibold text-base-content">Phone</p>
                  <p className="text-base-content/70">
                    +880 1234 567 890
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Contact Form (remains empty or add form here) */}
        </div>
      </section>

      {/* SUPPORT CTA */}
      <section className="py-24 bg-base-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need Immediate Assistance?
          </h2>
          <p className="text-base-content/70 mb-10">
            Our customer support team is available around the clock to help
            you with urgent travel needs.
          </p>
          <button className="btn btn-outline btn-accent rounded-2xl px-10">
            Call Support
          </button>
        </div>
      </section>
      <Footer></Footer>
    </main>
  );
}
