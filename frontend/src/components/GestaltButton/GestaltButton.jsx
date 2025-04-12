import { Button, Flex } from 'gestalt';

export default function GestaltButton() {
  return (
    <Flex
      alignItems="center"
      height="100%"
      justifyContent="center"
      width="100%"
    >
      <Button size="lg" color="red" text="This is a Gestalt button example" />
    </Flex>
  );
}
