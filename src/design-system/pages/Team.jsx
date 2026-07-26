import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';
import TeamCard from '../../components/TeamCard';
import { TEAM } from '../../data/team';

export default function Team() {
  return (
    <div>
      <PageHeader
        kicker="Site Modules · 03"
        title="Team card"
        lede="Profiles for the Team page. Avatar, role, brief bio, and links to LinkedIn and ORCID profiles where available."
      />
      <Section title="Grid">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {TEAM.map((p, i) => (
            <TeamCard key={i} p={p} />
          ))}
        </div>
      </Section>
      <Section
        title="Avatar handling"
        description={"Per the photo policy, profile photos are used only with explicit consent and only when sourced from Jigsaw's own work. The duotone treatment (navy multiply over a desaturated photo) gives every avatar the same on-brand temperature. The fallback is a coloured initials avatar derived from the team member's name — distinctive without ever falling back to stock or AI-generated imagery."}
      />
    </div>
  );
}
