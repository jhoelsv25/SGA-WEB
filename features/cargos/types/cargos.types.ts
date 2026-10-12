export interface CargoRol {
  id: string;
  nombre: string;
}

export interface CargoItem {
  id: string;
  nombre: string;
  descripcion?: string | null;
  vigente: boolean;
  rolesSugeridos: CargoRol[];
  personasCount: number;
}
