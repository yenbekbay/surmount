import {RouteComponentProps, navigate} from '@reach/router';
import {Menu, Overlay, Portal} from 'fannypack';
import React from 'react';
export function route<TProps = {}>(
  RouteComponent: React.ComponentType<RouteComponentProps>,
) {
  class Route extends React.Component<RouteComponentProps & TProps> {
    render() {
      return (
        <>
          <Portal>
            <Overlay visible placement="top-start" top="0.5rem" left="0.5rem">
              <Menu.Popover
                content={
                  <Menu a11yTitle="Main menu">
                    <Menu.Group>
                      <Menu.Item
                        onClick={() => {
                          navigate('dashboard');
                        }}
                      >
                        Dashboard
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          navigate('settings');
                        }}
                      >
                        Settings
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          navigate('contact');
                        }}
                      >
                        Contact us
                      </Menu.Item>
                    </Menu.Group>
                  </Menu>
                }
              >
                <Menu.Button>Menu</Menu.Button>
              </Menu.Popover>
            </Overlay>
          </Portal>
          <RouteComponent {...this.props} />
        </>
      );
    }
  }

  return Route;
}
