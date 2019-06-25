import {useLocalStorage} from 'react-use';
import {UserSettings, UserState} from './types';

export const kUserSettings = '@surmount/user-settings';
export const kUserState = '@surmount/user-state';

export const useUserSettings = () =>
  useLocalStorage<UserSettings | null>(kUserSettings);

export const useUserState = () => useLocalStorage<UserState | null>(kUserState);
