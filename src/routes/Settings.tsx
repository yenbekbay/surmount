import {RouteComponentProps} from '@reach/router';
import React from 'react';
import {SettingsModal} from '../components/SettingsModal';

interface SettingsProps extends RouteComponentProps {}

export const Settings: React.FC<SettingsProps> = _props => <SettingsModal />;
