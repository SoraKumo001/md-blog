import { useCallback } from 'react';
import { useSignInMutation } from '@/generated/graphql';
import { useDispatch, useSelector } from '@/libs/context';

type StoreUser = { user: { email: string; name: string } | null | undefined };

export const useUser = () => {
  return useSelector((state: StoreUser) => state.user);
};

export const useSignOut = () => {
  const dispatch = useDispatch<StoreUser>();
  const [, signIn] = useSignInMutation();
  return useCallback(() => {
    signIn({}).then(() => dispatch((state) => ({ ...state, user: null })));
  }, [dispatch, signIn]);
};

export const useSignIn = () => {
  const dispatch = useDispatch<StoreUser>();
  const [, signIn] = useSignInMutation();
  return useCallback(
    (token: string) =>
      signIn({ token }).then(
        ({ data }) => data?.SignIn && dispatch((state) => ({ ...state, user: data.SignIn }))
      ),
    [dispatch, signIn]
  );
};
