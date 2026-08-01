import {
  DENSITY_SCALE,
  FONT_STACK,
  type Education,
  type Experience,
  type Project,
  type ResumeData,
  type ResumeSettings,
} from "@/utils/resume/types";

interface TemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

const contactList = (d: ResumeData) =>
  [d.location, d.phone, d.email, d.linkedin, d.github, d.website].filter(Boolean);

const Bullets = ({ value, size }: { value: string; size: number }) => {
  const items = value.split("\n").map((v) => v.trim()).filter(Boolean);
  if (!items.length) return null;
  return (
    <ul className="ml-4 list-disc space-y-[2px]" style={{ fontSize: `${size}pt`, lineHeight: 1.45 }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
};

const Section = ({
  title,
  accent,
  children,
  underline = true,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
  underline?: boolean;
}) => (
  <section className="mb-4">
    <h3
      className="mb-[5px] font-bold uppercase"
      style={{
        color: accent,
        fontSize: "9.5pt",
        letterSpacing: "0.16em",
        borderBottom: underline ? `1px solid ${accent}` : undefined,
        paddingBottom: underline ? 3 : 0,
      }}
    >
      {title}
    </h3>
    {children}
  </section>
);

/** A4 paper wrapper shared by every template. */
const Paper = ({
  settings,
  children,
  padded = true,
}: {
  settings: ResumeSettings;
  children: React.ReactNode;
  padded?: boolean;
}) => {
  const scale = DENSITY_SCALE[settings.density];
  return (
    <div
      className="w-[210mm] bg-white text-black"
      style={{
        minHeight: "297mm",
        fontFamily: FONT_STACK[settings.font],
        lineHeight: 1.45 * scale,
        padding: padded ? `${14 * scale}mm ${15 * scale}mm` : undefined,
      }}
    >
      {children}
    </div>
  );
};

/* --------------------------------- ATS Prime -------------------------------- */
export const ATSPrimeTemplate = ({ data, settings }: TemplateProps) => {
  const accent = settings.accent;
  return (
    <Paper settings={settings}>
      <header style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 10 }}>
        <div className="font-bold leading-none" style={{ fontSize: "24pt", color: accent }}>
          {data.name}
        </div>
        {data.title && (
          <div className="mt-[6px]" style={{ fontSize: "12pt", color: "#444" }}>
            {data.title}
          </div>
        )}
        <div className="mt-[8px]" style={{ fontSize: "9.5pt", color: "#555" }}>
          {contactList(data).join("  |  ")}
        </div>
      </header>

      <div className="mt-4">
        {data.summary && (
          <Section title="Professional Summary" accent={accent}>
            <p style={{ fontSize: "10pt" }}>{data.summary}</p>
          </Section>
        )}

        {!!data.experience.length && (
          <Section title="Professional Experience" accent={accent}>
            {data.experience.map((item: Experience) => (
              <div key={item.id} className="mb-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-bold" style={{ fontSize: "11pt" }}>
                    {[item.role, item.company].filter(Boolean).join(" | ")}
                  </span>
                  <span style={{ fontSize: "9.5pt", color: "#666" }}>
                    {[item.start, item.end].filter(Boolean).join(" – ")}
                  </span>
                </div>
                {item.location && (
                  <div className="italic" style={{ fontSize: "9.5pt", color: "#666" }}>
                    {item.location}
                  </div>
                )}
                <Bullets value={item.bullets} size={10} />
              </div>
            ))}
          </Section>
        )}

        {!!data.projects.length && (
          <Section title="Projects" accent={accent}>
            {data.projects.map((item: Project) => (
              <div key={item.id} className="mb-[10px]">
                <div className="font-bold" style={{ fontSize: "10.5pt" }}>
                  {item.name}
                  {item.tech && <span className="font-normal" style={{ color: "#666" }}> | {item.tech}</span>}
                </div>
                {item.link && <div style={{ fontSize: "9pt", color: "#666" }}>{item.link}</div>}
                <Bullets value={item.bullets} size={10} />
              </div>
            ))}
          </Section>
        )}

        {!!data.education.length && (
          <Section title="Education" accent={accent}>
            {data.education.map((item: Education) => (
              <div key={item.id} className="mb-2" style={{ fontSize: "10pt" }}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-bold">{item.degree}</span>
                  <span style={{ fontSize: "9pt", color: "#666" }}>
                    {[item.start, item.end].filter(Boolean).join(" – ")}
                  </span>
                </div>
                <div>{[item.school, item.location].filter(Boolean).join(", ")}</div>
                {item.details && <div style={{ fontSize: "9pt", color: "#666" }}>{item.details}</div>}
              </div>
            ))}
          </Section>
        )}

        {data.skills && (
          <Section title="Skills" accent={accent}>
            <div className="whitespace-pre-line" style={{ fontSize: "10pt" }}>{data.skills}</div>
          </Section>
        )}

        {data.awards && (
          <Section title="Certifications & Awards" accent={accent}>
            <Bullets value={data.awards} size={10} />
          </Section>
        )}

        {data.languages && (
          <Section title="Languages" accent={accent}>
            <div style={{ fontSize: "10pt" }}>{data.languages}</div>
          </Section>
        )}
      </div>
    </Paper>
  );
};

/* --------------------------------- Boardroom -------------------------------- */
export const BoardroomTemplate = ({ data, settings }: TemplateProps) => {
  const accent = settings.accent;
  return (
    <Paper settings={settings}>
      <header className="mb-5 text-center" style={{ borderBottom: `3px double ${accent}`, paddingBottom: 12 }}>
        <div className="font-bold" style={{ fontSize: "27pt", color: accent, letterSpacing: "0.02em" }}>
          {data.name}
        </div>
        <div className="mt-[6px] uppercase" style={{ fontSize: "10.5pt", letterSpacing: "0.24em", color: "#555" }}>
          {data.title}
        </div>
        <div className="mt-[10px]" style={{ fontSize: "9pt", color: "#666" }}>
          {contactList(data).join("   \u00B7   ")}
        </div>
      </header>

      {data.summary && (
        <Section title="Executive Summary" accent={accent}>
          <p style={{ fontSize: "10.5pt", lineHeight: 1.6 }}>{data.summary}</p>
        </Section>
      )}

      {!!data.experience.length && (
        <Section title="Professional Experience" accent={accent}>
          {data.experience.map((item: Experience) => (
            <div key={item.id} className="mb-3">
              <div className="font-bold" style={{ fontSize: "11.5pt", color: accent }}>{item.role}</div>
              <div className="italic" style={{ fontSize: "10pt", color: "#555" }}>
                {[item.company, item.location, [item.start, item.end].filter(Boolean).join(" – ")].filter(Boolean).join("  \u00B7  ")}
              </div>
              <Bullets value={item.bullets} size={10} />
            </div>
          ))}
        </Section>
      )}

      <div className="grid gap-7" style={{ gridTemplateColumns: "1.3fr 0.7fr" }}>
        <div>
          {!!data.projects.length && (
            <Section title="Selected Engagements" accent={accent}>
              {data.projects.map((item: Project) => (
                <div key={item.id} className="mb-[10px]">
                  <div className="font-bold" style={{ fontSize: "10.5pt" }}>{item.name}</div>
                  {item.tech && <div style={{ fontSize: "9pt", color: "#666" }}>{item.tech}</div>}
                  <Bullets value={item.bullets} size={9.5} />
                </div>
              ))}
            </Section>
          )}
          {data.awards && (
            <Section title="Honors & Certifications" accent={accent}>
              <Bullets value={data.awards} size={9.5} />
            </Section>
          )}
        </div>
        <div>
          {!!data.education.length && (
            <Section title="Education" accent={accent}>
              {data.education.map((item: Education) => (
                <div key={item.id} className="mb-[10px]" style={{ fontSize: "9.5pt" }}>
                  <div className="font-bold">{item.degree}</div>
                  <div>{item.school}</div>
                  <div style={{ color: "#666" }}>
                    {[item.location, [item.start, item.end].filter(Boolean).join(" – ")].filter(Boolean).join(" \u00B7 ")}
                  </div>
                  {item.details && <div style={{ color: "#666" }}>{item.details}</div>}
                </div>
              ))}
            </Section>
          )}
          {data.skills && (
            <Section title="Core Competencies" accent={accent}>
              <div className="whitespace-pre-line" style={{ fontSize: "9.5pt" }}>{data.skills}</div>
            </Section>
          )}
          {data.languages && (
            <Section title="Languages" accent={accent}>
              <div style={{ fontSize: "9.5pt" }}>{data.languages}</div>
            </Section>
          )}
        </div>
      </div>
    </Paper>
  );
};

/* ----------------------------- Signature Modern ----------------------------- */
export const SignatureModernTemplate = ({ data, settings }: TemplateProps) => {
  const accent = settings.accent;
  const scale = DENSITY_SCALE[settings.density];
  return (
    <Paper settings={settings} padded={false}>
      <div style={{ background: accent, color: "#fff", padding: `${11 * scale}mm ${15 * scale}mm` }}>
        <div className="font-bold leading-none" style={{ fontSize: "27pt" }}>{data.name}</div>
        <div className="mt-[8px]" style={{ fontSize: "12pt", opacity: 0.92 }}>{data.title}</div>
        <div className="mt-[10px] flex flex-wrap gap-x-4 gap-y-1" style={{ fontSize: "9.5pt", opacity: 0.9 }}>
          {contactList(data).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-7" style={{ gridTemplateColumns: "0.64fr 0.36fr", padding: `${10 * scale}mm ${15 * scale}mm` }}>
        <div>
          {data.summary && (
            <Section title="Profile" accent={accent}>
              <p style={{ fontSize: "10pt" }}>{data.summary}</p>
            </Section>
          )}
          {!!data.experience.length && (
            <Section title="Experience" accent={accent}>
              {data.experience.map((item: Experience) => (
                <div key={item.id} className="mb-3 pl-3" style={{ borderLeft: `2px solid ${accent}` }}>
                  <div className="font-bold" style={{ fontSize: "11pt" }}>{item.role}</div>
                  <div style={{ fontSize: "9.5pt", color: "#666" }}>
                    {[item.company, item.location, [item.start, item.end].filter(Boolean).join(" – ")].filter(Boolean).join("  \u00B7  ")}
                  </div>
                  <Bullets value={item.bullets} size={9.5} />
                </div>
              ))}
            </Section>
          )}
          {!!data.projects.length && (
            <Section title="Projects" accent={accent}>
              {data.projects.map((item: Project) => (
                <div key={item.id} className="mb-[10px]">
                  <div className="font-bold" style={{ fontSize: "10.5pt" }}>
                    {item.name}
                    {item.tech && <span className="font-normal" style={{ color: "#666" }}> — {item.tech}</span>}
                  </div>
                  <Bullets value={item.bullets} size={9.5} />
                </div>
              ))}
            </Section>
          )}
        </div>
        <div>
          {data.skills && (
            <Section title="Skills" accent={accent}>
              <div className="whitespace-pre-line" style={{ fontSize: "9.5pt" }}>{data.skills}</div>
            </Section>
          )}
          {!!data.education.length && (
            <Section title="Education" accent={accent}>
              {data.education.map((item: Education) => (
                <div key={item.id} className="mb-[10px]" style={{ fontSize: "9.5pt" }}>
                  <div className="font-bold">{item.degree}</div>
                  <div>{item.school}</div>
                  <div style={{ color: "#666" }}>{[item.start, item.end].filter(Boolean).join(" – ")}</div>
                  {item.details && <div style={{ color: "#666" }}>{item.details}</div>}
                </div>
              ))}
            </Section>
          )}
          {data.awards && (
            <Section title="Recognition" accent={accent}>
              <div className="whitespace-pre-line" style={{ fontSize: "9.5pt" }}>{data.awards}</div>
            </Section>
          )}
          {data.languages && (
            <Section title="Languages" accent={accent}>
              <div style={{ fontSize: "9.5pt" }}>{data.languages}</div>
            </Section>
          )}
        </div>
      </div>
    </Paper>
  );
};

/* ------------------------------ One-Page Compact ---------------------------- */
export const CompactTemplate = ({ data, settings }: TemplateProps) => {
  const accent = settings.accent;
  return (
    <Paper settings={settings}>
      <header className="mb-3 flex items-end justify-between gap-6" style={{ borderBottom: `1.5px solid ${accent}`, paddingBottom: 8 }}>
        <div>
          <div className="font-bold leading-none" style={{ fontSize: "21pt" }}>{data.name}</div>
          <div style={{ fontSize: "10.5pt", color: accent, marginTop: 4 }}>{data.title}</div>
        </div>
        <div className="text-right" style={{ fontSize: "8.5pt", color: "#555", lineHeight: 1.5 }}>
          {contactList(data).map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </header>

      {data.summary && <p className="mb-3" style={{ fontSize: "9.5pt" }}>{data.summary}</p>}

      {data.skills && (
        <Section title="Skills" accent={accent} underline={false}>
          <div className="whitespace-pre-line" style={{ fontSize: "9pt", lineHeight: 1.4 }}>{data.skills}</div>
        </Section>
      )}

      {!!data.experience.length && (
        <Section title="Experience" accent={accent} underline={false}>
          {data.experience.map((item: Experience) => (
            <div key={item.id} className="mb-[10px]">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-bold" style={{ fontSize: "10pt" }}>
                  {[item.role, item.company].filter(Boolean).join(", ")}
                </span>
                <span style={{ fontSize: "8.5pt", color: "#666" }}>
                  {[item.start, item.end].filter(Boolean).join(" – ")}
                </span>
              </div>
              <Bullets value={item.bullets} size={9} />
            </div>
          ))}
        </Section>
      )}

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          {!!data.projects.length && (
            <Section title="Projects" accent={accent} underline={false}>
              {data.projects.map((item: Project) => (
                <div key={item.id} className="mb-2">
                  <div className="font-bold" style={{ fontSize: "9.5pt" }}>{item.name}</div>
                  <Bullets value={item.bullets} size={9} />
                </div>
              ))}
            </Section>
          )}
        </div>
        <div>
          {!!data.education.length && (
            <Section title="Education" accent={accent} underline={false}>
              {data.education.map((item: Education) => (
                <div key={item.id} className="mb-2" style={{ fontSize: "9pt" }}>
                  <div className="font-bold">{item.degree}</div>
                  <div>{item.school}</div>
                  <div style={{ color: "#666" }}>{[item.start, item.end].filter(Boolean).join(" – ")}</div>
                </div>
              ))}
            </Section>
          )}
          {data.awards && (
            <Section title="Awards" accent={accent} underline={false}>
              <div className="whitespace-pre-line" style={{ fontSize: "9pt" }}>{data.awards}</div>
            </Section>
          )}
        </div>
      </div>
    </Paper>
  );
};

export const RESUME_TEMPLATES = {
  ats: ATSPrimeTemplate,
  executive: BoardroomTemplate,
  signature: SignatureModernTemplate,
  compact: CompactTemplate,
} as const;
