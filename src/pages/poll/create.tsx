import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import {
  Control,
  DeepRequired,
  FieldErrorsImpl,
  FieldNamesMarkedBoolean,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormRegister,
  UseFormTrigger,
} from 'react-hook-form';

import {
  CreatePollInputType,
  createPollValidator,
} from '../../shared/create-poll-validator';
import { trpc } from '../../utils/trpc';

const inputStyle =
  'bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 dark:bg-zinc-600 dark:border-zinc-500 dark:placeholder-zinc-300 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500';
const inputErrorStyle =
  'border border-red-500 text-red-900 placeholder-red-700  text-sm rounded-lg  block w-full p-2.5 dark:bg-zinc-600 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500';

const InputWithButton = () => {
  return (
    <div className='relative'>
      <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'></div>
      <input
        type='search'
        id='search'
        className='block p-4 pl-10 w-full text-sm text-zinc-800 bg-zinc-50 rounded-lg border border-zinc-200 focus:ring-amber-500 focus:border-amber-500 dark:bg-zinc-600 dark:border-zinc-500 dark:placeholder-zinc-300 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500'
        placeholder='Search'
        required
      />
      <button
        type='submit'
        className='text-white absolute right-2.5 bottom-2.5 bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-amber-500 dark:hover:bg-amber-600 dark:focus:ring-amber-800'>
        Search
      </button>
    </div>
  );
};
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
  control: Control<CreatePollInputType>;
  register: UseFormRegister<CreatePollInputType>;
  errors: FieldErrorsImpl<DeepRequired<CreatePollInputType>>;
  trigger: UseFormTrigger<CreatePollInputType>;
  disabled: boolean;
  touchedFields: FieldNamesMarkedBoolean<CreatePollInputType>;
}> = ({ control, register, errors, trigger, disabled, touchedFields }) => {
  const { fields, append, remove } = useFieldArray<CreatePollInputType>({
    name: 'options',
    control,
  });

  return (
    <div className='flex flex-col gap-2'>
      {fields.map((field, i) => (
        <div key={field.id} className='grid grid-cols-1 gap-2'>
          <div className='relative'>
            <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'></div>
            <input
              {...register(`options.${i}.text`, { disabled })}
              type='text'
              placeholder={`Option ${i + 1}`}
              className='block p-3 w-full text-sm text-zinc-800 bg-zinc-50 rounded-lg border border-zinc-200 focus:ring-amber-500 focus:border-amber-500 dark:bg-zinc-600 dark:border-zinc-500 dark:placeholder-zinc-300 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500'
            />
            <button
              onClick={() => remove(i)}
              disabled={disabled}
              className='text-white absolute right-2 bottom-2 bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-md text-sm px-4 py-2 dark:bg-amber-500 dark:hover:bg-amber-600 dark:focus:ring-amber-700'>
              <MinusCircleIcon className='h-4 w-4 text-zinc-300' />
            </button>
          </div>
          {touchedFields?.options?.[i]?.text &&
            errors.options?.[i]?.text?.message && (
              <p className='text-red-400 text-sm'>
                {errors.options?.[i]?.text?.message}
              </p>
            )}
        </div>
      ))}
      <Button
        className=' self-start bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-md text-sm px-4 py-2 dark:bg-amber-500 dark:hover:bg-amber-600 dark:focus:ring-amber-700'
        onClick={() => {
          append({ text: '' });
          if (errors.options?.message) trigger('options');
        }}
        disabled={disabled}>
        <MinusCircleIcon className='h-4 w-4 text-zinc-300' />
      </Button>
    </div>
  );
};

const CreatePoll: React.FC = () => {
  const client = trpc.useContext();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, touchedFields },
    trigger,
  } = useForm<CreatePollInputType>({
    mode: 'onBlur',
    resolver: zodResolver(createPollValidator),
    defaultValues: {
      options: [{ text: '' }, { text: '' }],
    },
  });

  const { mutate, isLoading, data } = trpc.useMutation(['polls.create'], {
    onSuccess: () => {
      client.invalidateQueries(['polls.get-all']);
    },
  });

  const onValid: SubmitHandler<CreatePollInputType> = (data) => {
    mutate(data, {
      onSuccess(data) {
        router.push(`/poll/${data.id}`);
      },
      onError: () => {
        throw new Error('Failed to create poll');
        setError('question', { type: 'custom', message: 'custom message' });
      },
    });
  };

  const disabled = isSubmitting || isLoading || !!data;

  return (
    <div className='max-w-4xl flex-1 bg-zinc-600 m-8 rounded-lg '>
      <form
        onSubmit={handleSubmit(onValid, (errors) => {
          console.log(errors);
        })}
        className='grid gap-2 p-4'>
        <label
          htmlFor='question'
          className='block mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200'>
          Question
        </label>
        <input
          {...register('question', { disabled })}
          type='text'
          className={errors.question ? inputErrorStyle : inputStyle}
        />
        {errors.question && (
          <p className='text-red-400 text-sm'>{errors.question.message}</p>
        )}
        <label className='label'>
          <span className='label-text font-semibold text-base'>
            Add options
          </span>
        </label>
        {errors.options?.message && (
          <p className='text-red-400 text-sm'>{errors.options?.message}</p>
        )}
        <Options
          control={control}
          register={register}
          errors={errors}
          trigger={trigger}
          disabled={disabled}
          touchedFields={touchedFields}
        />
        <button
          type='submit'
          disabled={disabled}
          className='bg-amber-500 hover:bg-amber-600 text-white rounded-sm p-1'>
          {disabled ? 'Submitting..' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
