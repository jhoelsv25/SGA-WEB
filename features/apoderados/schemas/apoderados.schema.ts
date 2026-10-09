import { z } from "zod";

const gradoInstruccionEnum = z.enum([
  "sin_estudios",
  "primaria",
  "secundaria",
  "tecnica",
  "universitaria",
  "posgrado",
]);

const parentescoEnum = z.enum([
  "padre",
  "madre",
  "abuelo",
  "abuela",
  "hermano",
  "hermana",
  "tio",
  "tia",
  "tutor_legal",
  "otro",
]);

const nuevaPersonaSchema = z.object({
  tipoDocumento: z.enum(["dni", "carne_extranjeria", "pasaporte", "partida_nacimiento"]),
  numeroDocumento: z.string().min(3, "Mínimo 3 caracteres").max(20, "Máximo 20 caracteres"),
  nombres: z.string().min(2, "Los nombres son obligatorios"),
  apellidoPaterno: z.string().min(2, "El apellido paterno es obligatorio"),
  apellidoMaterno: z.string().optional().or(z.literal("")),
  sexo: z.enum(["M", "F"]),
  fechaNacimiento: z.string().optional().or(z.literal("")),
  direccion: z.string().optional().or(z.literal("")),
  distrito: z.string().optional().or(z.literal("")),
  telefono: z.string().optional().or(z.literal("")),
  celular: z.string().optional().or(z.literal("")),
  correo: z.string().email("Correo no válido").optional().or(z.literal("")),
  fotoUrl: z.string().optional().or(z.literal("")),
});

export const createApoderadoSchema = z
  .object({
    personaId: z.string().optional(),
    nuevaPersona: nuevaPersonaSchema.optional(),
    ocupacion: z.string().max(100).optional().or(z.literal("")),
    centroLaboral: z.string().max(150).optional().or(z.literal("")),
    telefonoLaboral: z.string().max(20).optional().or(z.literal("")),
    gradoInstruccion: gradoInstruccionEnum.optional().or(z.literal("")),
    estudianteId: z.string().optional(),
    parentesco: parentescoEnum.optional().or(z.literal("")),
    esPrincipal: z.boolean(),
    viveConEstudiante: z.boolean(),
    autorizadoRecoger: z.boolean(),
    contactoEmergencia: z.boolean(),
  })
  .refine((data) => Boolean(data.personaId) || Boolean(data.nuevaPersona), {
    message: "Debe vincular una persona existente o completar los datos para crearla.",
    path: ["personaId"],
  });

export type CreateApoderadoFormValues = z.infer<typeof createApoderadoSchema>;

export const updateApoderadoSchema = z.object({
  ocupacion: z.string().max(100).optional().or(z.literal("")),
  centroLaboral: z.string().max(150).optional().or(z.literal("")),
  telefonoLaboral: z.string().max(20).optional().or(z.literal("")),
  gradoInstruccion: gradoInstruccionEnum.optional().or(z.literal("")),
});

export type UpdateApoderadoFormValues = z.infer<typeof updateApoderadoSchema>;

export const vincularApoderadoSchema = z.object({
  estudianteId: z.string().min(1, "Debe seleccionar un estudiante"),
  apoderadoId: z.string().min(1, "Debe seleccionar un apoderado"),
  parentesco: parentescoEnum,
  esPrincipal: z.boolean(),
  viveConEstudiante: z.boolean(),
  autorizadoRecoger: z.boolean(),
  contactoEmergencia: z.boolean(),
});

export type VincularApoderadoFormValues = z.infer<typeof vincularApoderadoSchema>;
