import { defineStore } from "pinia";


export const useDarkModeStore = defineStore("dark-mode", {
    state: () => ({
        is_dark_mode: false,
    }),

    actions: {
        init(): void {
            const stored_preference = localStorage.getItem('dark-mode');

            if ( stored_preference !== null )
            {
                this.is_dark_mode = (stored_preference === "true")
            }
            else
            {
                this.is_dark_mode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            this.apply_dark_mode();
        },

        toggle_dark_mode(): void {
            this.is_dark_mode = !this.is_dark_mode;
            this.apply_dark_mode()
        },

        apply_dark_mode(): void {
            if (this.is_dark_mode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }

            localStorage.setItem('dark-mode', String(this.is_dark_mode));
        },
    },
});