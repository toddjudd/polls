import {
  Field,
  Form,
  Formik,
  FormikProps,
  useFormik,
  withFormik,
} from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import React, { useState } from 'react';
import { Layout } from '../../components/layout';
import { trpc } from '../../utils/trpc';
import { createQuestionValidator } from '../../shared/create-question-validator';
import { PollQuestion } from '@prisma/client';

const CreatePoll: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutateAsync, isLoading } = trpc.useMutation(['polls.create'], {
    onSuccess: () => {
      client.invalidateQueries(['polls.get-all-by-user']);
    },
  });
  const [question, setQuestion] = useState('');

  return (
    <Layout title='Polls'>
      <Formik
        initialValues={{
          question: '',
        }}
        validationSchema={toFormikValidationSchema(createQuestionValidator)}
        onSubmit={async (values, { resetForm, setSubmitting, setErrors }) => {
          await mutateAsync(
            { question: values.question },
            {
              onSuccess: (data, variables, context) => {
                if ((data as PollQuestion).id) {
                  document.location.href = `/poll/${(data as PollQuestion).id}`;
                  return;
                }
                setErrors({ question: 'Error creating poll' });
                resetForm();
                setSubmitting(false);
              },
              onError: () => {
                setErrors({ question: 'Error creating poll' });
                setSubmitting(false);
              },
              onSettled: (data, variables, context) => {
                console.log({ data, variables, context });
              },
            }
          );
        }}>
        {({ errors, touched, isSubmitting }) => {
          return (
            <Form className='grid gap-2 p-4'>
              <label htmlFor='question' className='text-lg'>
                Question
              </label>
              <Field
                id='question'
                name='question'
                disabled={isSubmitting || isLoading}
                placeholder='Why is Next.js the best?'
                className='rounded text-zinc-800 form-input'
              />
              {errors.question && touched.question && (
                <div className='text-red-500 text-sm'>{errors.question}</div>
              )}
              <button
                type='submit'
                disabled={isSubmitting || isLoading}
                className='bg-zinc-300 text-zinc-700 rounded-sm p-1'>
                {isSubmitting || isLoading ? 'Submitting..' : 'Submit'}
              </button>
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default CreatePoll;
