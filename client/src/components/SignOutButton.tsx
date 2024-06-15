import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const SignOutButton: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('validateToken');
      showToast({ message: 'Sign out successful', type: 'SUCCESS' });
      navigate('/');
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' });
    },
  });

  const handleSignOut = () => {
    mutation.mutate();
  };

  return (
    <button onClick={handleSignOut} className="btn btn-primary">
      Sign Out
    </button>
  );
};

export default SignOutButton;
