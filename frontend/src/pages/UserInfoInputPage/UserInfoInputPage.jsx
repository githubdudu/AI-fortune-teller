import UserDetailsForm from './components/UserDetailsForm';
import FormTitle from '$/components/FormTitle';
import FormContainer from '$/components/FormContainer';
import { SEO_TITLE } from '$/constants/seo';

function UserInfoInputPage() {
  const HEADER_TITLE = 'Your Fortune Profile';
  const HEADER_SUBTITLE = 'To tailor your fortune just for you.';
  return (
    <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-green-100 rounded-2xl border-2 border-white py-12 px-6 lg:px-8 font-sans">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-10 lg:p-16 w-full">
          <title>{SEO_TITLE.PROFILE}</title>
          <FormContainer>
            <FormTitle
              className="text-center text-purple-600 mb-10"
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
