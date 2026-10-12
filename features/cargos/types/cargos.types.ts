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

export interface CreateCargoInput {
  nombre: string;
  descripcion?: string;
  rolesSugeridosIds?: string[];
}

export interface UpdateCargoInput {
  nombre?: string;
  descripcion?: string;
  rolesSugeridosIds?: string[];
}
