import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ApiConnectionError, ApiError, pharmatrialApi, setAuthToken } from "@/api";
import { seedPortals } from "@/data";
import type { Portal, PortalId } from "@/types";

const demoCredentials: Record<PortalId, { email: string; password: string }> = {
    "jh-doctor": { email: "doctor@jh.example", password: "jh-doctor-demo" },
    "jh-admin": { email: "admin@jh.example", password: "jh-admin-demo" },
    fda: { email: "admin@fda.example", password: "fda-demo" },
    bavaria: { email: "admin@bavaria.example", password: "bavaria-demo" },
};

export const useAuthStore = defineStore("auth", () => {
    const selectedPortalId = ref<PortalId>("jh-doctor");
    const loggedIn = ref(false);
    const error = ref<string | null>(null);

    const portals = seedPortals;
    const selectedPortal = computed(
        () =>
            portals.find(
                (portal) => portal.id === selectedPortalId.value,
            ) as Portal,
    );
    const currentPortal = computed(() =>
        loggedIn.value ? selectedPortal.value : null,
    );
    const isLoggedIn = computed(() => loggedIn.value);

    function selectPortal(portalId: PortalId) {
        selectedPortalId.value = portalId;
    }

    async function login(
        email = demoCredentials[selectedPortalId.value].email,
        password = demoCredentials[selectedPortalId.value].password,
    ) {
        const credentials = demoCredentials[selectedPortalId.value];
        if (!pharmatrialApi.demoLoginEnabled) {
            try {
                await pharmatrialApi.login(
                    selectedPortalId.value,
                    email,
                    password,
                );
                loggedIn.value = true;
                error.value = null;
                return true;
            } catch (cause) {
                setAuthToken(null);
                loggedIn.value = false;
                if (cause instanceof ApiError) {
                    error.value = cause.status === 401
                        ? "Invalid email or password for selected portal!"
                        : "The sign-in service returned an error. Please try again.";
                    return false;
                } else if (!(cause instanceof ApiConnectionError)) {
                    error.value = cause instanceof Error
                        ? cause.message
                        : "Could not connect to the sign-in service. Please try again.";
                    return false;
                }
                // Connection failures continue through the normal demo credential check.
            }
        }

        if (
            email.trim().toLowerCase() !== credentials.email ||
            password !== credentials.password
        ) {
            loggedIn.value = false;
            error.value = "Invalid email or password for selected portal!";
            return false;
        }
        loggedIn.value = true;
        error.value = null;
        return true;
    }

    function logout() {
        loggedIn.value = false;
        error.value = null;
        setAuthToken(null);
    }

    return {
        portals,
        selectedPortalId,
        selectedPortal,
        currentPortal,
        isLoggedIn,
        error,
        selectPortal,
        login,
        logout,
    };
});
