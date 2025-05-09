import UserDetailsForm from '$/components/UserDetailsForm';
import FormTitle from '$/components/FormTitle';
import FormContainer from '$/components/FormContainer';

function UserInfoInputPage() {
  const HEADER_TITLE = 'Enter your details';
  const HEADER_SUBTITLE = 'These help us tailor your cosmic reading experience';
  return (
    <FormContainer>
      <FormTitle title={HEADER_TITLE} subtitle={HEADER_SUBTITLE} />
      <UserDetailsForm />
    </FormContainer>
  );
}

export default UserInfoInputPage;
