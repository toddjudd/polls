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
import { Layout } from '../../components/layout';
import { trpc } from '../../utils/trpc';
import {
  CreatePollInputType,
  createPollValidator,
} from '../../shared/create-poll-validator';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';

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
  const { fields, append, prepend, remove, swap, move, insert } =
    useFieldArray<CreatePollInputType>({
      name: 'options',
      control,
    });

  return (
    <div className='flex flex-col gap-2'>
      {fields.map((field, i, { length }) => (
        <div key={field.id} className='grid grid-cols-[1fr_auto] gap-2'>
          <input
            {...register(`options.${i}.text`, { disabled })}
            type='text'
            className='rounded text-zinc-800 form-input '
            placeholder={`Option ${i + 1}`}
            // ref={i + 1 === length ? focusRef : null}
          />
          <Button
            onClick={() => {
              remove(i);
            }}
            disabled={disabled}
            tabIndex='-1'>
            -
          </Button>
          {touchedFields?.options?.[i]?.text &&
            errors.options?.[i]?.text?.message && (
              <p className='text-red-400 text-sm'>
                {errors.options?.[i]?.text?.message}
              </p>
            )}
        </div>
      ))}
      <Button
        className='self-start'
        onClick={() => {
          append({ text: '' });
          if (errors.options?.message) trigger('options');
        }}
        disabled={disabled}>
        +
      </Button>
    </div>
  );
};

const CreatePoll: React.FC = () => {
  const client = trpc.useContext();
  const router = useRouter();
  const {
    register,
    watch,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, touchedFields },
    getValues,
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
      client.invalidateQueries(['polls.get-all-by-user']);
    },
  });

  const onValid: SubmitHandler<CreatePollInputType> = (data) => {
    mutate(data, {
      onSuccess(data, variables, context) {
        router.push(`/poll/${data.id}`);
      },
      onError: () => {
        throw new Error('Failed to create poll');
        setError('question', { type: 'custom', message: 'custom message' });
      },
    });
  };

  let disabled = isSubmitting || isLoading || !!data;

  return (
    <form
      onSubmit={handleSubmit(onValid, (errors) => {
        console.log(errors);
      })}
      className='grid gap-2 p-4'>
      {/* <label htmlFor='question' className='text-lg'>
          Question
        </label> */}
      <label className='label'>
        <span className='label-text font-semibold text-base'>
          Your Question
        </span>
      </label>
      <input
        {...register('question', { disabled })}
        type='text'
        className='rounded text-zinc-800 form-input '
        placeholder='How do magnets work?'
      />
      {errors.question && (
        <p className='text-red-400 text-sm'>{errors.question.message}</p>
      )}
      <label className='label'>
        <span className='label-text font-semibold text-base'>Add options</span>
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
        className='bg-zinc-300 text-zinc-700 rounded-sm p-1'>
        {disabled ? 'Submitting..' : 'Submit'}
      </button>
    </form>
  );
};

export default CreatePoll;
