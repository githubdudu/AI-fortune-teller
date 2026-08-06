import UserDetailsForm from './components/UserDetailsForm';
import FormTitle from '$/components/FormTitle';
import FormContainer from '$/components/FormContainer';
import { SEO_TITLE } from '$/constants/seo';

function UserInfoInputPage() {
  const HEADER_TITLE = 'Your Fortune Profile';
  const HEADER_SUBTITLE = 'To tailor your fortune just for you.';
  return (
    <div className="py-12 px-6 lg:px-8 font-sans">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="bg-bg/90 backdrop-blur-md border border-ink/12 rounded-2xl shadow-xl p-10 lg:p-16 w-full">
          <title>{SEO_TITLE.PROFILE}</title>
          <FormContainer>
            <FormTitle
              className="text-center text-core mb-10"
              title={HEADER_TITLE}
              subtitle={HEADER_SUBTITLE}
            />
            <UserDetailsForm />
          </FormContainer>
        </div>
      </div>
    </div>
  );
}

export default UserInfoInputPage;
