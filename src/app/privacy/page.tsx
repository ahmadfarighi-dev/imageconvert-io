import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ImageConvert privacy policy — your images are processed entirely in your browser and never uploaded to any server.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-[30px] font-extrabold text-ic-text-900 tracking-tight leading-tight mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            Your files never leave your device
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            All image conversion happens entirely in your browser using WebAssembly — your photos
            are never uploaded to a server, stored, or seen by us. You can verify this yourself by
            opening your browser&apos;s developer tools and watching the Network tab while you
            convert a file: no image data is ever sent anywhere.
          </p>

          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            What we collect
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            We use standard anonymous analytics to understand page views and overall site usage —
            this data is never linked to any image you convert. The only personal information we
            collect is an email address, and only if you choose to submit one through the &quot;Get
            notified&quot; Pro waitlist form.
          </p>

          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            Cookies
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            We do not use tracking or advertising cookies. Any cookies in use are limited to basic
            site functionality.
          </p>

          <h2 className="text-[20px] font-extrabold text-ic-text-900 tracking-tight mt-8 mb-3">
            Contact
          </h2>
          <p className="text-[14px] text-ic-text-600 leading-relaxed mb-4">
            If you have questions about this privacy policy, please reach out via the contact
            details on our homepage.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
