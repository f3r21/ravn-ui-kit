import { DUE_DATE_URGENCY_LABEL, type DueDateUrgency } from '../../types/color-variants';

export interface DueDateUrgencyStateProps {
  /** Which urgency to announce. */
  urgency: DueDateUrgency;
  /** Per-urgency overrides, merged over `DUE_DATE_URGENCY_LABEL`. */
  labels?: Partial<Record<DueDateUrgency, string>>;
}

/**
 * The spoken half of a due date's urgency — an `sr-only` node carrying the state that the
 * colour used to convey on its own (#92, WCAG 2.2 1.4.1).
 *
 * **Deliberately not exported from the barrel.** It is the shared implementation behind
 * `TaskCard.dueDateUrgencyLabel` and `DueDateCell.urgencyLabel`, and it exists as its own
 * module rather than living in either of them so that neither has to import the other —
 * the same reason `DUE_DATE_URGENCY_COLOR` sits in `types/` rather than in whichever
 * component happened to need it first. A consumer composes this through those props, not
 * directly.
 *
 * Renders **nothing at all** for an empty label rather than an empty `<span>`. That is what
 * makes "say nothing when there is nothing to say" a property of this one component instead
 * of a condition each caller re-implements and one of them eventually gets wrong — and it is
 * what the `normal` control in `task-card.test.tsx` is asserting against.
 *
 * The `', '` is punctuation for speech pacing and belongs here; the label is the consumer's
 * and is announced verbatim after it. Same idiom as `TopNav.notificationsLabel`'s
 * "Notifications, 3 unread".
 */
export function DueDateUrgencyState({ urgency, labels }: DueDateUrgencyStateProps) {
  const label = labels?.[urgency] ?? DUE_DATE_URGENCY_LABEL[urgency];
  if (!label) return null;
  return <span className="sr-only">, {label}</span>;
}
