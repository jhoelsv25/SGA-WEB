import { toast } from "sonner";

export function copyValue(value: string, title: string) {
  void navigator.clipboard.writeText(value).then(
    () => {
      toast.success(title);
    },
    () => {
      toast.error("Ocurrio un error al copiar el valor");
    },
  );
}
