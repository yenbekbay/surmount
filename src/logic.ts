import {UserSettings, CigarettesPerDay} from './types';

export const SMOKE_FREE_PROGRAM_DAYS = 60;

export const ONE_CIGARETTE_PACK_PRICE_EUR = 6;

export const CIGARETTES_IN_ONE_PACK = 20;

export const countForCigarettesPerDay = (cigarettesPerDay: CigarettesPerDay) =>
  ({
    [CigarettesPerDay.FiveOrFewer]: 5,
    [CigarettesPerDay.FiveToTen]: 10,
    [CigarettesPerDay.TenToThirty]: 30,
    [CigarettesPerDay.ThirtyOrMore]: 50,
  }[cigarettesPerDay]);

export const calculateMoneySaved = ({
  smokeFreeDays,
  userSettings,
}: {
  smokeFreeDays: number;
  userSettings: UserSettings;
}) => {
  const cigarettesAvoided =
    countForCigarettesPerDay(userSettings.cigarettesPerDay) * smokeFreeDays;
  const cigarettePacksAvoided = Math.ceil(
    cigarettesAvoided / CIGARETTES_IN_ONE_PACK,
  );

  return cigarettePacksAvoided * ONE_CIGARETTE_PACK_PRICE_EUR;
};
