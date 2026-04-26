import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { slideIn } from '../utils/motion';
import { send, sendHover } from '../assets';

const Snackbar = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg
        text-timberWolf font-poppins font-medium text-sm
        ${type === 'success' ? 'bg-[#1a3a2a] border border-[#2d6a4f]' : 'bg-[#3a1a1a] border border-[#6a2d2d]'}`}>
      <span className="text-lg">{type === 'success' ? '✓' : '✕'}</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">✕</button>
    </motion.div>
  );
};

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const closeSnackbar = () => setSnackbar(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: import.meta.env.VITE_APP_TO_NAME,
          from_email: form.email,
          to_email: import.meta.env.VITE_APP_TO_EMAIL,
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          setSnackbar({ message: 'Thank you! I will get back to you as soon as possible.', type: 'success' });
          setForm({ name: '', email: '', message: '' });
        },
        (error) => {
          setLoading(false);
          console.log(error);
          setSnackbar({ message: 'Something went wrong. Please try again.', type: 'error' });
        }
      );
  };

  return (
    <>
      <div
        className="-mt-[8rem] xl:flex-row flex-col-reverse
        flex gap-10 overflow-hidden">
        <motion.div
          variants={slideIn('left', 'tween', 0.2, 1)}
          className="flex-[0.75] bg-jet p-8 rounded-2xl">
          <p className={styles.sectionSubText}>Get in touch</p>
          <h3 className={styles.sectionHeadTextLight}>Contact.</h3>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-6 font-poppins">
            <label className="flex flex-col">
              <span className="text-timberWolf font-medium mb-4">Your Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="What's your name?"
                className="bg-eerieBlack py-4 px-6
                placeholder:text-taupe
                text-timberWolf rounded-lg outline-none
                border-none font-medium"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-timberWolf font-medium mb-4">Your Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="What's your email?"
                className="bg-eerieBlack py-4 px-6
                placeholder:text-taupe
                text-timberWolf rounded-lg outline-none
                border-none font-medium"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-timberWolf font-medium mb-4">
                Your Message
              </span>
              <textarea
                rows="7"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What's your message?"
                className="bg-eerieBlack py-4 px-6
                placeholder:text-taupe
                text-timberWolf rounded-lg outline-none
                border-none font-medium resize-none"
              />
            </label>

            <button
              type="submit"
              className="live-demo flex justify-center sm:gap-4
              gap-3 sm:text-[20px] text-[16px] text-timberWolf
              font-bold font-beckman items-center py-5
              whitespace-nowrap sm:w-[130px] sm:h-[50px]
              w-[100px] h-[45px] rounded-[10px] bg-night
              hover:bg-battleGray hover:text-eerieBlack
              transition duration-[0.2s] ease-in-out"
              onMouseOver={() => {
                document
                  .querySelector('.contact-btn')
                  .setAttribute('src', sendHover);
              }}
              onMouseOut={() => {
                document.querySelector('.contact-btn').setAttribute('src', send);
              }}>
              {loading ? 'Sending' : 'Send'}
              <img
                src={send}
                alt="send"
                className="contact-btn sm:w-[26px] sm:h-[26px]
                w-[23px] h-[23px] object-contain"
              />
            </button>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {snackbar && (
          <Snackbar
            message={snackbar.message}
            type={snackbar.type}
            onClose={closeSnackbar}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionWrapper(Contact, 'contact');
