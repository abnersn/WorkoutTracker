import { useMutation } from "@apollo/client/react";
import { graphql } from "@workout-tracker/api";
import {
  AuthForm,
  readText,
  type AuthScreenProps,
} from "../components/auth-form";
import { AuthField, EmailField, PasswordField } from "../components/auth-field";

const SignUp = graphql(/* GraphQL */ `
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        id
        displayName
      }
    }
  }
`);

export function SignUpScreen(props: AuthScreenProps): React.JSX.Element {
  const [signUp, { loading, error }] = useMutation(SignUp);

  async function submit(form: FormData): Promise<string | undefined> {
    const { data } = await signUp({
      variables: {
        input: {
          email: readText(form, "email"),
          password: readText(form, "password", false),
          displayName: readText(form, "displayName"),
        },
      },
    });
    return data?.signUp.token;
  }

  return (
    <AuthForm
      {...props}
      title="Sign up"
      submitLabel="Sign up"
      pendingLabel="Signing up…"
      loading={loading}
      error={error}
      submit={submit}
      alternative={{
        prompt: "Already have an account?",
        label: "Sign in",
        screen: "sign-in",
      }}
    >
      <EmailField />
      <AuthField
        name="displayName"
        label="Display name"
        maxLength={60}
        pattern=".*\S.*"
        title="Display name can't be blank"
        autoComplete="nickname"
      />
      <PasswordField isNew />
    </AuthForm>
  );
}
