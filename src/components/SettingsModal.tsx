import {navigate} from '@reach/router';
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
import * as yup from 'yup';
import {useUserSettings} from '../storage';
import {CigarettesPerDay, UserSettings} from '../types';

const FormikInputField = formikField(InputField);
const FormikRadioGroupField = formikField(RadioGroupField);

interface SettingsModalProps {
  title?: string;
  body?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({title, body}) => {
  const [userSettings, setUserSettings] = useUserSettings();

  useEffect(() => {
    if (userSettings) {
      navigate('dashboard');
    }
  }, [userSettings]);

  return (
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
              title={title || 'Settings'}
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
              <Form>
                {body && (
                  <>
                    <p>{body}</p>
                    <br />
                  </>
                )}
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
            </DialogModal>
          )}
        </Formik>
      )}
    </Modal.Container>
  );
};
