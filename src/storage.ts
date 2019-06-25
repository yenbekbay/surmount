import {useLocalStorage} from 'react-use';

export const kUserSettings = '@surmount/user-settings';

export const useUserSettings = () => {
  return useLocalStorage(kUserSettings);
};
