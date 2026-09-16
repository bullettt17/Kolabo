"use client";

import { useState, type FormEvent } from "react";

export default function EnterpriseContactForm() {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorText(null);

    try {
      const res = await fetch("/api/enterprise-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, companyName, email, teamSize, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorText(data.error ?? "Something went wrong — please try again.");
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorText("Something went wrong — please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="card text-center">
        <p className="text-lg font-semibold text-slate-900">Thanks — we've got it.</p>
        <p className="mt-2 text-sm text-slate-600">
          A real person will reply from a real inbox within a couple of business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="ent-name">Your name</label>
          <input
            id="ent-name"
            className="input"
            required
            maxLength={200}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="ent-company">Company name</label>
          <input
            id="ent-company"
            className="input"
            required
            maxLength={200}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="ent-email">Work email</label>
          <input
            id="ent-email"
            type="email"
            className="input"
            required
            maxLength={320}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="ent-team-size">Team size (optional)</label>
          <input
            id="ent-team-size"
            className="input"
            maxLength={100}
            placeholder="e.g. 5-10 people"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="ent-message">What are you looking to set up?</label>
        <textarea
          id="ent-message"
          className="input min-h-[120px] resize-y"
          required
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {status === "error" && errorText && (
        <p className="text-sm font-medium text-red-600">{errorText}</p>
      )}
      <button type="submit" className="btn-primary justify-self-start px-6 py-3" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
