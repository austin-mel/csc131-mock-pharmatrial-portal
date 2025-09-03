import { type Component } from "vue";

import { LinkedInIcon, GithubIcon, WebIcon  } from "@/assets";


interface SocialMediaLink
{
    icon: Component;

    href: string;

    name: string;
}


export const links: SocialMediaLink[] = [
    {
        icon: WebIcon,
        href: "https://www.austinmelendez.com",
        name: "Portfolio"
    },
    {
        icon: GithubIcon,
        href: "https://github.com/austin-mel",
        name: "Personal GitHub"
    },
        {
        icon: LinkedInIcon,
        href: "https://www.linkedin.com/in/austin-melendez",
        name: "LinkedIn"
    },
            {
        icon: GithubIcon,
        href: "https://github.com/austin-mel-edu",
        name: "edu GitHub"
    },
];