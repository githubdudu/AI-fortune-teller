import UserDetailsForm from './UserDetailsForm';
import UserInfoHeader from './UserInfoHeader';

function UserInfoInputPage() {
  return (
    <div className="px-9 py-5 flex flex-col items-center bg-gray-50 rounded-xl shadow-md">
      <UserInfoHeader />
      <UserDetailsForm />
    </div>
  );
}

export default UserInfoInputPage;
