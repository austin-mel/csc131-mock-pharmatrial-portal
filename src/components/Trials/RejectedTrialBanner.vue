<template>
    <section
        class="border-y-4 border-[#c0392b] bg-[#fdf0ee] px-7 py-6 text-[#9b1c11] shadow-[0_8px_24px_rgba(192,57,43,.22)] max-[640px]:px-4 max-[640px]:py-5"
    >
        <div class="flex max-w-5xl items-start gap-4">
            <div
                class="grid size-14 shrink-0 place-items-center rounded-full bg-[#c0392b] text-white shadow-[0_4px_12px_rgba(192,57,43,.35)] max-[640px]:size-12"
            >
                <svg
                    class="size-8 max-[640px]:size-7"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M6 6l12 12M18 6 6 18"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                    />
                </svg>
            </div>
            <div class="min-w-0">
                <div
                    class="text-3xl font-black uppercase leading-none tracking-[.08em] max-[640px]:text-2xl"
                >
                    Trial Rejected
                </div>
                <div
                    class="mt-2 text-base font-bold leading-snug max-[640px]:text-sm"
                >
                    This trial has been rejected and is locked from approval
                    workflow actions.
                </div>
            </div>
        </div>
    </section>
</template>
