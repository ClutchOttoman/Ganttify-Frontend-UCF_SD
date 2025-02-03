import React from 'react';
import { useParams } from 'react-router-dom';
import ConfirmRestore from '../components/ConfirmRestore';

const ConfirmRestorePage = () => {
  const { userId, token } = useParams();

  return (
    <div>
      <ConfirmRestore userId={userId} token={token} />
    </div>
  );
};

export default ConfirmRestorePage;
