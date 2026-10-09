# Errores frecuentes (hallazgos que provocaron un RECHAZO)

| Fecha      | Tarea | Capa         | Error                                                                     | Regla/skill incumplida                                 | Cómo evitarlo                                                                                        |
| ---------- | ----- | ------------ | ------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 2026-10-08 | T01   | commits      | Mensaje de commit sin tildes ni eñes (semanticos, tamanos) pese a pedirlo | conventional-commits (descripción en español correcto) | Escribir el mensaje con tildes y eñes; revisarlo antes de commitear                                  |
| 2026-10-08 | Ola 3 | orquestación | Claude lanzó 6 VAL a la vez (T06 y T07), por encima del máximo de 3       | R6 (máximo 3 VAL simultáneos)                          | Encolar las validaciones: lanzar los 3 VAL de la siguiente tarea solo cuando terminen los anteriores |
