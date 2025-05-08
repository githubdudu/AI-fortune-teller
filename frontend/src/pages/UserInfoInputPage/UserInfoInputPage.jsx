import UserDetailsForm from '$/components/UserDetailsForm';
import FormTitle from '$/components/FormTitle';

function UserInfoInputPage() {
  const HEADER_TITLE = 'Enter your details';
  const HEADER_SUBTITLE = 'These help us tailor your cosmic reading experience';
  return (
    <div className="px-9 py-5 flex flex-col items-center bg-gray-50 rounded-xl shadow-md">
      <FormTitle title={HEADER_TITLE} subtitle={HEADER_SUBTITLE} />
      <UserDetailsForm />
    </div>
  );
}

export default UserInfoInputPage;
