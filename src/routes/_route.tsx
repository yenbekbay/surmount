import {RouteComponentProps} from '@reach/router';
import React from 'react';

export function route<TProps = {}>(
  RouteComponent: React.ComponentType<RouteComponentProps>,
) {
  class Route extends React.Component<RouteComponentProps & TProps> {
    static displayName = `Route(${RouteComponent.displayName})`;

    render() {
      return <RouteComponent {...this.props} />;
    }
  }

  return Route;
}
