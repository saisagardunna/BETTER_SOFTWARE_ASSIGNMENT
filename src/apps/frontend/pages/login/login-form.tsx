import React from 'react';
import { Link } from 'react-router-dom';

import { AsyncError } from 'frontend/types';
import {
  VerticalStackLayout,
  FormControl,
  PasswordInput,
  Flex,
  Button,
  Input,
} from 'frontend/components';
import { CustomLayout } from 'frontend/components/layouts/custom-layout.component';
import { LayoutType } from 'frontend/components/layouts/layout-config';
import routes from 'frontend/constants/routes';
import LoginFormCheckbox from 'frontend/pages/login/login-form-checkbox';
import useLoginForm from 'frontend/pages/login/login-form.hook';
import { ButtonType, ButtonKind } from 'frontend/types/button';

type LoginFields = 'username' | 'password';

interface LoginFormProps {
  onSuccess: () => void;
  onError: (error: AsyncError) => void;
  layoutType?: LayoutType;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onError,
  onSuccess,
  layoutType = LayoutType.Default,
}) => {
  const { formik, isLoginLoading } = useLoginForm({ onSuccess, onError });

  const getFormikError = (field: LoginFields): string =>
    formik.touched[field] && typeof formik.errors[field] === 'string'
      ? formik.errors[field]
      : '';

  return (
    <CustomLayout layoutType={layoutType}>
      <form onSubmit={formik.handleSubmit}>
        <VerticalStackLayout gap={5}>
          {/* EMAIL */}
          <FormControl label="Email" error={getFormikError('username')}>
            <Input
              data-testid="username"
              disabled={isLoginLoading}
              endEnhancer={
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
                  alt="email icon"
                  width={20}
                  height={20}
                  style={{ opacity: 0.6 }}
                />
              }
              error={getFormikError('username')}
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Enter your email"
              value={formik.values.username}
            />
          </FormControl>

          {/* PASSWORD */}
          <FormControl label="Password" error={getFormikError('password')}>
            <PasswordInput
              disabled={isLoginLoading}
              error={getFormikError('password')}
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Enter your password"
              value={formik.values.password}
            />
          </FormControl>

          {/* REMEMBER + FORGOT */}
          <Flex alignItems="center" justifyContent="between">
            <label className="flex items-center gap-2 cursor-pointer">
              <LoginFormCheckbox />
              <span>Remember me</span>
            </label>

            <Link
              to={routes.FORGOT_PASSWORD}
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </Flex>

          {/* SUBMIT */}
          <Button
            type={ButtonType.SUBMIT}
            kind={ButtonKind.PRIMARY}
            isLoading={isLoginLoading}
            disabled={!formik.isValid || isLoginLoading}
          >
            Log In
          </Button>

          {/* SIGN UP */}
          <p className="self-center font-medium">
            Don’t have an account?{' '}
            <Link to={routes.SIGNUP} className="text-primary">
              Sign Up
            </Link>
          </p>
        </VerticalStackLayout>
      </form>
    </CustomLayout>
  );
};

export default LoginForm;
