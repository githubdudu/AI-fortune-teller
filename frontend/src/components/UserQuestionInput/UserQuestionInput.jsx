import { useNavigate } from 'react-router-dom';
import { Button, Text, TextArea } from 'gestalt';
import styles from './UserQuestionInput.module.css';
import { useState } from 'react';

function UserQuestionInput() {
  const [input, setInput] = useState('');

  const navigate = useNavigate();

  const handleSubmit = () => {
    // TODO: Post API call to come here

    // TODO: change route accordingly
    navigate('/user-info-input');
  };

  return (
    <>
      <div className={styles.container}>
        <Text size="500">What answer do you seek?</Text>
        <TextArea
          id="text-area-user-prompty"
          onChange={({ value }) => setInput(value)}
          placeholder="Select a category or type a question"
          rows={5}
          maxLength={{
            characterCount: 280,
            errorAccessibilityLabel:
              'Limit reached. You can only use 280 characters in this field.',
          }}
          value={input}
          disabled={false}
        />
        <Button text="Tell a Fortune" onClick={handleSubmit} />
      </div>
    </>
  );
}

export default UserQuestionInput;
