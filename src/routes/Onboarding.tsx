import {Button, DialogModal, Modal} from 'fannypack';
import React from 'react';
import {Step, Steps, Wizard} from 'react-albus';
import {SettingsModal} from '../components/SettingsModal';
import {route} from './_route';

export const Onboarding = route(_props => (
  <Wizard>
    <Steps>
      <Step
        id="welcome"
        render={({next}) => (
          <Modal.Container defaultVisible>
            {modal => (
              <DialogModal
                title="[1/2] Welcome to Surmount!"
                footer={<Button onClick={() => next()}>Continue</Button>}
                {...modal}
              >
                <p>
                  Good job on quitting smoking during pregnancy! However,
                  smoking after pregnancy can still be harmful to your child.
                  Not smoking will decrease the risk of SIDS (Sudden Infant
                  Death Syndrome) and other nasty illnesses.
                </p>
                <br />
                <p>
                  We understand how hard it can be, especially with the new
                  stress that comes with a becoming a parent. Therefore, we are
                  here to support you with your journey to being smoke-free!
                </p>
              </DialogModal>
            )}
          </Modal.Container>
        )}
      />
      <Step
        id="getting-started"
        render={() => (
          <SettingsModal
            title="[2/2] Getting started"
            body="Before we get started, we need to ask you a few questions that help us help you!"
          />
        )}
      />
    </Steps>
  </Wizard>
));
