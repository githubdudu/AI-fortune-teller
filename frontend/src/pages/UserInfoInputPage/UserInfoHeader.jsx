function UserInfoHeader() {
  const HEADER_TITLE = 'Enter your details';
  const HEADER_SUBTITLE = 'These help us tailor your cosmic reading experience';

  return (
    <header className="pt-4 pb-6 flex flex-col items-center gap-4">
      <h1 className="text-7xl font-bold leading-7xl">{HEADER_TITLE}</h1>
      <h2 className="text-2xl">{HEADER_SUBTITLE}</h2>
    </header>
  );
}

export default UserInfoHeader;
