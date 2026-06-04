import { CreateCarPayload } from '../models/car.model';

const CAR_BRANDS = [
  'Tesla',
  'Ford',
  'Chevrolet',
  'BMW',
  'Audi',
  'Mercedes',
  'Toyota',
  'Honda',
  'Nissan',
  'Porsche',
  'Lamborghini',
  'Ferrari',
];

const CAR_MODELS = [
  'Model S',
  'Mustang',
  'Camaro',
  'M3',
  'RS6',
  'C-Class',
  'Supra',
  'Civic',
  'GT-R',
  '911',
  'Huracan',
  'F40',
];

const RGB_MAX = 256;
const HEX_BASE = 16;
const HEX_PAD = 2;

function randomItem<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index] as T;
}

export function randomCarName(): string {
  return `${randomItem(CAR_BRANDS)} ${randomItem(CAR_MODELS)}`;
}

export function randomColor(): string {
  const channel = (): string =>
    Math.floor(Math.random() * RGB_MAX)
      .toString(HEX_BASE)
      .padStart(HEX_PAD, '0');
  return `#${channel()}${channel()}${channel()}`;
}

export function randomCar(): CreateCarPayload {
  return { name: randomCarName(), color: randomColor() };
}

export function randomCars(count: number): CreateCarPayload[] {
  return Array.from({ length: count }, () => randomCar());
}
