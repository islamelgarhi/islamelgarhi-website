import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CREAM = "#efe9db";
const AMAZON_URL = "#"; // placeholder until the book is live on Amazon

const VERDICT_OPTIONS = [
  { value: "not_proven", label: "Not proven. I remain unconvinced." },
  { value: "not_yet", label: "Not yet. I cannot dismiss it, and I cannot yet sign it." },
  { value: "beyond_reasonable_doubt", label: "Beyond reasonable doubt" },
] as const;

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please share your name")
    .max(200, "Name must be less than 200 characters"),
  email: z
    .string()
    .trim()
    .max(320, "Email is too long")
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  verdict: z.enum(["not_proven", "not_yet", "beyond_reasonable_doubt"], {
    errorMap: () => ({ message: "Please choose a verdict" }),
  }),
  message: z
    .string()
    .trim()
    .min(1, "Please share your thoughts")
    .max(5000, "Message must be less than 5000 characters"),
});

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [verdict, setVerdict] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<{ title: string; description: string } | null>(null);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setNotice(null);
    const parsed = formSchema.safeParse({ name, email, verdict, message });
    if (!parsed.success) {
      setNotice({
        title: "Please review your response",
        description: parsed.error.issues[0]?.message ?? "Something is missing.",
      });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("verdicts").insert({
      name: parsed.data.name,
      email: parsed.data.email && parsed.data.email.length > 0 ? parsed.data.email : null,
      verdict: parsed.data.verdict,
      message: parsed.data.message,
    });
    setSending(false);
    if (error) {
      setNotice({ title: "Something went wrong", description: "Please try again in a moment." });
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0b0b0d", color: CREAM }}>
      <div className="max-w-2xl mx-auto px-6 py-20 md:py-32">
        <div className="mb-16">
          <a
            href="/"
            className="text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: CREAM }}
          >
            Islam Elgarhi
          </a>
        </div>

        <p className="text-xs uppercase tracking-[0.2em] opacity-70 mb-6">
          Beyond Reasonable Doubt &middot; The Case for Islam
        </p>

        <h1 className="verdict-serif text-4xl md:text-5xl leading-tight mb-8">
          You&rsquo;ve read the case.
          <br />
          What&rsquo;s your verdict?
        </h1>

        <p className="text-base md:text-lg leading-relaxed opacity-85 mb-16">
          If something in the book moved you, challenged you, or left you with a question, I want
          to hear it. I read every message personally. Two things I ask: keep it respectful, and
          put your name to it. This is a sincere exchange between people who care about what is
          true, not an anonymous comment thread.
        </p>

        {submitted ? (
          <div
            className="py-16 border-t border-b"
            style={{ borderColor: "rgba(239, 233, 219, 0.15)" }}
          >
            <p className="verdict-serif text-2xl md:text-3xl leading-snug" style={{ color: CREAM }}>
              Received. Thank you for reading honestly. That is all I ever asked.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label
                htmlFor="verdict-name"
                className="block text-xs uppercase tracking-[0.2em] mb-3 opacity-70"
                style={{ color: CREAM }}
              >
                Name <span className="opacity-60">(required)</span>
              </label>
              <input
                id="verdict-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={200}
                className="w-full bg-transparent border-0 border-b py-2 text-lg focus:outline-none transition-colors"
                style={{ color: CREAM, borderColor: "rgba(239, 233, 219, 0.3)" }}
              />
            </div>

            <div>
              <label
                htmlFor="verdict-email"
                className="block text-xs uppercase tracking-[0.2em] mb-3 opacity-70"
                style={{ color: CREAM }}
              >
                Email <span className="opacity-60">(optional)</span>
              </label>
              <input
                id="verdict-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={320}
                className="w-full bg-transparent border-0 border-b py-2 text-lg focus:outline-none transition-colors"
                style={{ color: CREAM, borderColor: "rgba(239, 233, 219, 0.3)" }}
              />
            </div>

            <fieldset>
              <legend className="text-xs uppercase tracking-[0.2em] mb-4 opacity-70">
                Your verdict <span className="opacity-60">(required)</span>
              </legend>
              <div className="space-y-3">
                {VERDICT_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="verdict"
                      value={opt.value}
                      checked={verdict === opt.value}
                      onChange={() => setVerdict(opt.value)}
                      className="mt-1 accent-current"
                    />
                    <span className="text-base md:text-lg">{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="verdict-message"
                className="block text-xs uppercase tracking-[0.2em] mb-3 opacity-70"
                style={{ color: CREAM }}
              >
                Your thoughts <span className="opacity-60">(required)</span>
              </label>
              <textarea
                id="verdict-message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={5000}
                rows={6}
                placeholder="What moved you, what didn't, or the question you're left with..."
                className="w-full bg-transparent border-0 border-b py-2 text-lg focus:outline-none transition-colors resize-none placeholder:opacity-40"
                style={{ color: CREAM, borderColor: "rgba(239, 233, 219, 0.3)" }}
              />
            </div>

            {notice && (
              <div
                role="alert"
                className="border px-4 py-3 text-sm"
                style={{ borderColor: "rgba(239, 233, 219, 0.4)" }}
              >
                <p className="font-semibold">{notice.title}</p>
                <p className="opacity-80">{notice.description}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="border px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-colors disabled:opacity-50"
              style={{ color: CREAM, borderColor: "rgba(239, 233, 219, 0.6)" }}
            >
              {sending ? "Sending..." : "Send to Islam"}
            </button>
          </form>
        )}

        <p className="mt-24 text-sm opacity-60">
          Beyond Reasonable Doubt: The Case for Islam is available on{" "}
          <a href={AMAZON_URL} className="underline hover:opacity-100">
            Amazon
          </a>
          .
        </p>
      </div>
    </div>
  );
}
