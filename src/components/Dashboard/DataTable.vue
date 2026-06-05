<template>
    <div
        class="w-full overflow-x-auto [-webkit-overflow-scrolling:touch] [&_table]:min-w-[680px] [&_table]:w-full [&_table]:border-collapse [&_td]:border-b [&_td]:border-rule [&_td]:px-3 [&_td]:py-[11px] [&_td]:align-middle [&_td]:text-[13px] [&_td]:text-ink [&_th]:border-b [&_th]:border-rule [&_th]:bg-bg [&_th]:px-3 [&_th]:py-[9px] [&_th]:text-left [&_th]:font-mono [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[.12em] [&_th]:text-muted max-[640px]:[&_table]:min-w-[620px] max-[640px]:[&_td]:px-2.5 max-[640px]:[&_th]:px-2.5"
    >
        <table>
            <slot />
        </table>
    </div>
</template>
