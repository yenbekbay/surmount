export type IsoDate = string;
export enum CigarettesPerDay {
  FiveOrFewer = '5-or-fewer',
  FiveToTen = '5-10',
  TenToThirty = '10-30',
  ThirtyOrMore = '30-or-more',
}

export interface UserSettings {
  lastSmokedAt: IsoDate;
  cigarettesPerDay: CigarettesPerDay;
}
