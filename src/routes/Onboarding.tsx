import {navigate, RouteComponentProps} from '@reach/router';
import {format as formatDate} from 'date-fns';
import {
  Button,
  DialogModal,
  formikField,
  InputField,
  Modal,
  RadioGroupField,
} from 'fannypack';
import {Field, Form, Formik} from 'formik';
import React, {useEffect} from 'react';
import {Step, Steps, Wizard} from 'react-albus';
import * as yup from 'yup';
import {useUserSettings} from '../storage';
import {CigarettesPerDay, UserSettings} from '../types';

const FormikInputField = formikField(InputField);
const FormikRadioGroupField = formikField(RadioGroupField);

interface OnboardingProps extends RouteComponentProps {}

export const Onboarding: React.FC<OnboardingProps> = _props => {
  const [userSettings, setUserSettings] = useUserSettings();

  useEffect(() => {
    if (userSettings) {
      navigate('dashboard');
    }
  }, [userSettings]);

  return (
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
                    stress that comes with a becoming a parent. Therefore, we
                    are here to support you with your journey to being
                    smoke-free!
                  </p>
                </DialogModal>
              )}
            </Modal.Container>
          )}
        />
        <Step
          id="getting-started"
          render={() => (
            <Modal.Container defaultVisible>
              {modal => (
                <Formik<UserSettings>
                  initialValues={{
                    lastSmokedAt: formatDate(new Date(), 'YYYY-MM-DD'),
                    cigarettesPerDay: CigarettesPerDay.FiveToTen,
                  }}
                  onSubmit={(values, actions) => {
                    setUserSettings(values);
                    actions.setSubmitting(false);
                  }}
                  validationSchema={yup.object().shape({
                    lastSmokedAt: yup.date().required(),
                    cigarettesPerDay: yup
                      .string()
                      .oneOf(Object.values(CigarettesPerDay))
                      .required(),
                  })}
                >
                  {form => (
                    <DialogModal
                      title="[2/2] Getting started"
                      footer={
                        <Button
                          onClick={form.handleSubmit}
                          isLoading={form.isSubmitting}
                        >
                          Continue
                        </Button>
                      }
                      {...modal}
                    >
                      <>
                        <p>
                          Before we get started, we need to ask you a few
                          questions that help us help you!
                        </p>
                        <br />

                        <Form>
                          <Field
                            name="lastSmokedAt"
                            component={FormikInputField}
                            label="When was the last time you smoked?"
                            type="date"
                            max={formatDate(new Date(), 'YYYY-MM-DD')}
                          />
                          <br />
                          <Field
                            name="cigarettesPerDay"
                            component={FormikRadioGroupField}
                            label="How many cigarettes did you smoke a day (roughly)?"
                            options={[
                              {
                                label: '5 or fewer',
                                value: CigarettesPerDay.FiveOrFewer,
                              },
                              {
                                label: '5-10',
                                value: CigarettesPerDay.FiveToTen,
                              },
                              {
                                label: '10-30',
                                value: CigarettesPerDay.TenToThirty,
                              },
                              {
                                label: '30 or more',
                                value: CigarettesPerDay.ThirtyOrMore,
                              },
                            ]}
                          />
                        </Form>
                      </>
                    </DialogModal>
                  )}
                </Formik>
              )}
            </Modal.Container>
          )}
        />
      </Steps>
    </Wizard>
  );
};
