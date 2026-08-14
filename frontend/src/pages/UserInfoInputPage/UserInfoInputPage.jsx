import UserDetailsForm from './components/UserDetailsForm';
import FormTitle from '$/components/FormTitle';
import { SEO_TITLE } from '$/constants/seo';

function UserInfoInputPage() {
  const HEADER_TITLE = 'Your Fortune Profile';
  const HEADER_SUBTITLE = 'To tailor your fortune just for you.';
  return (
    <div className="w-full mx-auto flex flex-col justify-center">
      <title>{SEO_TITLE.PROFILE}</title>
      <div
        className={`px-9 sm:px-9 py-10 sm:w-auto my-12 mx-1 sm:mx-auto flex flex-col items-center bg-bg shadow-md ring-4 ring-celestine rounded-xl`}
      >
        <FormTitle
          className="text-center text-core mb-10"
          title={HEADER_TITLE}
          subtitle={HEADER_SUBTITLE}
        />
        <UserDetailsForm />
      </div>
    </div>
  );
}

export default UserInfoInputPage;
