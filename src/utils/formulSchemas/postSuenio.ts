import * as z from "zod";

export const postSueniosSchema = z.object({
    story: z
        .string()
        .min(100, "Muy corto, contanos algo interesante, minimo 100 carácteres.")
        .max(1000, "Muy largooo, máximo 1000 caracteres"),
    title: z.string(),
    anonymous: z.boolean().default(false),
    imagenes: z.any(),
    idCategory: z.array(z.string()).min(1, "Al menos elegí una"),
});