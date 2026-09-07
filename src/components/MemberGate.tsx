import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";

interface MemberGateProps {
  title: string;
  children: React.ReactNode;
  source: string;
}

export function MemberGate({ title, children, source }: MemberGateProps) {
  return (
    <section className="member-gate" aria-labelledby="member-gate-title">
      <LockKeyhole aria-hidden="true" />
      <div>
        <span>Member access</span>
        <h2 id="member-gate-title">{title}</h2>
        <p>{children}</p>
      </div>
      <Link className="primary-button" href={`/membership?source=${source}`}>
        View membership <ArrowRight aria-hidden="true" />
      </Link>
    </section>
  );
}
