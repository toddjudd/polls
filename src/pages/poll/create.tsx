import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';
import { trpc } from '../../utils/trpc';

const CreatePoll: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation(['polls.create'], {
    onSuccess: () => {
      client.invalidateQueries(['polls.get-all-by-user']);
      setQuestion('');
      inputRef?.current?.focus();
    },
  });
  const [question, setQuestion] = useState('');

  return (
    <input
      type='text'
      ref={inputRef}
      disabled={isLoading}
      value={question}
      onChange={(e) => {
        setQuestion(e.currentTarget.value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          mutate({ question });
        }
      }}
    />
  );
};

export default CreatePoll;
