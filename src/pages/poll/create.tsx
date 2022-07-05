import {
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
  useFormik,
  withFormik,
} from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import React, { useState } from 'react';
import { Layout } from '../../components/layout';
import { trpc } from '../../utils/trpc';
import {
  CreateQuestionInputType,
  createQuestionValidator,
} from '../../shared/create-question-validator';
import { PollQuestion } from '@prisma/client';
import { useRouter } from 'next/router';

const CreatePoll: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutateAsync, isLoading, data } = trpc.useMutation(['polls.create'], {
    onSuccess: () => {
      client.invalidateQueries(['polls.get-all-by-user']);
    },
  });
  const [question, setQuestion] = useState('');
  const router = useRouter();

  return (
    <Layout title='Polls'>
      <Formik
        initialValues={{
          question: '',
        }}
        validationSchema={toFormikValidationSchema(createQuestionValidator)}
        onSubmit={async (
          values,
          {
            resetForm,
            setSubmitting,
            setErrors,
          }: FormikHelpers<CreateQuestionInputType>
        ) => {
          await mutateAsync(
            { question: values.question },
            {
              onSuccess: (data, variables, context) => {
                router.push(`/poll/${(data as PollQuestion).id}`);
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
                disabled={isSubmitting || isLoading || !!data}
                placeholder='Why is Next.js the best?'
                className='rounded text-zinc-800 form-input'
              />
              {errors.question && touched.question && (
                <div className='text-red-500 text-sm'>{errors.question}</div>
              )}
              <button
                type='submit'
                disabled={isSubmitting || isLoading || !!data}
                className='bg-zinc-300 text-zinc-700 rounded-sm p-1'>
                {isSubmitting || isLoading || data ? 'Submitting..' : 'Submit'}
              </button>
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default CreatePoll;
