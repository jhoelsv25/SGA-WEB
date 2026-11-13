export interface PortalFaqItem {
  question: string;
  answer: string;
  category: string;
}

export const PORTAL_FAQS: readonly PortalFaqItem[] = [
  {
    category: "Acceso",
    question: "¿Cómo ingreso por primera vez o si olvidé mi contraseña?",
    answer:
      "La cuenta la crea el colegio y te entrega una contraseña temporal. Al ingresar por primera vez debes cambiarla por una propia (mínimo 8 caracteres, con letras y números). Si la olvidaste, usa «¿Olvidaste tu contraseña?» en el inicio de sesión con tu usuario y tu fecha de nacimiento.",
  },
  {
    category: "Asistencia",
    question: "¿Cómo funciona el kiosko de marcación?",
    answer:
      "El kiosko está en equipos autorizados dentro del colegio. Cada persona marca su ingreso y salida con su código personal; el sistema registra la hora y calcula la tardanza según el turno y su tolerancia.",
  },
  {
    category: "Libretas",
    question: "¿Dónde veo las notas y la libreta?",
    answer:
      "La libreta oficial es la del SIAGIE: el colegio la carga en PDF y el estudiante y su apoderado pueden descargarla. Las únicas notas que se registran en el sistema son las del aula virtual de reforzamiento.",
  },
  {
    category: "Privacidad",
    question: "¿Cómo se protegen los datos de los estudiantes?",
    answer:
      "El acceso es por rol, las contraseñas se guardan cifradas y los cambios importantes quedan en la bitácora de auditoría. Los datos se tratan conforme a la Ley N.° 29733 de Protección de Datos Personales.",
  },
  {
    category: "Dispositivos",
    question: "¿Puedo usarlo desde el celular?",
    answer:
      "Sí. Funciona en el navegador del celular, la tablet o la computadora, sin instalar nada.",
  },
];
