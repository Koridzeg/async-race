export interface Car {
  id: number;
  name: string;
  color: string;
}

export type CreateCarPayload = Omit<Car, 'id'>;

export type UpdateCarPayload = Omit<Car, 'id'>;
