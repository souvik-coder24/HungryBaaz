import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaPlus } from "react-icons/fa6";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <span className="flex-1 text-base-content">{question}</span>
        <FaPlus className={`flex-shrink-0 w-4 h-4 ml-auto fill-current transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}/>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-60' : 'max-h-0'}`}
      >
        <div className="pb-5 leading-relaxed">
          <div className="space-y-2 leading-relaxed">{answer}</div>
        </div>
      </div>
    </li>
  );
};

const NeedHelp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emailEndpoint = '/api/send-email';

    try {
      const response = await fetch(emailEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus('Your message has been sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('There was an issue sending your message. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus('There was an issue sending your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mt-16 w-full max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <IoClose className="absolute top-4 right-4 text-2xl cursor-pointer" onClick={() => window.location.href = '/'} />
      <h2 className="text-2xl font-bold text-center mb-4">Need Help with Your Order?</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Frequently Asked Questions</h3>
        <ul>
          <FAQItem
            question="How can I place an order?"
            answer="You can place an order by browsing our menu, adding items to your cart, and proceeding to checkout. You'll need to provide your delivery details and payment information."
          />
          <FAQItem
            question="What payment methods do you accept?"
            answer="We accept various payment methods including credit/debit cards, digital wallets, and cash on delivery. You can choose your preferred payment option at checkout."
          />
          <FAQItem
            question="How do I track my order?"
            answer="Once you've placed an order, you can track its status in real-time through the 'Order Tracking' section in your account. You will also receive updates via SMS and email."
          />
          <FAQItem
            question="What should I do if my order is incorrect or missing items?"
            answer="If you receive an incorrect or incomplete order, please contact our support team immediately via the contact form below or call us directly. We will resolve the issue as quickly as possible."
          />
          <FAQItem
            question="Can I modify or cancel my order after placing it?"
            answer="You can modify or cancel your order within a specific timeframe after placing it. Please refer to our cancellation policy on the website or contact customer support for assistance."
          />
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
        <p>If you need further assistance or have any questions, please fill out the form below and our support team will get back to you as soon as possible:</p>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="border p-2 w-full rounded-lg"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white rounded-lg px-4 py-2"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          {formStatus && (
            <p className={`mt-4 ${formStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{formStatus}</p>
          )}
        </form>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Helpful Resources</h3>
        <ul className="list-disc list-inside pl-4">
          <li><a href="/menu" className="text-blue-500 hover:underline">View Menu</a></li>
          <li><a href="/offers" className="text-blue-500 hover:underline">Special Offers</a></li>
          <li><a href="/contact" className="text-blue-500 hover:underline">Contact Support</a></li>
        </ul>
      </div>
    </div>
  );
};

export default NeedHelp;