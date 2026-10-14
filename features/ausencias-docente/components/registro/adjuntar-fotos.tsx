"use client";

import * as React from "react";
import { Camera01Icon, ImageAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FOTO_ACCEPT, LIMITE_MAXIMO_FOTOS } from "../../consts";
import { validarArchivoFoto } from "../../utils";
import { MiniaturaFoto } from "./miniatura-foto";
import type { FotoEvidenciaLocal } from "./types";

interface AdjuntarFotosProps {
  fotos: FotoEvidenciaLocal[];
  onFotosChange: (fotos: FotoEvidenciaLocal[]) => void;
  disabled?: boolean;
}

/**
 * Componente para captura y adjunto de evidencias fotográficas en el registro de ausencia.
 * Permite tomar foto directamente con la cámara en dispositivos móviles o seleccionar
 * imágenes de la galería, con validación local de formato PNG/JPG ≤ 5 MB y vista previa.
 */
export function AdjuntarFotos({ fotos, onFotosChange, disabled = false }: AdjuntarFotosProps) {
  const inputGaleriaRef = React.useRef<HTMLInputElement | null>(null);
  const inputCamaraRef = React.useRef<HTMLInputElement | null>(null);
  const [errorLocal, setErrorLocal] = React.useState<string | null>(null);

  // Limpieza de URLs blob para evitar fugas de memoria al desmontar
  React.useEffect(() => {
    return () => {
      fotos.forEach((foto) => {
        URL.revokeObjectURL(foto.previewUrl);
      });
    };
  }, [fotos]);

  const procesarArchivos = React.useCallback(
    (lista: FileList | null) => {
      if (!lista || lista.length === 0) return;
      setErrorLocal(null);

      const nuevosArchivos = Array.from(lista);

      if (fotos.length + nuevosArchivos.length > LIMITE_MAXIMO_FOTOS) {
        setErrorLocal(`Solo se permite adjuntar hasta un máximo de ${LIMITE_MAXIMO_FOTOS} fotos.`);
        return;
      }

      const fotosAgregadas: FotoEvidenciaLocal[] = [];

      for (const archivo of nuevosArchivos) {
        const errorValidacion = validarArchivoFoto(archivo);
        if (errorValidacion) {
          setErrorLocal(errorValidacion);
          return;
        }

        // CP-RF012-08: Captura fecha y hora de la foto (lastModified o momento de captura)
        const fechaCaptura = archivo.lastModified
          ? new Date(archivo.lastModified).toISOString()
          : new Date().toISOString();

        fotosAgregadas.push({
          id: `${archivo.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          archivo,
          previewUrl: URL.createObjectURL(archivo),
          tomadaEn: fechaCaptura,
        });
      }

      onFotosChange([...fotos, ...fotosAgregadas]);
    },
    [fotos, onFotosChange],
  );

  const handleGaleriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    procesarArchivos(e.target.files);
    e.target.value = "";
  };

  const handleCamaraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    procesarArchivos(e.target.files);
    e.target.value = "";
  };

  const handleQuitarFoto = (id: string) => {
    const fotoAEliminar = fotos.find((f) => f.id === id);
    if (fotoAEliminar) {
      URL.revokeObjectURL(fotoAEliminar.previewUrl);
    }
    setErrorLocal(null);
    onFotosChange(fotos.filter((f) => f.id !== id));
  };

  const limiteAlcanzado = fotos.length >= LIMITE_MAXIMO_FOTOS;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Fotos de evidencia (Opcional)</Label>
        <span className="text-muted-foreground text-xs">
          {fotos.length} de {LIMITE_MAXIMO_FOTOS}
        </span>
      </div>

      {/* Inputs ocultos accesibles mediante botones */}
      <input
        ref={inputGaleriaRef}
        type="file"
        accept={FOTO_ACCEPT}
        multiple
        tabIndex={-1}
        className="sr-only"
        onChange={handleGaleriaChange}
        disabled={disabled || limiteAlcanzado}
        aria-hidden="true"
      />
      <input
        ref={inputCamaraRef}
        type="file"
        accept={FOTO_ACCEPT}
        capture="environment"
        tabIndex={-1}
        className="sr-only"
        onChange={handleCamaraChange}
        disabled={disabled || limiteAlcanzado}
        aria-hidden="true"
      />

      {/* Botones de acción para celular y escritorio con tamaño táctil min-h-10 */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputCamaraRef.current?.click()}
          disabled={disabled || limiteAlcanzado}
          className="min-h-10 gap-1.5 rounded-full px-3.5 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Camera01Icon} className="size-3.5" aria-hidden="true" />
          <span>Tomar foto</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputGaleriaRef.current?.click()}
          disabled={disabled || limiteAlcanzado}
          className="min-h-10 gap-1.5 rounded-full px-3.5 text-xs font-semibold"
        >
          <HugeiconsIcon icon={ImageAdd01Icon} className="size-3.5" aria-hidden="true" />
          <span>Agregar foto</span>
        </Button>
      </div>

      <p className="text-muted-foreground text-xs">
        PNG o JPG de hasta 5 MB por foto. En celular puedes usar la cámara o elegir de la galería.
      </p>

      {errorLocal && <p className="text-destructive text-xs font-medium">{errorLocal}</p>}

      {/* Miniaturas de vista previa */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5 pt-1 sm:grid-cols-3">
          {fotos.map((foto, index) => (
            <MiniaturaFoto
              key={foto.id}
              foto={foto}
              index={index}
              onQuitar={handleQuitarFoto}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
