import {useLocalStorage} from 'react-use';

export const kUserSettings = '@surmount/user-settings';
export const kUserState = '@surmount/user-state';

export const useUserSettings = () => useLocalStorage(kUserSettings);

export const useUserState = () => useLocalStorage(kUserState);
