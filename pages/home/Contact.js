import React, { useState } from "react";
import data from "@/assets/data/portfolio.json";
import RailLabel from "@/components/common/railLabel/RailLabel";
import TextInput from "@/components/inputs/TextInput";
import TextArea from "@/components/inputs/TextArea";
import { ValidateAll, ValidateField } from "@/utils/validations/Validation";
import { Messages } from "@/utils/Message";

const EMPTY = { name: "", email: "", phone: "", message: "" };

const Contact = () => {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState({});
  const [status, setStatus] = useState({ state: "idle", text: "" });

  const onChange = (event, id) => {
    setValues((prev) => ({ ...prev, [id]: event.target.value }));
    /* clear an error the moment the visitor starts fixing it */
    if (error[id]) setError((prev) => ({ ...prev, [id]: null }));
  };

  const onBlur = (id) => {
    const message = ValidateField(values, id);
    setError((prev) => ({ ...prev, [id]: message }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const result = ValidateAll(values);
    if (!result.isValid) {
      setError(result.error);
      setStatus({ state: "error", text: Messages.Contact.Invalid });
      return;
    }

    setStatus({ state: "sending", text: "Sending…" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus({ state: "error", text: body.message || Messages.Contact.Failed });
        return;
      }

      setValues(EMPTY);
      setError({});
      setStatus({ state: "sent", text: Messages.Contact.Sent });
    } catch (e) {
      setStatus({ state: "error", text: Messages.Contact.Failed });
    }
  };

  const sending = status.state === "sending";

  return (
    <section className="sect contact" id="contact">
      <div className="wrap field">
        <RailLabel index="06" label="Contact" />

        <div className="contact__grid">
          <div className="rv">
            <h2>
              <span className="ln"><span>Let&rsquo;s talk about</span></span>
              <span className="ln"><span><em>what you&rsquo;re building.</em></span></span>
            </h2>

            <p className="lede">
              I&rsquo;m open to full-time roles and to project work, whether that&rsquo;s a
              whole build, just the front end, or an API someone needs finishing. Tell me
              what you&rsquo;re working on and I&rsquo;ll get back to you within a day.
            </p>

            <div className="iconbtns">
              <div className="iconbtn">
                <a href={data.profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" title="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
                  </svg>
                </a>
                <span>GitHub</span>
              </div>

              <div className="iconbtn">
                <a href={data.profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" title="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1a4.2 4.2 0 0 1 3.8-2.1c4 0 4.8 2.6 4.8 6.1V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9z" />
                  </svg>
                </a>
                <span>LinkedIn</span>
              </div>

              <div className="iconbtn">
                <a href={data.profile.cv} download aria-label="Download CV as PDF" title="Download CV">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v11M7.5 10l4.5 4.5 4.5-4.5M4.5 20h15" />
                  </svg>
                </a>
                <span>CV</span>
              </div>
            </div>
          </div>

          <div className="formcard rv">
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="form__row">
                <TextInput
                  id="name"
                  label="Name"
                  placeholder="Your name"
                  autoComplete="name"
                  value={values.name}
                  error={error.name}
                  disabled={sending}
                  onChange={onChange}
                  onBlur={onBlur}
                />
                <TextInput
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  value={values.email}
                  error={error.email}
                  disabled={sending}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              </div>

              <TextInput
                id="phone"
                type="tel"
                label="Phone"
                optional
                placeholder="+91 00000 00000"
                autoComplete="tel"
                value={values.phone}
                error={error.phone}
                disabled={sending}
                onChange={onChange}
                onBlur={onBlur}
              />

              {/* Honeypot — hidden from people, catnip for bots. Checked server-side. */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" value={values.company || ""} onChange={(e) => setValues((p) => ({ ...p, company: e.target.value }))} />
              </div>

              <TextArea
                id="message"
                label="Message"
                placeholder="What are you building, and what do you need?"
                value={values.message}
                error={error.message}
                disabled={sending}
                onChange={onChange}
                onBlur={onBlur}
              />

              <div className="form__foot">
                <button type="submit" className="btn btn--primary" disabled={sending}>
                  {sending ? "Sending…" : "Send message"} <span className="arw">&#8599;</span>
                </button>

                {status.text ? (
                  <p className={`form__note form__note--${status.state}`} role="status">
                    {status.text}
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
