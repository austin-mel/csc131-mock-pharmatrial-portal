import type { Appointment, AppointmentDraft, TrialEnrollment } from "@/types";

export const appointmentTypes = [
    "Dose Administration",
    "Follow-up Evaluation",
    "Initial Screening",
    "Post-Trial Assessment",
] as const;

export function buildAppointment(draft: AppointmentDraft): Appointment {
    const isDose = draft.type === "Dose Administration";

    return {
        date: draft.date,
        time: draft.time,
        type: draft.type,
        dose: isDose,
        bloodTestLevel: Number.isFinite(draft.bloodTestLevel)
            ? draft.bloodTestLevel
            : null,
        adverseEvents: draft.adverseEvents
            .map((event) => event.trim())
            .filter(Boolean),
        note: draft.note.trim() || "No notes.",
    };
}

export function logAppointment(
    enrollment: TrialEnrollment,
    dosesPerPatient: number,
    draft: AppointmentDraft,
): Appointment {
    const appointment = buildAppointment(draft);
    enrollment.appointments.push(appointment);

    if (appointment.dose && enrollment.doses < dosesPerPatient) {
        enrollment.doses += 1;
    }

    return appointment;
}
