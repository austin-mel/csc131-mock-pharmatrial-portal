import { z } from "zod";


export namespace AddressSchema {
    export const GetDTO = z.object({
        address_line_1: z.string().optional(),

        address_line_2: z.string().optional(),

        address_line_3: z.string().optional(),

        city:           z.string().optional(),

        state:          z.string().optional(),

        postal_code:    z.string().optional(),
    })
}

export namespace AddressDTO {
    export type Get = z.infer<typeof AddressSchema.GetDTO>;
}