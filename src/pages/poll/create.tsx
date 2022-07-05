import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
  useFormik,
  withFormik,
} from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout';
import { trpc } from '../../utils/trpc';
import {
  CreateQuestionInputType,
  createQuestionValidator,
} from '../../shared/create-question-validator';
import { PollQuestion } from '@prisma/client';
import { useRouter } from 'next/router';

const Button = ({ children, ...props }: any) => {
  return (
    <button
      type='button'
      {...props}
      className={
        'bg-zinc-300 hover:bg-zinc-400 text-zinc-800 font-bold py-2 px-4 rounded box-border ' +
        props.className
      }>
      {children}
    </button>
  );
};

const Options: React.FC<{
  values: CreateQuestionInputType;
  helpers: FieldArrayRenderProps;
}> = ({ values, helpers: { push, remove } }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (inputRef.current && touched) {
      inputRef.current?.focus();
    }
  }, [touched]);
  return (
    <div className='grid grid-cols-[1fr_auto] gap-2'>
      {values.options.map((_, i, { length }) => (
        <>
          <Field
            key={i}
            name={`options.${i}`}
            placeholder={`Option ${i + 1}`}
            className='rounded text-zinc-800 form-input'
            innerRef={i + 1 === length ? inputRef : null}
          />
          <Button
            onClick={() => {
              remove(i);
              setTouched(true);
            }}>
            -
          </Button>
        </>
      ))}
      <Button
        className='col-start-2'
        onClick={() => {
          push('');
          setTouched(true);
        }}>
        +
      </Button>
    </div>
  );
};

const CreatePoll: React.FC = () => {
  const client = trpc.useContext();
  const { mutateAsync, isLoading, data } = trpc.useMutation(['polls.create'], {
    onSuccess: () => {
      client.invalidateQueries(['polls.get-all-by-user']);
    },
  });
  const router = useRouter();

  return (
    <Layout title='Polls'>
      <Formik
        initialValues={{
          question: '',
          options: ['', ''],
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
            { ...values },
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
        {({ values, errors, touched, isSubmitting }) => {
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
              <label htmlFor='options'>Options</label>
              <FieldArray name='options'>
                {(helpers) => {
                  if (!values.options.length)
                    return <Button onClick={() => helpers.push('')}>+</Button>;
                  return <Options values={values} helpers={helpers} />;
                }}
              </FieldArray>

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
