import React, {useState, useSyncExternalStore} from 'react';
import {CheckCircle2, Minus, Plus} from 'lucide-react';

const mobileQuery = '(max-width: 600px)';
function subscribeToScreen(onChange) {
  const screen = window.matchMedia(mobileQuery);
  screen.addEventListener('change', onChange);
  return () => screen.removeEventListener('change', onChange);
}
const isMobileScreen = () => window.matchMedia(mobileQuery).matches;

export default function SkillCard({skill, Icon, index}) {
  const isMobile = useSyncExternalStore(subscribeToScreen, isMobileScreen, () => false);
  const [expanded, setExpanded] = useState(false);
  const titleId = `skill-title-${index}`;
  const listId = `skill-list-${index}`;
  const Indicator = expanded ? Minus : Plus;

  return (
    <article className={`skill-card skill-card-${index + 1}`}>
      {isMobile ? (
        <h3 id={titleId} className="skill-heading">
          <button className="skill-toggle" type="button" aria-expanded={expanded}
            aria-controls={listId} onClick={() => setExpanded(value => !value)}>
            <span className="skill-icon"><Icon size={25} aria-hidden="true"/></span>
            <span>{skill.title}</span>
            <Indicator size={20} className="skill-indicator" aria-hidden="true"/>
          </button>
        </h3>
      ) : (
        <>
          <div className="skill-icon"><Icon size={25} aria-hidden="true"/></div>
          <h3 id={titleId}>{skill.title}</h3>
        </>
      )}
      <ul id={listId} aria-labelledby={titleId} hidden={isMobile && !expanded}>
        {skill.items.map(item => <li key={item}><CheckCircle2 size={17} aria-hidden="true"/>{item}</li>)}
      </ul>
    </article>
  );
}
