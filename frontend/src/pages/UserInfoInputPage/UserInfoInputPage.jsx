import { Flex, Box, Text, Heading, Fieldset, TextField, Button } from 'gestalt';
import { DatePicker } from 'gestalt-datepicker';

import NationalityInputBox from './NationalityInputBox';

function UserInfoInputPage() {
  return (
    <div className="px-9 py-5 flex flex-col items-center bg-gray-50 rounded-xl shadow-md">
      <header className="pt-4 pb-6 flex flex-col items-center gap-4">
        <h1 className="text-7xl font-bold leading-7xl">Enter your details</h1>
        <h2 className="text-2xl">
          These help us tailor your cosmic reading experience
        </h2>
      </header>
      <form
        onSubmit={(e) => console.log(e)}
        className="max-w-[788px] w-[calc(100vw-4.5rem)]"
      >
        <Fieldset legend="type your details" legendDisplay="hidden">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full ">
                <TextField placeholder="First Name" size="lg" />
              </div>
              <div className="w-full ">
                <TextField placeholder="Last Name" size="lg" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <DatePicker placeholder="Date of Birth" />
              </div>
              <div className="flex-2">
                <NationalityInputBox />
              </div>
            </div>

            <div>
              <TextField placeholder="Place of Birth" size="lg" />
            </div>
            <Button text="Proceed" type="submit" size="lg" color="red" />
          </div>
        </Fieldset>
      </form>
    </div>
  );
}

export default UserInfoInputPage;
